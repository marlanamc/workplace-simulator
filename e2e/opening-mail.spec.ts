import { test, expect, type Page } from '@playwright/test';
import { getOpeningReplies, saveOpeningReply, recordCompletion } from '../src/lib/db/queries';
import { OPENING_MESSAGES } from '../src/lib/tasks/mail/opening';
import { neon } from '@neondatabase/serverless';
import { continuePastStudioArrivalIfPresent } from './studio-arrival';

test.use({ actionTimeout: 20_000 });
const sql = neon(process.env.DATABASE_URL!);
async function signup(page: Page, lang: 'en' | 'es') {
  const name = `Opening ${lang} ${Date.now()}`;
  await page.goto('/login');
  if (lang === 'es') await page.getByRole('button', {name:'Español'}).click();
  await page.getByRole('button', {name:/Add user|Agregar usuario/}).click();
  await page.getByPlaceholder('Jordan').fill(name);
  await page.getByPlaceholder('HARBOR-24').fill('TEST-E2E');
  await page.locator('input[placeholder="••••"]').first().fill('1234');
  await page.getByRole('button', {name:/^(Add|Agregar)$/}).click();
  await page.getByTestId('welcome-continue').click();
  const [learner] = await sql`SELECT id FROM learners WHERE display_name=${name} AND class_code='TEST-E2E'`;
  return learner.id as string;
}
async function startOpening(page: Page) {
  await page.goto('/studio');
  await page.getByRole('button', {name:/Start of Day 1: Day One/}).click();
  await page.waitForURL(/from=studio/);
  await continuePastStudioArrivalIfPresent(page);
  const card = page.locator('[data-job-card]');
  await card.getByRole('button', {name:/^I understand$|^Entiendo$/}).click();
  await parkCard(page);
}
async function parkCard(page: Page) {
  const handle = page.getByTestId('job-card-drag-handle');
  await handle.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowUp');
}
async function reply(page: Page, text: string) {
  await page.locator('[data-showme="maria-row"]').click();
  await page.locator('[data-showme="reply-button"]').click();
  await page.getByRole('textbox', {name:/Your reply|Tu respuesta/}).fill(text);
  await page.locator('[data-showme="send-button"]').click();
}
for (const lang of ['en','es'] as const) {
  test(`three replies save, resume, recover and finish once (${lang})`, async ({page}) => {
    test.slow();
    const id = await signup(page, lang);
    const saved = async () => (await sql`SELECT message_id FROM opening_replies WHERE learner_id=${id}`).map(r => r.message_id).sort();
    const completions = async () => (await sql`SELECT task_key FROM task_completions WHERE learner_id=${id}`).map(r => r.task_key).sort();
    await startOpening(page);
    const card = page.locator('[data-job-card]');
    await reply(page, lang === 'en' ? 'Hi Maria!' : '¡Hola Maria!');
    await expect(card.getByRole('button',{name:/Next message|Siguiente mensaje/})).toBeVisible();
    await expect.poll(saved).toEqual(['welcome']);
    await expect.poll(completions).toEqual(['tour']);
    // Reload uses server progress, without needing to click Next first.
    await page.goto('/');
    await card.getByRole('button', {name:/Open Mail|Abrir correo/}).click();
    await parkCard(page);
    await expect(page.locator('[data-showme="maria-row"]')).toContainText(lang === 'en' ? 'Tomorrow at 10 AM' : 'Mañana a las 10');
    await reply(page, 'No');
    await expect(page.getByRole('textbox',{name:/Your reply|Tu respuesta/})).toHaveValue('No');
    await expect.poll(saved).toEqual(['welcome']);
    await page.getByRole('textbox',{name:/Your reply|Tu respuesta/}).fill(lang === 'en' ? 'Yes, see you tomorrow!' : 'Sí, allí estaré.');
    await page.locator('[data-showme="send-button"]').click();
    await card.getByRole('button',{name:/Next message|Siguiente mensaje/}).click();
    await expect(card).toContainText(lang === 'en' ? 'shelf under the counter' : 'estante debajo del mostrador');
    await expect(page.locator('[data-showme="attach-button"]')).toHaveCount(0);
    await page.screenshot({path:test.info().outputPath(`opening-objective-${lang}.png`), animations:'disabled'});
    await card.getByRole('button', {name:/^Show me$|^Muéstrame$/}).click();
    await expect(page.locator('[data-showme="maria-row"]')).toBeVisible();
    await card.getByTestId('job-card-help').click();
    await expect(card).toContainText(lang === 'en' ? 'Click Reply.' : 'Haz clic en Responder.');
    await card.getByRole('button',{name:/Back to my task|Volver a mi tarea/}).click();
    await page.locator('[data-showme="maria-row"]').click();
    await page.locator('[data-showme="reply-button"]').click();
    const answer = lang === 'en' ? 'Under the counter.' : 'Debajo del mostrador.';
    await page.getByRole('textbox',{name:/Your reply|Tu respuesta/}).fill(answer);
    let blocked = false;
    await page.route('**/*', async route => {
      const req = route.request();
      if (!blocked && req.method()==='POST' && req.headers()['next-action'] && req.postData()?.includes('"cups"')) {
        blocked = true; await route.abort('failed');
      } else await route.continue();
    });
    await page.locator('[data-showme="send-button"]').click();
    await expect(card.getByRole('button',{name:/Retry save|Reintentar guardado/})).toBeVisible();
    await expect(page.getByRole('textbox',{name:/Your reply|Tu respuesta/})).toHaveValue(answer);
    await expect.poll(saved).toEqual(['start-time','welcome']);
    // The failed payload survives reload, but the saved replies remain authoritative.
    await page.goto('/');
    await card.getByRole('button', {name:/Open Mail|Abrir correo/}).click();
    await parkCard(page);
    await page.locator('[data-showme="maria-row"]').click();
    await page.locator('[data-showme="reply-button"]').click();
    await expect(page.getByRole('textbox',{name:/Your reply|Tu respuesta/})).toHaveValue(answer);
    await page.locator('[data-showme="send-button"]').click();
    await expect(page.getByText(lang === 'en' ? 'Maria noticed you.' : 'Maria se fijó en ti.', {exact:true})).toBeVisible();
    await expect.poll(saved).toEqual(['cups','start-time','welcome']);
    await expect.poll(completions).toEqual(['mail-reply','tour']);
    // Reopening finished progress cannot fabricate another completion or redo replies.
    await page.goto('/');
    await expect(card).toContainText(lang === 'en' ? 'schedule' : 'horario');
    await expect.poll(completions).toEqual(['mail-reply','tour']);
    // Explicit Studio replay clears only the opening steps.
    await startOpening(page);
    await expect.poll(saved).toEqual([]);
    await expect(page.locator('[data-showme="maria-row"]')).toContainText(lang === 'en' ? 'Welcome to Harborside' : 'Bienvenido a Harborside');
  });
}

