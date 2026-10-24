import { beforeEach, describe, expect, it, vi } from 'vitest';
import { drizzle } from 'drizzle-orm/neon-http';
import { execFileSync } from 'node:child_process';
import * as schema from '../db/schema';
const m = vi.hoisted(() => ({ db: vi.fn() }));
vi.mock('../db/client', () => ({ getDb: m.db }));
import { deleteCompletions, replaceProgress, resetLevelProgress } from '../db/queries';
const port = process.env.SAVE_TEST_PG_PORT;
const owner = '00000000-0000-4000-8000-000000000011';
const other = '00000000-0000-4000-8000-000000000012';
let batches: { sql: string; params: unknown[] }[][];
let failAfter: number | undefined;
function query(input: string) {
  return execFileSync('psql', ['-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-h', '127.0.0.1', '-p', port!, '-d', 'workplace_save_test'], { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}
function render(item: { sql: string; params: unknown[] }) {
  return item.sql.replace(/\$(\d+)/g, (_, n) => item.params[+n - 1] === null ? 'NULL' : `'${String(item.params[+n - 1]).replaceAll("'", "''")}'`);
}
beforeEach(() => {
  batches = []; failAfter = undefined;
  const db = drizzle.mock({ schema });
  vi.spyOn(db, 'batch').mockImplementation(async items => {
    const statements = items.map(item => (item as unknown as { toSQL(): { sql: string; params: unknown[] } }).toSQL());
    batches.push(statements);
    if (port) query('BEGIN;\n' + statements.map((statement, i) => render(statement) + ';' + (i === failAfter ? '\nSELECT 1/0;' : '')).join('\n') + '\nCOMMIT;');
    return [] as never;
  });
  m.db.mockReturnValue(db);
  if (port) {
    // Test-only tables; this suite never reads DATABASE_URL.
    query(`CREATE TABLE IF NOT EXISTS learners (id uuid PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS task_completions (id uuid DEFAULT gen_random_uuid(), learner_id uuid, task_key text, confidence text, completed_at timestamptz DEFAULT now());
      CREATE TABLE IF NOT EXISTS badges (id uuid DEFAULT gen_random_uuid(), learner_id uuid, badge_key text, awarded_at timestamptz DEFAULT now());
      CREATE TABLE IF NOT EXISTS opening_replies (learner_id uuid, message_id text, response text, lang text);
      CREATE TABLE IF NOT EXISTS submissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), learner_id uuid, task_key text, content jsonb, submitted_at timestamptz DEFAULT now(), teacher_note text, noted_at timestamptz, seen_at timestamptz);
      CREATE TABLE IF NOT EXISTS skill_rungs (id uuid DEFAULT gen_random_uuid(), learner_id uuid, skill_key text, rung integer, clean_run_streak integer, miss_streak integer, last_practiced_at timestamptz);
      DELETE FROM skill_rungs WHERE learner_id IN ('${owner}', '${other}');
      INSERT INTO skill_rungs (learner_id, skill_key, rung, clean_run_streak, miss_streak) VALUES ('${owner}', 'mail', 4, 2, 0), ('${other}', 'mail', 4, 2, 0);
      DELETE FROM task_completions WHERE learner_id IN ('${owner}', '${other}');
      DELETE FROM badges WHERE learner_id IN ('${owner}', '${other}');
      DELETE FROM opening_replies WHERE learner_id IN ('${owner}', '${other}');
      INSERT INTO learners VALUES ('${owner}'), ('${other}') ON CONFLICT DO NOTHING;
      INSERT INTO task_completions (learner_id, task_key) VALUES ('${owner}', 'mail-reply'), ('${owner}', 'later'), ('${other}', 'mail-reply');
      INSERT INTO badges (learner_id, badge_key) VALUES ('${owner}', 'track:opening'), ('${owner}', 'track:later'), ('${other}', 'track:opening');
      INSERT INTO opening_replies VALUES ('${owner}', 'hello', 'hello', 'en'), ('${other}', 'hello', 'hello', 'en');`);
  }
});
const operations = [
  { name: 'Studio replacement', count: 6, run: () => replaceProgress(owner, ['tour'], ['track:new']) },
  { name: 'completion deletion', count: 2, run: () => deleteCompletions(owner, ['mail-reply']) },
  { name: 'level replay', count: 3, run: () => resetLevelProgress(owner, ['mail-reply'], ['track:opening']) },
];
for (const operation of operations) {
  it(`${operation.name} sends all writes in one owner-scoped batch`, async () => {
    await operation.run();
    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(operation.count);
    for (const statement of batches[0]) expect(statement.params).toContain(owner);
  });
  describe.skipIf(!port)(`${operation.name} PostgreSQL rollback`, () => {
    for (let index = 0; index < operation.count; index++) {
      it(`retains the original state on failure after mutation ${index + 1}`, async () => {
        const before = snapshot();
        failAfter = index;
        await expect(operation.run()).rejects.toThrow();
        expect(snapshot()).toBe(before);
      });
    }
  });
}
function snapshot() {
  return query(`SELECT json_build_array(
    (SELECT json_agg(t ORDER BY learner_id, task_key) FROM task_completions t),
    (SELECT json_agg(b ORDER BY learner_id, badge_key) FROM badges b),
    (SELECT json_agg(r ORDER BY learner_id, message_id) FROM opening_replies r),
    (SELECT json_agg(s ORDER BY learner_id, skill_key) FROM skill_rungs s))`);
}
it.skipIf(!port)('successful replay preserves later levels and the other learner', async () => {
  await resetLevelProgress(owner, ['mail-reply'], ['track:opening']);
  expect(query(`SELECT task_key FROM task_completions WHERE learner_id = '${owner}'`)).toBe('later');
  expect(query(`SELECT badge_key FROM badges WHERE learner_id = '${owner}'`)).toBe('track:later');
  expect(query(`SELECT count(*) FROM opening_replies WHERE learner_id = '${other}'`)).toBe('1');
});

it.skipIf(!port)('Fresh and later presets reset server mastery without touching another learner', async () => {
  const submissionId = crypto.randomUUID();
  query(`INSERT INTO submissions (id, learner_id, task_key, content, teacher_note) VALUES ('${submissionId}', '${owner}', 'enrollment', '{}', 'Keep this feedback')`);
  await replaceProgress(owner, [], []);
  expect(query(`SELECT count(*) FROM skill_rungs WHERE learner_id = '${owner}'`)).toBe('0');
  expect(query(`SELECT rung FROM skill_rungs WHERE learner_id = '${other}'`)).toBe('4');
  query(`INSERT INTO skill_rungs (learner_id, skill_key, rung) VALUES ('${owner}', 'mail', 4)`);
  await replaceProgress(owner, ['tour'], ['track:new']);
  expect(query(`SELECT count(*) FROM skill_rungs WHERE learner_id = '${owner}'`)).toBe('0');
  expect(query(`SELECT teacher_note FROM submissions WHERE id = '${submissionId}'`)).toBe('Keep this feedback');
});
