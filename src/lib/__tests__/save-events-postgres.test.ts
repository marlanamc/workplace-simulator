import { beforeAll, describe, expect, it } from 'vitest';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/neon-http';
import { submissionInsert } from '../db/submission-saves';
import { preparePendingSave, type PendingSave } from '../pending-save';
import { PgDialect } from 'drizzle-orm/pg-core';
import { lessonSaveStatement } from '../db/lesson-saves';
import { recordFinish } from '../lessons/attempts';

// Optional real-Postgres check. Only an explicitly supplied local port and a
// dedicated database named workplace_save_test are ever used; never DATABASE_URL.
const port = process.env.SAVE_TEST_PG_PORT;
function query(statement: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('psql', ['-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-h', '127.0.0.1', '-p', port!, '-d', 'workplace_save_test']);
    let out = '', err = '';
    child.stdout.on('data', data => { out += data; });
    child.stderr.on('data', data => { err += data; });
    child.on('error', reject);
    child.on('close', code => code ? reject(new Error(err)) : resolve(out.trim()));
    child.stdin.end(statement);
  });
}
const owner = '00000000-0000-4000-8000-000000000001';
const event = (id: number, mode: 'guided' | 'independent' = 'guided') => ({ id: `00000000-0000-4000-8000-${String(id).padStart(12, '0')}`, attempt: recordFinish(null, mode, `2026-10-24T${id === 1 ? '10' : '11'}:00:00Z`) });
function save(activity: string, events: ReturnType<typeof event>[]) {
  const compiled = new PgDialect().sqlToQuery(lessonSaveStatement(owner, activity, events));
  return query(compiled.sql.replace(/\$(\d+)/g, (_, n) => `'${String(compiled.params[Number(n) - 1]).replaceAll("'", "''")}'`));
}
async function state(activity: string) {
  return JSON.parse(await query(`SELECT state FROM practice_attempts WHERE activity_id = '${activity}'`));
}

describe.skipIf(!port)('atomic lesson and writing saves in PostgreSQL', () => {
  beforeAll(async () => {
    await query(`CREATE TABLE IF NOT EXISTS learners (id uuid PRIMARY KEY); INSERT INTO learners VALUES ('${owner}') ON CONFLICT DO NOTHING;`);
    await query(readFileSync('src/lib/db/migrations/20260924-practice.sql', 'utf8'));
    const migration = readFileSync('src/lib/db/migrations/20261024-lesson-save-events.sql', 'utf8');
    await query(migration);
    await query(migration); // Deploys reapply additive migrations.
    await query(`CREATE TABLE IF NOT EXISTS submissions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), learner_id uuid NOT NULL REFERENCES learners(id),
      task_key text NOT NULL, content jsonb NOT NULL, submitted_at timestamptz NOT NULL DEFAULT now(),
      teacher_note text, noted_at timestamptz, seen_at timestamptz
    )`);
    const writingMigration = readFileSync('src/lib/db/migrations/20261024-submission-attempts.sql', 'utf8');
    await query(writingMigration);
    await query(writingMigration);
  });
  it('keeps both concurrent finishes, and replaying either receipt is a no-op', async () => {
    const activity = `concurrent-${crypto.randomUUID()}`;
    await save(activity, [event(1), event(2)]); // Existing count two.
    await Promise.all([save(activity, [event(3)]), save(activity, [event(4, 'independent')])]);
    expect((await state(activity)).attempts).toBe(4);
    await Promise.all([save(activity, [event(3)]), save(activity, [event(4, 'independent')])]);
    expect((await state(activity)).attempts).toBe(4);
  });
  it('accepts out-of-order snapshots once and retains the latest mode/time', async () => {
    const activity = `retry-${crypto.randomUUID()}`;
    await save(activity, [event(1), event(2, 'independent')]);
    await save(activity, [event(1)]);
    expect(await state(activity)).toMatchObject({ attempts: 2, mode: 'independent', modes: ['guided', 'independent'] });
    await save(activity, []);
    expect((await state(activity)).attempts).toBe(2);
  });
  it('counts a transferred aggregate once and caps history at twenty', async () => {
    const activity = `transfer-${crypto.randomUUID()}`;
    const transfer = { ...event(1), attempt: { ...event(1).attempt, attempts: 30, modes: Array<'guided'>(20).fill('guided') } };
    await save(activity, [transfer]);
    await save(activity, [transfer, event(2, 'independent')]);
    expect(await state(activity)).toMatchObject({ attempts: 31, mode: 'independent' });
    expect((await state(activity)).modes).toHaveLength(20);
  });
  it('a writing save followed by completion failure retries once, but a new revision remains distinct', async () => {
    const request: PendingSave = { taskKey: 'portfolio-reflection', submission: { lang: 'en', fields: [{ label: 'Reflection', value: 'My work' }] } };
    let pending = preparePendingSave([], request);
    const attemptId = pending.submissionAttemptId!;
    const write = async (item: PendingSave) => {
      const compiled = submissionInsert(drizzle.mock(), owner, item.taskKey, item.submission!, item.submissionAttemptId!).toSQL();
      await query(compiled.sql.replace(/\$(\d+)/g, (_, n) => `'${String(compiled.params[Number(n) - 1]).replaceAll("'", "''")}'`));
    };
    const complete = async () => { throw new Error('Completion unavailable'); };
    await expect((async () => { await write(pending); await complete(); })()).rejects.toThrow('Completion unavailable');
    // Simulate a reload, then both a lost-ack retry and a concurrent duplicate.
    pending = preparePendingSave(JSON.parse(JSON.stringify([pending])), request);
    await Promise.all([write(pending), write(pending)]);
    expect(await query(`SELECT count(*) FROM submissions WHERE attempt_id = '${attemptId}'`)).toBe('1');
    await query(`UPDATE submissions SET teacher_note = 'Keep this note', seen_at = now() WHERE attempt_id = '${attemptId}'`);
    await write(pending);
    expect(await query(`SELECT teacher_note FROM submissions WHERE attempt_id = '${attemptId}'`)).toBe('Keep this note');
    const revision = preparePendingSave([], request); // prior save succeeded; queue is empty
    await write(revision);
    expect(await query(`SELECT count(*) FROM submissions WHERE attempt_id IN ('${attemptId}', '${revision.submissionAttemptId}')`)).toBe('2');
  });

});
