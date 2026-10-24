import { afterEach, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function run({ shellUrl, fail = false }: { shellUrl?: string; fail?: boolean } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'workplace-migrate-'));
  roots.push(root);
  const folder = join(root, 'src/lib/db/migrations');
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, '002.sql'), 'SELECT 2');
  writeFileSync(join(folder, '001.sql'), 'SELECT 1');
  writeFileSync(join(root, '.env.local'), 'DATABASE_URL=postgresql://fixture/local\n');
  writeFileSync(join(root, '.env.production.local'), 'DATABASE_URL=postgresql://fixture/production\n');
  const env = { ...process.env };
  delete env.DATABASE_URL;
  delete env.__NEXT_PROCESSED_ENV;
  env.NODE_ENV = 'production';
  if (shellUrl) env.DATABASE_URL = shellUrl;
  // The injected client cannot contact a database. This tests the real env loader.
  return spawnSync(process.execPath, ['--input-type=module', '-e', `
    import { runMigrations } from ${JSON.stringify(pathToFileURL(resolve('scripts/migrate.mjs')).href)};
    await runMigrations({ root: ${JSON.stringify(root)}, createSql: url => ({ query: async sql => {
      console.log('FIXTURE', url, sql);
      if (${fail}) throw new Error('fixture failure');
    } }) });
  `], { env, encoding: 'utf8' });
}
it('loads the production build environment before migrating and runs files in order', () => {
  const result = run();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('FIXTURE postgresql://fixture/production SELECT 1');
  expect(result.stdout.indexOf('SELECT 1')).toBeLessThan(result.stdout.indexOf('SELECT 2'));
  expect(result.stdout).not.toContain('skipping');
});
it('preserves an explicitly supplied deployment database', () => {
  const result = run({ shellUrl: 'postgresql://fixture/shell' });
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('FIXTURE postgresql://fixture/shell SELECT 1');
});
it('fails the process and does not run later migrations after a failed statement', () => {
  const result = run({ fail: true });
  expect(result.status).not.toBe(0);
  expect(result.stdout).not.toContain('SELECT 2');
});
