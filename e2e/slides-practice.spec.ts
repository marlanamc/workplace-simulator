import { test, expect } from '@playwright/test';
import { continuePastStudioArrivalIfPresent } from './studio-arrival';

for (const lang of ['en', 'es'] as const) {
 test(`slides require source data and a coworker answer (${lang})`, async ({page}) => {
  await page.goto('/login');
  if (lang === 'es') await page.getByRole('button', {name:'Español'}).click();
  await page.getByRole('button', {name:/Add user|Agregar usuario/}).click();
  await page.getByPlaceholder('Jordan').fill(`Slides ${lang} ${Date.now()}`);
  await page.getByPlaceholder('HARBOR-24').fill('TEST-E2E');
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type('1234');
  await page.getByRole('button',{name:/^(Add|Agregar)$/}).click();
  await page.getByTestId('welcome-continue').click();
  await page.goto('/studio');
  await page.getByRole('button',{name:/Presenting to the Team/}).click();
  await page.waitForURL(/from=studio/);
  await continuePastStudioArrivalIfPresent(page);
  const card=page.locator('[data-job-card]');
  await card.getByRole('button',{name:/^Open |^Abrir |^Abre /}).click();
  await page.getByTestId('bookmark-slides').click();
  await card.getByTestId('job-card-drag-handle').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowUp');
  await page.getByPlaceholder(/Give these slides|Ponle un título/).fill('Expenses / Gastos');
  await page.getByRole('button',{name:/^Next slide$|^Siguiente$/}).click();
  const total=page.getByLabel(/Total with receipts|Total con recibos/);
  await total.fill('999');
  await page.getByRole('button',{name:/^Next slide$|^Siguiente$/}).click();
  await expect(total).toBeVisible();
  await expect(card).toContainText(/Compare the receipt|Compara las filas/);
  await total.fill('188');
  await page.getByRole('button',{name:/^Next slide$|^Siguiente$/}).click();
  await page.getByPlaceholder(/One sentence|Una oración/).fill(lang === 'en' ? 'Get the missing receipt before reporting dinner expenses.' : 'Consigue el recibo que falta antes de reportar la cena.');
  await page.getByRole('button',{name:/^Present$|^Presentar$/}).last().click();
  const answer=page.getByRole('combobox');
  await answer.selectOption('meal');
  await page.getByRole('button',{name:/Answer Chris|Responder a Chris/}).click();
  await expect(answer).toBeVisible();
  await expect(card).toContainText(/what is missing|qué falta/);
  await answer.selectOption('receipt');
  await page.getByRole('button',{name:/Answer Chris|Responder a Chris/}).click();
  await expect(answer).toHaveCount(0);
  await expect(page.getByTestId('act-intro')).toBeVisible({timeout:20000});
  await expect(page.getByTestId('act-intro')).toContainText('VII');
 });
}
