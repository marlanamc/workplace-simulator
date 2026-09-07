import { test, expect } from '@playwright/test';
import { neon } from '@neondatabase/serverless';
import { JOB_POSTING_COPY, REQUIREMENTS } from '../src/lib/tasks/job-posting/content';
import { TASKS } from '../src/lib/tasks/registry';
import { courseLevels, taskKeysForLevel } from '../src/lib/tracks-content';

test.use({ actionTimeout: 20_000 });
const sql = neon(process.env.DATABASE_URL!);
for (const lang of ['en', 'es'] as const) {
  test(`earned office work survives every direction and pause (${lang})`, async ({ page }) => {
    test.slow();
    const name = `Route ${lang} ${Date.now()}`;
    await page.goto('/login');
    if (lang === 'es') await page.getByRole('button', { name: 'Español' }).click();
    await page.getByRole('button', { name: /Add user|Agregar usuario/ }).click();
    await page.getByPlaceholder('Jordan').fill(name);
    await page.getByPlaceholder('HARBOR-24').fill('TEST-E2E');
    await page.locator('input[placeholder="••••"]').first().fill('1234');
    await page.getByRole('button', { name: /^(Add|Agregar)$/ }).click();
    await page.getByTestId('welcome-continue').click();
    const [learner] = await sql`SELECT id FROM learners WHERE display_name = ${name} AND class_code = 'TEST-E2E'`;
    const credit = async () => (await sql`SELECT task_key FROM task_completions WHERE learner_id = ${learner.id} ORDER BY task_key`).map(row => row.task_key);
    const route = async () => (await sql`SELECT badge_key FROM badges WHERE learner_id = ${learner.id} AND badge_key LIKE 'course-route:%'`).map(row => row.badge_key);
    await page.goto('/studio');
    await page.getByRole('button', { name: /After Act II \(pick a direction\)/ }).click();
    const card = page.locator('[data-job-card]');
    await card.getByTestId('course-route-office').click();
    await expect(page.getByTestId('act-intro')).toHaveAttribute('data-act', 'act6');
    await page.getByTestId('act-intro-continue').click();
    const core = courseLevels(null).flatMap(level => taskKeysForLevel(level)).sort();
    await expect.poll(credit).toEqual(core);
    await card.getByRole('button', { name: /^Open |^Abre |^Abrir / }).click();
    await page.getByTestId('bookmark-jobs').click();
    await card.getByTestId('job-card-drag-handle').focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');
    const pc = JOB_POSTING_COPY[lang];
    for (const requirement of REQUIREMENTS.slice(0, 3)) {
      const button = page.getByRole('button', { name: requirement.text[lang], exact: true });
      await expect(button).toHaveAttribute('aria-pressed', 'false');
      await button.focus();
      await page.keyboard.press('Space');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
    }
    await page.getByRole('textbox', { name: pc.fitLabel, exact: true }).fill(lang === 'en' ? 'I practiced comparing schedules and reporting spreadsheet totals.' : 'Practiqué comparar horarios y reportar totales de hojas de cálculo.');
    await page.getByRole('button', { name: pc.apply, exact: true }).click();
    const earned = [...core, 'job-posting'].sort();
    await expect.poll(credit).toEqual(earned);
    await expect(card).toContainText(pc.sentKicker);
    await page.getByRole('button', { name: 'Minimize', exact: true }).click();
    for (const choice of [
      { key: 'lead', act: 'act3', task: 'team-schedule' },
      { key: 'healthcare', act: 'act5', task: 'appointment-scheduling' },
      { key: 'college', act: null, task: 'enrollment' },
      { key: 'pause', act: null, task: null },
      { key: 'office', act: null, task: 'job-application' },
    ] as const) {
      await card.getByRole('button', { name: /Change direction|Cambiar de camino/ }).click();
      await card.getByTestId(`course-route-${choice.key}`).click();
      if (choice.act) {
        await expect(page.getByTestId('act-intro')).toHaveAttribute('data-act', choice.act);
        await page.getByTestId('act-intro-continue').click();
      }
      const expected = choice.task ? (TASKS[choice.task].jobCardLine ?? TASKS[choice.task].dispatch)[lang] : lang === 'en' ? 'Core course complete' : 'Curso básico terminado';
      await expect(card).toContainText(expected);
      await page.reload();
      await expect(card).toContainText(expected);
      await expect.poll(route).toEqual([`course-route:${choice.key}`]);
      await expect.poll(credit).toEqual(earned);
    }
  });
}
