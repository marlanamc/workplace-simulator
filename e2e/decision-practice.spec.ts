import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
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
for(const lang of ['en','es'] as const) {
 test(`requesters, priorities, and profile evidence (${lang})`,async({page},testInfo)=>{
  test.slow();
  await signup(page,lang);
  await preset(page,/Paperwork.*Front desk/,'front-desk');
  await page.getByPlaceholder('Maya Rivera').fill('Maya Rivera');
  await page.getByPlaceholder('03/12/1998').fill('03/12/1998');
  await page.getByPlaceholder(/^Follow-up$|^Seguimiento$/).fill(lang==='en'?'Follow-up':'Seguimiento');
  await page.getByRole('button',{name:/^File intake$|^Archivar ingreso$/}).click();
  await page.getByTestId('intake-recipient').selectOption('both');
  await page.getByPlaceholder(/Reply to Sam|Responde a Sam/).fill(lang==='en'?'I cannot share patient forms.':'No puedo compartir formularios de pacientes.');
  await page.getByRole('button',{name:/^Send reply$|^Enviar respuesta$/}).click();
  await expect(page.locator('[data-job-card]')).toContainText(lang==='en'?'verified assignment':'asignación verificada');
  await expect(page.getByTestId('intake-recipient')).toBeVisible();
  await page.getByTestId('intake-recipient').selectOption('nurse');
  await page.getByRole('button',{name:/^Send reply$|^Enviar respuesta$/}).click();
  await expect(page.getByTestId('intake-recipient')).toHaveCount(0);
  await expect(page.getByText(/Saving your work…|Guardando tu trabajo…/)).toHaveCount(0,{timeout:20000});

  await preset(page,/Under Pressure/,'priority-call');
  await page.getByTestId('priority-choice').selectOption('manager-title');
  await page.getByRole('button',{name:/That's what I'll do first|Eso es lo que voy a hacer primero/}).click();
  await expect(page.getByTestId('priority-choice')).toBeVisible();
  await expect(page.locator('[data-job-card]')).toContainText(lang==='en'?'immediate consequence':'consecuencia inmediata');
  await page.getByTestId('priority-choice').selectOption('cover-start');
  await page.screenshot({path:testInfo.outputPath(`priority-${lang}.png`),fullPage:true});
  await page.getByRole('button',{name:/That's what I'll do first|Eso es lo que voy a hacer primero/}).click();
  await expect(page.getByTestId('priority-choice')).toHaveCount(0);
  await expect(page.getByText(/Situation reference|Referencia de la situación/)).toBeVisible();

  await preset(page,/The Review/,'performance-review');
  const strength=lang==='en'?'Sam patiently helped two new colleagues.':'Sam ayudó con paciencia a dos compañeros nuevos.';
  const area=lang==='en'?'Arrive before the morning opening shift.':'Llegar antes del turno de apertura.';
  await page.getByPlaceholder(/Something specific they actually did|Algo concreto que de verdad hizo/).fill(strength);
  await page.getByPlaceholder(/What needs to change|Qué necesita cambiar/).fill(area);
  await page.getByRole('button',{name:/^Submit the review$|^Enviar la evaluación$/}).click();
  await expect(page.locator('[data-job-card]')).toContainText(lang==='en'?'Choose one action':'Elige una acción');
  await page.getByTestId('review-evidence').selectOption('training');
  await page.screenshot({path:testInfo.outputPath(`review-${lang}.png`),fullPage:true});
  await page.getByRole('button',{name:/^Submit the review$|^Enviar la evaluación$/}).click();
  await expect(page.getByText(/Review submitted|Evaluación enviada/).first()).toBeVisible({timeout:20000});
  await page.goto('/?task=performance-review');
  await page.locator('[data-job-card]').getByRole('button',{name:/Do it again|Hazlo otra vez/}).click();
  await expect(page.getByTestId('review-evidence')).toHaveValue('training');
  await expect(page.getByPlaceholder(/Something specific they actually did|Algo concreto que de verdad hizo/)).toHaveValue(strength);
  await expect(page.getByPlaceholder(/What needs to change|Qué necesita cambiar/)).toHaveValue(area);
 });

 test(`portfolio download survives denied clipboard (${lang})`,async({page,context})=>{
  test.slow();
  await signup(page,lang);
  await preset(page,/Where You've Been/,'portfolio-reflection');
  const next=page.getByRole('button',{name:/Next: look back|Siguiente: mirar atrás/});
  await next.click();
  const fields=page.locator('textarea');
  for(let i=0;i<4;i++) await fields.nth(i).fill(`${lang==='en'?'I practiced sharing documents':'Practiqué compartir documentos'} ${i+1}.`);
  await page.getByRole('button',{name:/See my summary|Ver mi resumen/}).click();
  await expect(page.getByRole('button',{name:/Download summary|Descargar resumen/})).toBeEnabled({timeout:20000});
  await page.goto('/?task=portfolio-reflection');
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.getByRole('button',{name:/Copy summary to share|Copiar resumen para compartir/}).click();
  const copied=await page.evaluate(()=>navigator.clipboard.readText());
  await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:async()=>{throw new DOMException('Denied','NotAllowedError');}}));
  await page.getByRole('button',{name:/Copy summary to share|Copiar resumen para compartir/}).click();
  await expect(page.locator('[data-job-card]')).toContainText(lang==='en'?'Clipboard access is unavailable':'No hay acceso al portapapeles');
  const pending=page.waitForEvent('download');
  await page.getByRole('button',{name:/Download summary|Descargar resumen/}).click();
  const download=await pending;
  expect(download.suggestedFilename()).toBe(lang==='en'?'workplace-practice-summary.txt':'resumen-practica-laboral.txt');
  const text=await readFile((await download.path())!,'utf8');
  expect(text).toBe(copied);
  expect(text).toContain(lang==='en'?'not employment history':'no es historial de empleo');
  expect(text).toContain(lang==='en'?'I practiced sharing documents 4.':'Practiqué compartir documentos 4.');
 });
}

test('older earned review completion does not require newly introduced evidence',async({page})=>{
 await signup(page,'en');
 await page.goto('/studio');
 await page.getByRole('button',{name:'Everything done',exact:true}).click();
 await page.waitForURL(/from=studio/);
 await page.goto('/?task=performance-review');
 await expect(page.getByText('Review submitted',{exact:true}).first()).toBeVisible({timeout:20000});
 await expect(page.getByTestId('review-evidence')).toHaveCount(0);
});
