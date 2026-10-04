import { test, expect, type Page } from "@playwright/test";
import { waitForInteractive } from "./interactive";
import { CONFIDENCE_KEYS } from "../src/lib/lessons/confidence";

async function start(page: Page, key: string, scenario: string, lang: string, preview = true) {
  await page.goto(`/lessons/${key}?scenario=${scenario}&lang=${lang}${preview ? "&preview=1" : ""}`);
  await waitForInteractive(page);
  await page.getByTestId("lesson-intro-start").click();
  await expect(page.getByTestId("confidence-practice")).toBeVisible();
  await page.getByTestId("confidence-practice").getByRole("button").first().click();
}
async function pickFile(page: Page, name: string, es: boolean, files = false) {
  const practice = page.getByTestId("confidence-practice");
  await practice.getByRole("button", { name: es ? /^(Adjuntar|Agregar archivo|Abrir archivo)$/ : /^(Attach|Add file|Open file)$/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name, exact: true }).click();
  await dialog.getByRole("button", { name: files ? (es ? "Abrir" : "Open") : (es ? "Adjuntar" : "Attach"), exact: true }).click();
}
for (const lang of ["en", "es"]) for (const scenario of ["try", "home"]) for (const key of CONFIDENCE_KEYS) {
  test(`${key} ${scenario} ${lang}: recover, review, complete, restart`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    const es = lang === "es";
    const home = scenario === "home";
    await start(page, key, scenario, lang);
    const p = page.getByTestId("confidence-practice");
    const card = page.locator("[data-job-card]");
    // Incorrect attempts keep the working surface open.
    if (key !== "account-recovery") { await p.getByTestId("confidence-review").click(); await expect(p.getByTestId("confidence-result")).toHaveCount(0); }
    if (key === "mail-reply") {
      const message = p.getByLabel(es ? "Mensaje" : "Message", { exact: true });
      await message.fill("Thanks"); await p.getByTestId("confidence-review").click(); await expect(message).toHaveValue("Thanks");
      await message.fill(home ? (es ? "Tres más" : "Three more") : (es ? "Aula 28" : "Room 28"));
    }
    if (key === "mail-attach") {
      await pickFile(page, home ? "Agenda-December.pdf" : "Trip-form.pdf", es);
      await p.getByTestId("confidence-review").click();
      await expect(p).toContainText(home ? "Agenda-December.pdf" : "Trip-form.pdf");
      await p.getByRole("button", { name: es ? "Quitar" : "Remove", exact: true }).click();
      await pickFile(page, home ? "Agenda-November.pdf" : "Trip-form-signed.pdf", es);
    }
    if (key === "files") {
      await pickFile(page, home ? "Notes-v2.pdf" : "List-11.pdf", es, true);
      await p.getByRole("button", { name: es ? "Cambiar nombre" : "Rename", exact: true }).click();
      await p.getByLabel(es ? "Nombre nuevo" : "New file name").fill(home ? "Class-reading-final.pdf" : "Garden-November.pdf");
      await p.getByRole("button", { name: es ? "Compartir" : "Share", exact: true }).click();
      await p.getByLabel(es ? "Acceso" : "Access", { exact: true }).selectOption(home ? "edit" : "view");
    }
    if (key === "calendar" || key === "schedule") {
      await p.getByLabel(es ? "Fecha" : "Date", { exact: true }).selectOption(home ? (key === "calendar" ? "2026-11-13" : "2026-11-14") : "2026-11-10");
      await p.getByLabel(es ? "Hora de inicio" : "Start time").selectOption(home ? (key === "calendar" ? "12:00" : "11:00") : key === "calendar" ? "16:00" : "14:00");
    }
    if (key === "account-recovery") {
      await p.getByLabel(es ? "Correo" : "Email", { exact: true }).fill(home ? "reader@library.example.test" : "student@class.example.test");
      await p.getByLabel(es ? "Contraseña de práctica" : "Practice password").fill(home ? "Books!26" : "Class!26");
      await p.getByRole("button", { name: es ? "Siguiente" : "Next", exact: true }).click();
      await p.getByTestId("phone-texts").getByRole("button").nth(home ? 1 : 0).click();
      const code = p.getByLabel(es ? "Código de verificación" : "Verification code");
      await code.fill("000000"); await p.getByTestId("confidence-review").click(); await expect(code).toHaveValue("000000");
      await code.fill(home ? "730184" : "481926");
    }
    if (key === "spreadsheet") {
      await expect(p.getByLabel(es ? "Editar celda B2" : "Edit cell B2")).toHaveCount(0);
      await p.locator('[data-grid-cell="2:B"]').click();
      await p.getByLabel(es ? "Editar celda B2" : "Edit cell B2").fill(home ? "9" : "12");
      await p.locator('[data-grid-cell="3:B"]').click();
      await p.getByLabel(es ? "Editar celda B3" : "Edit cell B3").fill(home ? "7" : "8");
      await p.getByLabel(es ? "Total para enviar" : "Total to send").fill(home ? "16" : "20");
    }
    if (key === "coursework") {
      await pickFile(page, home ? "Computer-notes-v2.pdf" : "Reading-log-complete.pdf", es);
      await p.getByLabel(es ? "Fecha de entrega" : "Due date").fill(home ? "2026-11-18" : "2026-11-12");
    }
    await p.getByTestId("confidence-review").click();
    await expect(p.getByTestId("confidence-result")).toBeVisible();
    await p.getByTestId("confidence-confirm").click();
    await card.getByRole("button", { name: es ? "Revisé el resultado" : "I checked the result", exact: true }).click();
    await expect(card.getByTestId("lesson-practice-again")).toBeVisible();
    await card.getByTestId("lesson-practice-again").click();
    await expect(p.getByTestId("confidence-result")).toHaveCount(0);
    if (key === "account-recovery") {
      await p.getByRole("button", { name: es ? "Iniciar sesión" : "Sign in", exact: true }).click();
      await expect(p.getByLabel(es ? "Correo" : "Email", { exact: true })).toHaveValue("");
      await expect(p.getByLabel(es ? "Contraseña de práctica" : "Practice password")).toHaveValue("");
    }
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
  await page.getByTestId("confidence-practice").getByRole("button", { name: "Responder", exact: true }).click();
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
  await page.getByTestId("confidence-review").click();
  await page.getByTestId("confidence-confirm").click();
  const attempts = () => page.evaluate(() => JSON.parse(localStorage.getItem("lesson-attempt:mail-reply:guest") ?? "null"));
  expect(await attempts()).toBeNull();
  await page.locator("[data-job-card]").getByRole("button", { name: "I checked the result", exact: true }).click();
  await expect.poll(async () => (await attempts())?.attempts).toBe(1);
  await page.reload();
  expect((await attempts()).attempts).toBe(1);
});
