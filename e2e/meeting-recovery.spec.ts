import { test, expect, type Page } from '@playwright/test';
import { continuePastStudioArrivalIfPresent } from './studio-arrival';
import { MEETING_COPY, MEETING_SCRIPT } from '../src/lib/tasks/meeting-minutes/content';

async function signup(page: Page, lang: 'en'|'es') {
 await page.goto('/login');
 if(lang==='es') await page.getByRole('button',{name:'Español'}).click();
 await page.getByRole('button',{name:/Add user|Agregar usuario/}).click();
 await page.getByPlaceholder('Jordan').fill(`Decisions ${lang} ${Date.now()}`);
 await page.getByPlaceholder('HARBOR-24').fill('TEST-E2E');
 await page.locator('input[placeholder="••••"]').first().click();
 await page.keyboard.type('1234');
 await page.getByRole('button',{name:/^(Add|Agregar)$/}).click();
 await page.getByTestId('welcome-continue').click();
}
async function preset(page:Page, name:RegExp, tab:string) {
 await page.goto('/studio');
 await page.getByRole('button',{name}).click();
 await page.waitForURL(/from=studio/);
 const intro=page.getByTestId('act-intro');
 if(await intro.isVisible()) await page.getByTestId('act-intro-continue').click();
 await continuePastStudioArrivalIfPresent(page);
 const card=page.locator('[data-job-card]');
 await card.getByRole('button',{name:/^Open |^Abre |^Abrir /}).click();
 await page.getByTestId(`bookmark-${tab}`).click();
 await card.getByTestId('job-card-drag-handle').focus();
 await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowUp');
}
for (const lang of ['en', 'es'] as const) {
  test(`meeting keeps drafts through Help and alternate view order (${lang})`, async ({ page }) => {
    await signup(page, lang);
    await preset(page, /Run the Meeting/, 'meeting-minutes');
    const c = MEETING_COPY[lang];
    const card = page.locator('[data-job-card]');
    const back = page.getByRole('button', { name: c.backHub });
    await page.getByRole('button', { name: c.notesCta }).click();
    const notes = page.getByRole('textbox', { name: c.notesLabel, exact: true });
    await notes.fill(lang === 'en' ? 'Draft: check the final training assignment.' : 'Borrador: revisar la asignación final de capacitación.');
    const draft = await notes.inputValue();
    const transcript = page.locator('details').filter({ has: page.locator('summary', { hasText: c.transcriptLabel }) });
    await transcript.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(transcript.getByText(MEETING_SCRIPT[lang].at(-2)!, { exact: true })).toBeVisible();
    await card.getByTestId('job-card-help').click();
    await card.getByRole('button', { name: c.gotIt, exact: true }).click();
    await expect(notes).toHaveValue(draft);
    await back.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: c.agendaCta }).click();
    const agenda = page.getByRole('textbox', { name: c.agendaLabel, exact: true });
    await agenda.fill('Coverage / Cobertura');
    await back.click();
    await page.getByRole('button', { name: c.followupCta }).click();
    await page.getByRole('button', { name: c.send, exact: true }).click();
    await expect(card).toContainText(c.needFollowup);
    await transcript.locator('summary').click();
    await expect(transcript.getByText(MEETING_SCRIPT[lang].at(-2)!, { exact: true })).toBeVisible();
    await back.click();
    await page.getByRole('button', { name: c.notesCta }).click();
    await expect(notes).toHaveValue(draft);
    await back.click();
    await page.getByRole('button', { name: c.agendaCta }).click();
    await expect(agenda).toHaveValue('Coverage / Cobertura');
  });
}
