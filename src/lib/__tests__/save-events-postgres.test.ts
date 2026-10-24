import { beforeAll, describe, expect, it } from 'vitest';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
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

describe.skipIf(!port)('atomic lesson saves in PostgreSQL', () => {
  beforeAll(async () => {
    await query(`CREATE TABLE IF NOT EXISTS learners (id uuid PRIMARY KEY); INSERT INTO learners VALUES ('${owner}') ON CONFLICT DO NOTHING;`);
    await query(readFileSync('src/lib/db/migrations/20260924-practice.sql', 'utf8'));
    const migration = readFileSync('src/lib/db/migrations/20261024-lesson-save-events.sql', 'utf8');
    await query(migration);
    await query(migration); // Deploys reapply additive migrations.
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
    const transfer = { ...event(1), attempt: { ...event(1).attempt, attempts: 30, modes: Array< 'guided'> (20).fill('guided') } };
    await save(activity, [transfer]);
    await save(activity, [transfer, event(2, 'independent')]);
    expect(await state(activity)).toMatchObject({ attempts: 31, mode: 'independent' });
    expect((await state(activity)).modes).toHaveLength(20);
  });
});
