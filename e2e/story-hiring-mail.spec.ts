import { test, expect, type Page } from '@playwright/test';
import { clickIntoPage, waitForInteractive } from './interactive';
import { continuePastStudioArrivalIfPresent } from './studio-arrival';

async function signup(page: Page, lang: 'en' | 'es') {
  await page.goto('/login');
  await waitForInteractive(page);
  if (lang === 'es') await page.getByRole('button', { name: 'Español' }).click();
  await page.getByRole('button', { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder('Jordan').fill(`Hiring ${lang} ${Date.now()}`);
  await page.getByPlaceholder('HARBOR-24').fill('TEST-E2E');
  await page.locator('input[placeholder="••••"]').first().fill('1234');
  await page.getByRole('button', { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId('welcome-continue').click();
}

for (const lang of ['en', 'es'] as const) {
  test(`Story hiring starts in Mail and opens the right document (${lang})`, async ({ page }) => {
    test.slow();
    await signup(page, lang);
    const cases = [
      { preset: /Day 27: The Interview/, subject: lang === 'en' ? 'Your interview: preparation notes' : 'Tu entrevista: notas de preparación', content: /Your interview: preparation notes|Tu entrevista: notas de preparación/, destination: 'docs.harborsidehq.com/interview-preparation' },
      { preset: /Day 28: The Offer/, subject: lang === 'en' ? 'Your offer from Harborside HQ' : 'Tu oferta de Harborside HQ', content: /Your offer from Harborside HQ|Tu oferta de Harborside HQ/, destination: 'mail.harborsidehq.com/offer' },
      { preset: /Day 29: New-Hire Paperwork/, subject: lang === 'en' ? 'Before your first day: paperwork practice' : 'Antes de tu primer día: práctica de formularios', content: /Before your first day: paperwork practice|Antes de tu primer día: práctica de formularios/, destination: 'hr.harborsidehq.com/forms' },
    ];
    for (const row of cases) {
      await page.goto('/studio');
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole('button', { name: row.preset }).click());
      await continuePastStudioArrivalIfPresent(page);
      // Arrival itself opens Mail, rather than an unrelated task bookmark.
      await expect(page.getByTestId('mail-app-title')).toBeVisible();
      await expect(page.locator('[data-job-card]')).toContainText(row.subject);
      await page.getByRole('button').filter({ hasText: row.content }).click();
      await expect(page.getByRole('heading', { name: row.subject, exact: true })).toBeVisible();
      await page.getByTestId('hiring-mail-action').click();
      await expect(page.getByText(row.destination, { exact: true })).toBeVisible();
      if (row.destination.includes('interview-preparation')) {
        const answer = page.getByRole('textbox', { name: /Tell me about yourself|Cuéntame sobre ti/ });
        await answer.fill(lang === 'en' ? 'I track schedules and write clear notes.' : 'Reviso horarios y escribo notas claras.');
        const coaching = lang === 'en' ? 'A short work story, not your life story.' : 'Una historia corta de trabajo, no de tu vida.';
        await expect(page.getByText(coaching, { exact: false })).toHaveCount(0);
        await page.getByTestId('job-card-help').click();
        await expect(page.locator('[data-job-card]')).toContainText(coaching);
        await page.getByRole('button', { name: /Got it. Back to my task|Entendido. Volver a mi tarea/ }).click();
        await expect(answer).toHaveValue(lang === 'en' ? 'I track schedules and write clear notes.' : 'Reviso horarios y escribo notas claras.');
        await page.reload();
        await waitForInteractive(page);
        await continuePastStudioArrivalIfPresent(page);
        await page.getByTestId('bookmark-interview').click();
        await expect(answer).toHaveValue(lang === 'en' ? 'I track schedules and write clear notes.' : 'Reviso horarios y escribo notas claras.');
      }
    }
  });
}

for (const lang of ['en', 'es'] as const) {
  test(`Story hiring continues from preparation to offer and paperwork without another jump (${lang})`, async ({ page }) => {
    test.slow();
    await signup(page, lang);
    await page.goto('/studio');
    await waitForInteractive(page);
    await clickIntoPage(page, () => page.getByRole('button', { name: /Day 27: The Interview/ }).click());
    await continuePastStudioArrivalIfPresent(page);
    await page.getByRole('button').filter({ hasText: /Your interview: preparation notes|Tu entrevista: notas de preparación/ }).click();
    await page.getByTestId('hiring-mail-action').click();
    const answers = lang === 'en' ? [
      'I worked at the cafe and checked schedules and totals.',
      'I like keeping files organized so the team can find them.',
      'I found a conflict in my schedule and asked Maria for a change.',
      'I am learning to write clearer emails by reading them before sending.',
    ] : [
      'Trabajé en el café y revisé los horarios y los totales.',
      'Me gusta organizar los archivos para que el equipo pueda encontrarlos.',
      'Encontré un conflicto en mi horario y le pedí un cambio a Maria.',
      'Estoy aprendiendo a escribir correos claros y los leo antes de enviarlos.',
    ];
    const fields = page.getByRole('textbox');
    for (let i = 0; i < answers.length; i++) await fields.nth(i).fill(answers[i]);
    await page.getByRole('button', { name: /What does a normal day|¿Cómo es un día normal/ }).click();
    await page.getByRole('button', { name: /Save my preparation|Guardar mi preparación/ }).click();
    const arrival = page.getByRole('dialog');
    await expect(arrival).toContainText(lang === 'en' ? 'offer' : 'oferta');
    await arrival.locator('[data-celebration-continue]').click();
    await expect(page.getByTestId('mail-app-title')).toBeVisible();
    await page.getByRole('button').filter({ hasText: /Your offer from Harborside HQ|Tu oferta de Harborside HQ/ }).click();
    await page.getByTestId('hiring-mail-action').click();
    await page.getByRole('button', { name: /October 9|9 de octubre/ }).click();
    await expect(page.locator('[data-job-card]')).toContainText(lang === 'en' ? "That's not the date in the letter" : 'Esa no es la fecha de la carta');
    await page.getByRole('button', { name: /October 6|6 de octubre/ }).click();
    await page.getByRole('textbox').fill(lang === 'en'
      ? 'Thank you, Anita. I accept the offer and can start on October 6.'
      : 'Gracias, Anita. Acepto la oferta y puedo empezar el 6 de octubre.');
    await page.getByRole('button', { name: /Send reply|Enviar respuesta/, exact: true }).click();
    await expect(arrival).toBeVisible();
    await arrival.locator('[data-celebration-continue]').click();
    await expect(page.getByTestId('mail-app-title')).toBeVisible();
    await page.getByRole('button').filter({ hasText: /Before your first day: paperwork practice|Antes de tu primer día: práctica de formularios/ }).click();
    await page.getByTestId('hiring-mail-action').click();
    await expect(page.getByText('hr.harborsidehq.com/forms', { exact: true })).toBeVisible();
    await expect(page.getByText(/Robin Avery/).first()).toBeVisible();
    await page.getByRole('radio', { name: /Single, or married|Soltero\/a, o casado/ }).check();
    await page.locator('[data-showme="w4-dependents"]').fill('$0.00');
    await page.locator('[data-showme="w4-sign"]').fill('Robin Avery');
    await page.locator('[data-showme="w4-date"]').fill('10/01/2026');
    await page.getByRole('button', { name: /Submit W-4|Enviar W-4/, exact: true }).click();
    await expect(page.locator('[data-job-card]')).toContainText(lang === 'en' ? 'Next task' : 'Siguiente tarea');
    const nextForm = async () => {
      const card = page.locator('[data-job-card]');
      await card.getByRole('button', { name: /Next task|Siguiente tarea/, exact: true }).click();
      await card.getByRole('button', { name: /^Open |^Abre |^Abrir / }).click();
      await page.getByTestId('bookmark-onboarding').click();
    };
    await nextForm();
    await page.getByRole('textbox', { name: /Date of birth|Fecha de nacimiento/, exact: true }).fill('04/12/1990');
    await page.getByRole('textbox', { name: /Home address|Domicilio/, exact: true }).fill('123 Practice Lane');
    await page.getByRole('button', { name: /A citizen of the United States|Ciudadano\/a de los Estados Unidos/, exact: true }).click();
    await page.getByRole('textbox', { name: /Signature|Firma/ }).fill('Robin Avery');
    await page.getByRole('textbox', { name: /^(Date|Fecha)$/ }).fill('10/01/2026');
    await page.getByRole('button', { name: /Submit I-9|Enviar I-9/, exact: true }).click();
    await nextForm();
    await page.getByRole('textbox', { name: /Bank name|Nombre del banco/, exact: true }).fill('Practice Bank');
    await page.getByRole('textbox', { name: /Routing number|Número de ruta/, exact: true }).fill('000000000');
    await page.getByRole('textbox', { name: /Account number|Número de cuenta/, exact: true }).fill('1234567890');
    await page.getByRole('button', { name: /^(Checking|Corriente)$/ }).click();
    await page.getByRole('button', { name: /Submit direct deposit|Enviar depósito directo/, exact: true }).click();
    await expect(arrival).toBeVisible();
    await arrival.locator('[data-celebration-continue]').click();
    await expect(page.locator('[data-job-card]')).toContainText(lang === 'en' ? 'Chris asked for the Q3 notes' : 'Chris pidió las notas del T3');
    const card = page.locator('[data-job-card]');
    await page.getByTestId('bookmark-files').click();
    await page.getByRole('textbox').fill('Q3 notes');
    await page.getByRole('button', { name: /Q3_notes_FINAL_v1.pdf/ }).click();
    await expect(card).toContainText(lang === 'en' ? 'version 1' : 'versión 1');
    await page.getByRole('button', { name: /Q3_notes_FINAL.pdf.*Q3 2026/ }).click();
    await page.getByRole('button', { name: /Can edit|Puede editar/ }).click();
    await page.getByRole('button', { name: /^(Share|Compartir)$/ }).click();
    await expect(card).toContainText(lang === 'en' ? 'view' : 'ver');
    await page.getByRole('button', { name: /Can view|Puede ver/ }).click();
    await page.getByRole('button', { name: /^(Share|Compartir)$/ }).click();
    await expect(arrival).toBeVisible();
    await arrival.locator('[data-celebration-continue]').click();
    await page.getByTestId('bookmark-calendar').click();
    await page.getByRole('button', { name: /10:00 AM/ }).click();
    await expect(card).toContainText(lang === 'en' ? 'busy' : 'ocupado');
    await page.getByRole('button', { name: /2:00 PM/ }).click();
    await page.getByRole('button', { name: /Invite everyone to this time|Invitar a todos a esta hora/ }).click();
    await expect(card).toContainText(lang === 'en' ? 'Next task' : 'Siguiente tarea');


  });
}
