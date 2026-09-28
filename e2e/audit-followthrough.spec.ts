import { test, expect, type Page } from '@playwright/test';
import { clickIntoPage, waitForInteractive } from './interactive';
import { continuePastStudioArrivalIfPresent } from './studio-arrival';
import { EXPENSE_ROWS } from '../src/lib/tasks/expense-report/content';

// These checks enter the actual Story day with its arrival, locks and Job Card.
// Studio changes only the isolated TEST-E2E account created for this test.
async function story(page: Page, preset: RegExp, key: string, moveCard = true) {
  await page.goto('/login');
  await waitForInteractive(page);
  await page.getByRole('button', { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder('Jordan').fill(`Story audit ${Date.now()}`);
  await page.getByPlaceholder('HARBOR-24').fill('TEST-E2E');
  await page.locator('input[placeholder="••••"]').first().fill('1234');
  await page.getByRole('button', { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId('welcome-continue').click();
  await page.goto('/studio');
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole('button', { name: preset }).click());
  if (await page.getByTestId('act-intro').isVisible()) await page.getByTestId('act-intro-continue').click();
  await continuePastStudioArrivalIfPresent(page);
  const card = page.locator('[data-job-card]');
  await card.getByRole('button', { name: /^Open / }).click();
  await page.getByTestId(`bookmark-${key}`).click();
  if (moveCard) {
    await card.getByTestId('job-card-drag-handle').focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');
  }
  return card;
}

test('expenses require correct receipt matches and a receipted total', async ({ page }) => {
  const card = await story(page, /The Expense Report/, 'expense-report', false);
  await page.getByRole('button', { name: /September expenses/ }).click();
  await page.getByRole('button', { name: 'Flag missing · Team dinner', exact: true }).click();
  await page.getByLabel('Total with receipts ($)', { exact: true }).fill('188');
  await page.getByRole('button', { name: 'Submit report', exact: true }).click();
  await expect(card).toContainText('Compare each selected receipt');
  for (const row of EXPENSE_ROWS.filter(row => row.receipt)) {
    await page.getByRole('combobox', { name: `${row.merchant.en} · Receipt`, exact: true }).selectOption(row.receipt!);
  }
  await page.getByLabel('Total with receipts ($)', { exact: true }).fill('283');
  await page.getByRole('button', { name: 'Submit report', exact: true }).click();
  await expect(card).toContainText('Add only the amounts with receipts');
  await page.getByLabel('Total with receipts ($)', { exact: true }).fill('188');
  await page.getByRole('button', { name: 'Submit report', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Submit report', exact: true })).toHaveCount(0);
});

test('triage makes the learner compare both calendars', async ({ page }) => {
  const card = await story(page, /Covering More Ground/, 'triage');
  await page.getByRole('button', { name: /Open Calendar$/ }).click();
  await expect(page.getByText(/Friday 9–11 AM available/)).toBeVisible();
  await page.getByLabel('New time', { exact: true }).selectOption('fri14');
  await page.getByRole('button', { name: 'Propose a new time', exact: true }).click();
  await expect(card).toContainText('The full 20 minutes must be free');
  await page.getByLabel('New time', { exact: true }).selectOption('fri10');
  await page.getByRole('button', { name: 'Propose a new time', exact: true }).click();
  await expect(page.getByRole('button', { name: /Open Drive$/ })).toBeVisible();
});

test('HQ file search understands spaces and reports empty results', async ({ page }) => {
  await story(page, /Welcome to HQ/, 'files');
  const search = page.getByRole('textbox').first();
  await search.fill('Q3 notes');
  await expect(page.getByRole('button', { name: /Q3_notes_FINAL.pdf/ }).first()).toBeVisible();
  await search.fill('nothing-matches-this');
  await expect(page.getByText('No files match your search.', { exact: true })).toBeVisible();
});


test('Story budget uses an accurate status and the Sheets collaborator menu', async ({ page }) => {
  const card = await story(page, /The Budget/, 'budget-sheet');
  await page.getByRole('button', { name: /Cafe budget: week of/ }).click();
  await expect(page.getByRole('button', { name: 'within budget', exact: true })).toHaveCount(6);
  await page.getByRole('button', { name: 'over', exact: true }).click();
  await expect(card).toContainText('Find what is over budget.');
  await page.getByRole('button', { name: 'File', exact: true }).click();
  await page.getByRole('button', { name: 'Email', exact: true }).click();
  await page.getByRole('button', { name: 'Email collaborators', exact: true }).click();
  await page.getByPlaceholder('Write which category is over, and by how much…').fill('Labor is $450 over budget.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText('Message sent', { exact: true })).toBeVisible();
  await expect(page.getByText('Labor is $450 over budget.', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'A long thread from HQ.' })).toBeVisible();
});
