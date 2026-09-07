import { test, expect, type Page } from '@playwright/test';
import { DONE_COPY } from '../src/lib/tasks/mail/content';
import { continuePastStudioArrivalIfPresent } from './studio-arrival';

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
async function preset(page:Page, name:RegExp) {
 await page.goto('/studio');
 await page.getByRole('button',{name}).click();
 await page.waitForURL(/from=studio/);
 const intro=page.getByTestId('act-intro');
 if(await intro.isVisible()) await page.getByTestId('act-intro-continue').click();
 await continuePastStudioArrivalIfPresent(page);
 const card=page.locator('[data-job-card]');
 // Arrival opens Mail on the inbox. Park the card so the list is clickable.
 await card.getByTestId('job-card-drag-handle').focus();
 await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowUp');
}
for (const lang of ['en', 'es'] as const) {
  test(`short location reply recovers after unrelated reply (${lang})`, async ({ page }) => {
    await signup(page, lang);
    await preset(page, /Write to a Coworker/);
    const card = page.locator('[data-job-card]');
    await expect(card).toContainText(lang === 'en' ? "Open Darnell's email." : 'Abre el correo de Darnell.');
    await page.getByRole('button', { name: /Darnell Washington/ }).click();
    await page.getByRole('button', { name: /^(Reply|Responder)$/ }).click();
    await expect(card).toContainText(lang === 'en' ? 'storage room' : 'almacén');
    const body = page.locator('textarea').first();
    const send = page.getByRole('button', { name: /^(Send|Enviar)$/ });
    const incomplete = lang === 'en' ? 'I placed a supply order this morning.' : 'Dejé los delantales en la cocina hoy.';
    await body.fill(incomplete);
    await send.click();
    await expect(card).toContainText(lang === 'en' ? 'storage room' : 'almacén');
    await expect(body).toHaveValue(incomplete);
    await body.fill(lang === 'en' ? 'In the storage room.' : 'En el almacén.');
    await send.click();
    await expect(body).toHaveCount(0);
    await expect(page.getByText(DONE_COPY['mail-etiquette'][lang].kicker, { exact: true }).first()).toBeVisible({ timeout: 20_000 });
    await expect(card.getByRole('button', { name: /Retry save|Intentar guardar de nuevo/ })).toHaveCount(0);
  });
}
