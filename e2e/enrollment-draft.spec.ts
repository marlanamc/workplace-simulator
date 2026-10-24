import { expect, test } from '@playwright/test';
import { build } from 'esbuild';

// Render the real task, draft hook and storage in Chromium. Only account/lesson
// context is supplied by the fixture; no login, server action or database runs.
let bundle: string;
test.beforeAll(async () => {
  const result = await build({
    stdin: { contents: `import { createRoot } from 'react-dom/client'; import Task from './src/app/browser/CollegePortalTask'; createRoot(document.getElementById('root')).render(<Task />);`, resolveDir: process.cwd(), loader: 'tsx' },
    jsx: 'automatic', bundle: true, write: false, format: 'iife', platform: 'browser',
    define: { 'process.env.NODE_ENV': '"test"' },
    plugins: [{ name: 'account-fixture', setup(builder) {
      builder.onResolve({ filter: /(?:progress-context|lesson-context)$/ }, args => ({ path: args.path.endsWith('progress-context') ? 'progress' : 'lesson', namespace: 'fixture' }));
      builder.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: args.path === 'progress'
        ? `export function useProgress() { const p = new URLSearchParams(location.search); return { learnerId: p.get('owner') || 'one', lang: p.get('lang') || 'en', currentTrack: {key:'enrollment'}, completedTaskKeys: [], markComplete: async () => true }; }`
        : `export function useLesson() { return new URLSearchParams(location.search).has('lesson') ? {mode:'guided'} : null; }` }));
    } }],
  });
  bundle = result.outputFiles[0].text;
});
test.beforeEach(async ({ page }) => {
  page.on('pageerror', error => { throw error; });
  await page.route('http://enrollment.test/**', route => route.fulfill(new URL(route.request().url()).pathname === '/fixture.js'
    ? { contentType: 'application/javascript; charset=utf-8', body: bundle }
    : { contentType: 'text/html; charset=utf-8', body: '<meta charset="utf-8"><div id="root"></div><script src="/fixture.js"></script>' }));
});
for (const lang of ['en', 'es']) {
  test(`enrollment writing restores after reload and stays learner-scoped (${lang})`, async ({ page }) => {
    const text = lang === 'en' ? 'I want to study business and work in an office.' : 'Quiero estudiar administración y trabajar en una oficina.';
    await page.goto(`http://enrollment.test/?owner=one&lang=${lang}`);
    await page.locator('textarea').fill(text);
    await page.reload();
    await expect(page.locator('textarea')).toHaveValue(text);
    await page.goto(`http://enrollment.test/?owner=two&lang=${lang}`);
    await expect(page.locator('textarea')).toHaveValue('');
    await page.locator('textarea').fill('Different learner');
    await page.goto(`http://enrollment.test/?owner=one&lang=${lang}`);
    await expect(page.locator('textarea')).toHaveValue(text);
  });
  test(`lesson writing stays in memory and never reads the Story draft (${lang})`, async ({ page }) => {
    await page.goto(`http://enrollment.test/?owner=one&lang=${lang}`);
    await page.locator('textarea').fill('Saved Story work');
    await page.goto(`http://enrollment.test/?owner=one&lang=${lang}&lesson=1`);
    await expect(page.locator('textarea')).toHaveValue('');
    await page.locator('textarea').fill('Unsaved lesson work');
    await page.reload();
    await expect(page.locator('textarea')).toHaveValue('');
    await page.goto(`http://enrollment.test/?owner=one&lang=${lang}`);
    await expect(page.locator('textarea')).toHaveValue('Saved Story work');
  });
}
