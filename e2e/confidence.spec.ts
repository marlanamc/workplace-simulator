import { test, expect, type Page } from "@playwright/test";
import { waitForInteractive } from "./interactive";
import { CONFIDENCE_KEYS, type LessonScenario } from "../src/lib/lessons/confidence";
import { practiceScenario } from "../src/lib/tasks/confidence/classroom";

async function start(page: Page, key: string, scenario: string, lang: string, preview = true) {
  await page.goto(`/lessons/${key}?scenario=${scenario}&lang=${lang}${preview ? "&preview=1" : ""}`);
  await waitForInteractive(page);
  await page.getByTestId("lesson-intro-start").click();
  if (key === "account-recovery") return;
  await expect(page.getByTestId("confidence-practice")).toBeVisible();
  if (key.startsWith("mail-")) await openReply(page, lang === "es");
}
async function openReply(page: Page, es: boolean) {
  const p = page.getByTestId("confidence-practice");
  await p.locator('button').filter({ hasText: /@/ }).first().click();
  await p.getByRole("button", { name: es ? "Responder" : "Reply", exact: true }).click();
}
async function pickFile(page: Page, name: string, es: boolean, coursework = false) {
  const p = page.getByTestId("confidence-practice");
  await p.getByRole("button", { name: coursework ? (es ? "Agregar o crear" : "Add or create") : (es ? "Adjuntar archivos" : "Attach files"), exact: true }).click();
  if (coursework) await p.getByRole("button", { name: "Google Drive", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name, exact: true }).click();
  await dialog.getByRole("button", { name: coursework ? (es ? "Agregar" : "Add") : (es ? "Abrir" : "Open"), exact: true }).click();
}
async function check(page:Page, es:boolean) {
  await page.locator('[data-job-card]').getByRole('button',{name:es?'Revisar mi trabajo':'Check my work',exact:true}).click();
}
for (const lang of ["en", "es"] as const) for (const scenario of ["classroom", "try", "home"] as LessonScenario[]) for (const key of CONFIDENCE_KEYS) {
  test(`${key} ${scenario} ${lang}: app action, recovery, result check, restart`, async ({ page }) => {
    const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
    const es=lang==='es'; const s=practiceScenario(key,scenario);
    await start(page,key,scenario,lang);
    const p=page.getByTestId('confidence-practice');
    const button=(en:string,spanish:string)=>p.getByRole('button',{name:es?spanish:en,exact:true});
    if(key==='account-recovery') {
      const email=page.getByTestId('practice-email'); const password=page.locator('[data-showme="password-field"]');
      await expect(email).toHaveValue('');
      await email.fill(scenario==='classroom'?'you@harborsidecafe.com':s.expected.email);
      await password.fill(scenario==='classroom'?'Harbor2026':s.expected.password);
      await page.getByTestId('practice-sign-in').click();
      const code=page.locator('[data-showme="code-field"]');await code.fill('000000');
      await page.getByRole('button',{name:es?'Verificar':'Verify',exact:true}).click();
      await expect(code).toHaveValue('000000');
      await code.fill(scenario==='classroom'?'482915':s.expected.code);
      await page.getByRole('button',{name:es?'Verificar':'Verify',exact:true}).click();
    } else if(key==='mail-reply'||key==='mail-attach') {
      const body=p.getByLabel(es?'Mensaje':'Message',{exact:true});
      if(key==='mail-reply') {await body.fill('unrelated');if(scenario==='classroom')await p.getByLabel(es?'Para':'To',{exact:true}).fill('wrong@example.test');}
      else {const wrong=s.files!.find(f=>f.key!==s.expected.file)!; await pickFile(page,wrong.name,es);}
      await button('Send','Enviar').click();
      await expect(p.getByTestId('practice-result')).toBeVisible();
      await expect(page.getByTestId('lesson-practice-again')).toHaveCount(0);
      await check(page,es);
      await expect(page.locator('[data-job-card]')).toContainText(es?'Comentario de práctica':'Practice feedback');
      await button('Write a follow-up','Escribir otro correo').click();
      if(key==='mail-reply') {
        await expect(body).toHaveValue('unrelated');await p.getByLabel(es?'Para':'To',{exact:true}).fill(s.recipient!);
        await body.fill(scenario==='classroom'?(es?'Gracias, Maria':'Thank you, Maria'):scenario==='try'?'Room 28':'Three more');
      } else {
        await button('Remove','Quitar').click(); await pickFile(page,s.files!.find(f=>f.key===s.expected.file)!.name,es);
      }
      await button('Send','Enviar').click();await check(page,es);
      if(key==='mail-reply'&&scenario==='classroom') for(const reply of ['I will be there at 10 AM','My bag goes on the shelf under the counter']) {
        await openReply(page,es);await body.fill(reply);await button('Send','Enviar').click();await check(page,es);
      }
    } else if(key==='files') {
      const target=s.files!.find(f=>f.key===s.expected.file)!;
      const row=()=>p.getByRole('row').filter({hasText:s.expected.name});
      await p.getByRole('row').filter({hasText:target.name}).getByRole('button',{name:es?'Cambiar nombre':'Rename',exact:true}).click();
      await page.getByRole('dialog').getByLabel(es?'Nombre nuevo':'New file name').fill(s.expected.name);
      await page.getByRole('dialog').getByRole('button',{name:es?'Guardar':'Save',exact:true}).click();
      await row().getByRole('button',{name:es?'Compartir':'Share',exact:true}).click();
      let d=page.getByRole('dialog');await expect(d.getByLabel(es?'Agregar personas':'Add people')).toHaveValue('');
      await d.getByLabel(es?'Agregar personas':'Add people').fill(s.recipient!);
      await d.getByLabel(es?'Permiso':'Role',{exact:true}).selectOption(s.expected.permission);
      await d.getByLabel(es?'Acceso general':'General access').selectOption('anyone');
      await d.getByRole('button',{name:es?'Guardar':'Save',exact:true}).click();await check(page,es);
      await expect(page.getByTestId('lesson-practice-again')).toHaveCount(0);
      await row().getByRole('button',{name:es?'Compartir':'Share',exact:true}).click();d=page.getByRole('dialog');
      await expect(d).toContainText(s.recipient!);
      await d.getByLabel(es?'Acceso general':'General access').selectOption('restricted');
      await d.getByRole('button',{name:es?'Guardar':'Save',exact:true}).click();await check(page,es);
    } else if(key==='coursework') {
      await expect(p.getByLabel(es?'Fecha de entrega':'Due date',{exact:true})).toHaveCount(0);
      await pickFile(page,s.files!.find(f=>f.key!==s.expected.file)!.name,es,true);
      const submit=async()=>{await button('Turn in','Entregar').click();await page.getByRole('dialog').getByRole('button',{name:es?'Entregar':'Turn in',exact:true}).click();};
      await submit();await expect(p.getByTestId('submission-status')).toHaveText(es?'Entregado':'Turned in');await check(page,es);
      await expect(page.getByTestId('lesson-practice-again')).toHaveCount(0);
      await button('Unsubmit','Anular entrega').click();await page.getByRole('dialog').getByRole('button',{name:es?'Anular entrega':'Unsubmit',exact:true}).click();
      await expect(button('Remove','Quitar')).toBeVisible();await button('Remove','Quitar').click();
      await pickFile(page,s.files!.find(f=>f.key===s.expected.file)!.name,es,true);await submit();await check(page,es);
    } else if(key==='calendar'||key==='schedule') {
      await button(key==='calendar'?'Propose a new time':'Request change',key==='calendar'?'Proponer otra hora':'Solicitar cambio').click();
      const date=p.getByLabel(es?'Fecha':'Date',{exact:true});const time=p.getByLabel(es?'Hora de inicio':'Start time');
      await date.fill('2026-01-01');await time.fill(s.expected.time);
      if(key==='calendar'){const [h,m]=s.expected.time.split(':').map(Number);const end=h*60+m+(scenario==='home'?60:30);await p.getByLabel(es?'Hora de fin':'End time').fill(`${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`);}
      const send=()=>button(key==='calendar'?'Send proposal':'Send request',key==='calendar'?'Enviar propuesta':'Enviar solicitud').click();
      await send();await expect(p.getByTestId('practice-result')).toContainText(es?'pendiente':'awaiting');await check(page,es);
      await expect(page.getByTestId('lesson-practice-again')).toHaveCount(0);
      await button(key==='calendar'?'Propose a new time':'Request change',key==='calendar'?'Proponer otra hora':'Solicitar cambio').click();
      await expect(time).toHaveValue(s.expected.time);await date.fill(s.expected.date);await send();await check(page,es);
    } else if(key==='spreadsheet') {
      for(const [cell,value] of Object.entries(s.expected)) if(cell.startsWith('B')) await p.getByLabel(cell,{exact:true}).fill(value);
      await expect(p.getByTestId('sheet-total')).toHaveText(Number(s.expected.total).toFixed(2));
      await button('Write email','Escribir correo').click();await p.getByLabel(es?'Para':'To',{exact:true}).fill(s.recipient!);
      await p.getByLabel(es?'Mensaje':'Message',{exact:true}).fill('999');await button('Send','Enviar').click();await check(page,es);
      await expect(page.getByTestId('lesson-practice-again')).toHaveCount(0);
      await button('Back to sheet','Volver a la hoja').click();await expect(p.getByLabel('B2',{exact:true})).toHaveValue(s.expected.B2);
      await button('Write email','Escribir correo').click();await p.getByLabel(es?'Mensaje':'Message',{exact:true}).fill(s.expected.total);await button('Send','Enviar').click();await check(page,es);
    }
    await expect(page.getByTestId('lesson-practice-again')).toBeVisible();
    await page.getByTestId('lesson-practice-again').click();
    if(key==='account-recovery') await expect(page.getByTestId('practice-email')).toHaveValue('');
    else await expect(p.getByTestId('practice-result')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test("collection links, Spanish print handout, and separate observation sheet", async ({ page }) => {
  await page.goto("/lessons?teacher=1&lang=es");
  await page.getByTestId("confidence-collection").click();
  for (const key of CONFIDENCE_KEYS) await expect(page.getByTestId(`confidence-pack-${key}`)).toBeVisible();
  await page.goto("/lessons/confidence?teacher=1&lesson=mail-attach&lang=es");
  await expect(page.getByTestId("confidence-teacher-notes")).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.getByTestId("confidence-teacher-notes")).not.toBeVisible();
  await expect(page.getByText("Agenda-November.pdf", { exact: true })).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await page.getByRole("link", { name: "Hoja de observación para imprimir" }).click();
  await expect(page.getByTestId("confidence-observation")).toContainText("Confianza ANTES");
  await expect(page.getByTestId("confidence-observation")).toContainText("Confianza DESPUÉS");
});

test("scenario switch preserves support and language, clears draft, and shares clean student link", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await start(page, "mail-reply", "try", "es");
  await page.getByLabel("Mensaje", { exact: true }).fill("borrador");
  const card = page.locator("[data-job-card]");
  await card.getByText("Más práctica", { exact: true }).click();
  await card.getByRole("button", { name: "Práctica en casa", exact: true }).click();
  await expect(page).toHaveURL(/scenario=home/);
  await expect(page).toHaveURL(/lang=es/);
  await page.getByTestId("lesson-intro-start").click();
  await openReply(page, true);
  await expect(page.getByLabel("Mensaje", { exact: true })).toHaveValue("");
  await page.getByTestId("teacher-preview").getByRole("button").first().click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("scenario=home"); expect(copied).toContain("lang=es"); expect(copied).not.toContain("preview");
});

test("invalid scenario and unsupported alternate lesson return 404", async ({ page }) => {
  expect((await page.goto("/lessons/mail-reply?scenario=invalid"))?.status()).toBe(404);
  expect((await page.goto("/lessons/w4-form?scenario=home"))?.status()).toBe(404);
});

for (const lang of ["en", "es"]) for (const viewport of [{ width: 1366, height: 768 }, { width: 683, height: 384 }, { width: 390, height: 844 }]) {
  test(`confidence layout and help ${lang} ${viewport.width}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await start(page, "mail-reply", "home", lang);
    const p = page.getByTestId("confidence-practice");
    const message = p.getByRole("textbox", { name: lang === "es" ? "Mensaje" : "Message", exact: true });
    await message.fill("draft / borrador");
    const card = page.locator("[data-job-card]");
    await card.getByRole("button", { name: lang === "es" ? "Necesito ayuda" : "I need help", exact: true }).click();
    await card.getByRole("button", { name: lang === "es" ? "Volver a mi tarea" : "Back to my task", exact: true }).click();
    await expect(message).toHaveValue("draft / borrador");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`confidence-${lang}-${viewport.width}.png`), fullPage: true });
  });
}

test("optional lesson warm-up returns to the draft without opening Story orientation", async ({ page }) => {
  await start(page, "mail-reply", "home", "en");
  const card = page.locator("[data-job-card]");
  const message = page.getByRole("textbox", { name: "Message", exact: true });
  await message.fill("Three more");
  await card.getByText("More practice", { exact: true }).click();
  await card.getByRole("button", { name: "Optional mouse and scrolling practice", exact: true }).click();
  await expect(card).toHaveAttribute("data-practice", "click");
  await card.getByRole("button", { name: "Open practice notice", exact: true }).focus();
  await page.keyboard.press("Enter");
  await card.locator("[data-practice-notice]").getByRole("button", { name: "Ready", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("data-practice", "complete");
  await card.locator("[data-practice-exit]").click();
  await expect(message).toHaveValue("Three more");
  await expect(page.getByTestId("bookmark-tour")).toHaveCount(0);
});

test("a fresh scenario records one guest practice finish, not Story credit", async ({ page }) => {
  await start(page, "mail-reply", "home", "en", false);
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("Three more");
  await page.getByTestId("confidence-practice").getByRole("button", { name: "Send", exact: true }).click();
  const attempts = () => page.evaluate(() => JSON.parse(localStorage.getItem("lesson-attempt:mail-reply:guest") ?? "null"));
  expect(await attempts()).toBeNull();
  await page.locator("[data-job-card]").getByRole("button", { name: "Check my work", exact: true }).click();
  await expect.poll(async () => (await attempts())?.attempts).toBe(1);
  await page.reload();
  expect((await attempts()).attempts).toBe(1);
});