test('legacy completion keeps its place without inventing practice replies', async ({page}) => {
  const id = await signup(page,'en');
  await startOpening(page);
  await sql`INSERT INTO task_completions (learner_id,task_key) VALUES (${id},'mail-reply'),(${id},'mail-attach')`;
  await page.goto('/');
  await expect(page.locator('[data-job-card]')).toContainText('schedule');
  expect(await sql`SELECT message_id FROM opening_replies WHERE learner_id=${id}`).toHaveLength(0);
  expect(await sql`SELECT task_key FROM task_completions WHERE learner_id=${id} AND task_key='mail-attach'`).toHaveLength(1);
});


test('a lost save acknowledgement can be retried without duplicating the reply', async ({page}) => {
  const id = await signup(page,'en');
  await startOpening(page);
  let blocked = false;
  await page.route('**/*', async route => {
    const req = route.request();
    if (!blocked && req.method()==='POST' && req.headers()['next-action'] && req.postData()?.includes('"welcome"')) {
      blocked = true;
      await route.fetch(); // Commit on the server, then lose only the acknowledgement.
      await route.abort('failed');
    } else await route.continue();
  });
  await reply(page,'Hello Maria');
  const card = page.locator('[data-job-card]');
  await card.getByRole('button',{name:'Retry save'}).click();
  await expect(card.getByRole('button',{name:'Next message'})).toBeVisible();
  const rows = await sql`SELECT message_id,response FROM opening_replies WHERE learner_id=${id}`;
  expect(rows).toEqual([{message_id:'welcome',response:'Hello Maria'}]);
  expect(await sql`SELECT task_key FROM task_completions WHERE learner_id=${id} AND task_key='mail-reply'`).toHaveLength(0);
});


test('reopening Mail before the schedule does not introduce attachments early', async ({page}) => {
  const id = await signup(page,'en');
  await page.goto('/studio');
  await page.getByRole('button',{name:/Start of Day 2: The First Week/}).click();
  await page.waitForURL(/from=studio/);
  await continuePastStudioArrivalIfPresent(page);
  await page.getByTestId('bookmark-mail').click();
  await expect(page.locator('[data-showme="reply-button"]')).toHaveCount(0);
  await expect(page.getByRole('button',{name:/Maria Delgado.*July safety report/})).toHaveCount(0);
  // Set up the next boundary: earned schedule, attachment still incomplete.
  await sql`INSERT INTO task_completions (learner_id,task_key) VALUES (${id},'schedule')`;
  await page.goto('/');
  await page.locator('[data-job-card]').getByRole('button',{name:/Next: Send the report/}).click();
  await expect(page.locator('[data-showme="maria-row"]')).toContainText('July');
});


test('concurrent saves and completion retries do not duplicate credit', async ({page}) => {
  const id = await signup(page,'en');
  const welcome = {messageId:'welcome' as const,response:'Hello',lang:'en' as const};
  await Promise.all([saveOpeningReply(id,welcome),saveOpeningReply(id,welcome)]);
  expect(await getOpeningReplies(id)).toEqual([welcome]);
  for (const message of OPENING_MESSAGES.slice(1)) {
    await saveOpeningReply(id,{messageId:message.id,response:message.starter.en,lang:'en'});
  }
  await Promise.all([recordCompletion(id,'mail-reply'),recordCompletion(id,'mail-reply')]);
  expect(await sql`SELECT task_key FROM task_completions WHERE learner_id=${id} AND task_key='mail-reply'`).toHaveLength(1);
});
