import { test, expect, type Page } from "@playwright/test";
import { waitForInteractive } from "./interactive";

/**
 * Wave 5 F-7, level 0: a reload part-way through "How this works" keeps the
 * learner's place. The welcome beat, each practice stage and each walkthrough
 * step come back after a real reload, in English and Spanish, docked (911x512,
 * 150% text on a Chromebook) and at 1366x768.
 */

const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: "en" | "es") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Tour ${lang} ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

/** React's "setState in render" warnings, which a draft written during render raises. */
function watchRenderUpdates(page: Page) {
  const seen: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && m.text().includes("Cannot update a component")) seen.push(m.text());
  });
  return seen;
}

async function reload(page: Page) {
  await page.reload();
  await waitForInteractive(page);
  await expect(card(page)).toBeVisible();
}

/** After a reload the Browser is shut; the card's own button opens it again. */
async function reopenTour(page: Page) {
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

const sizes = [
  { width: 911, height: 512, dock: true },
  { width: 1366, height: 768, dock: false },
];

for (const lang of ["en", "es"] as const) {
  const t = (en: string, es: string) => (lang === "en" ? en : es);
  const startName = t("Start looking around", "Empezar a mirar");
  const welcome = t("This card tells you what to do.", "Esta tarjeta te dice qué hacer.");
  const practiceName = t("Practice clicking and scrolling", "Practicar clics y desplazamiento");
  const bookmarks = t("These are your bookmarks.", "Estos son tus marcadores.");
  const clickMail = t("Click Mail.", "Haz clic en Correo.");
  const workEmail = t("This is your work email.", "Este es tu correo del trabajo.");
  const tryHelp = t("Tap the ? on this card to try Help.", "Toca el ? en esta tarjeta para probar Ayuda.");
  const helpLead = t("You tried Help. You are ready for your first task.", "Ya probaste Ayuda. Ya puedes empezar tu primera tarea.");

  for (const size of sizes) {
    test.describe(`${lang} ${size.width}x${size.height}`, () => {
      test.use({ viewport: { width: size.width, height: size.height } });

      test(`a reload keeps the welcome beat and each practice stage (${lang}, ${size.width})`, async ({ page }) => {
        test.slow();
        const renderUpdates = watchRenderUpdates(page);
        await signUp(page, lang);
        const c = card(page);
        if (size.dock) await expect(c).toHaveAttribute("data-corner", "dock");

        await reload(page);
        await expect(c.getByRole("button", { name: startName, exact: true })).toBeVisible();
        await expect(c.getByRole("button", { name: practiceName })).toBeVisible();

        await c.getByRole("button", { name: practiceName }).click();
        await expect(c).toHaveAttribute("data-practice", "click");
        await reload(page);
        await expect(c).toHaveAttribute("data-practice", "click");

        await c.getByRole("button", { name: t("Open practice notice", "Abrir aviso de práctica"), exact: true }).click();
        await expect(c).toHaveAttribute("data-practice", "scroll");
        await reload(page);
        await expect(c).toHaveAttribute("data-practice", "scroll");

        await c.locator("[data-practice-notice]").getByRole("button", { name: t("Ready", "Listo"), exact: true }).click();
        await expect(c).toHaveAttribute("data-practice", "complete");
        await reload(page);
        await expect(c).toHaveAttribute("data-practice", "complete");

        await c.locator("[data-practice-exit]").click();
        await expect(c).toHaveAttribute("data-practice", "inactive");
        await expect(c).toContainText(bookmarks);
        expect(renderUpdates).toEqual([]);
      });

      test(`a reload keeps each walkthrough step and the Help beat (${lang}, ${size.width})`, async ({ page }) => {
        test.slow();
        const renderUpdates = watchRenderUpdates(page);
        await signUp(page, lang);
        const c = card(page);
        await c.getByRole("button", { name: startName, exact: true }).click();

        // Step 1: the bookmarks look beat.
        await expect(c).toContainText(bookmarks);
        await reload(page);
        // Past the welcome: no welcome beat, and no practice offer.
        await expect(c.getByRole("button", { name: practiceName })).toHaveCount(0);
        // (The tour's own card shares the "Start looking around" label.)
        await expect(c).not.toContainText(welcome);
        await reopenTour(page);
        await expect(c).toContainText(bookmarks);
        await c.getByRole("button", { name: t("Next", "Siguiente"), exact: true }).click();

        // Step 2: click Mail.
        await expect(c).toContainText(clickMail);
        await reload(page);
        await reopenTour(page);
        await expect(c).toContainText(clickMail);
        await page.getByTestId("bookmark-mail").click();

        // Step 3: the Mail look beat, with Mail back on screen.
        await expect(c).toContainText(workEmail);
        await reload(page);
        await reopenTour(page);
        await expect(c).toContainText(workEmail);
        await expect(page.getByTestId("mail-app-title")).toBeVisible();
        await c.getByRole("button", { name: t("I understand", "Entiendo"), exact: true }).click();

        // Step 4: try Help on the card.
        await expect(c).toContainText(tryHelp);
        await reload(page);
        await reopenTour(page);
        await expect(c).toContainText(tryHelp);
        await page.getByTestId("job-card-help").click();
        await c.getByRole("button", { name: t("I understand. Back to my task", "Entendido. Volver a mi tarea"), exact: true }).click();

        // The Help beat: a reload stays here, it does not restart the walkthrough.
        await expect(c).toContainText(helpLead);
        await reload(page);
        await reopenTour(page);
        await expect(c).toContainText(helpLead);
        await expect(c).not.toContainText(bookmarks);
        await expect(page.getByText(t("Good. Come back any time you get lost.", "Bien. Vuelve aquí cada vez que te pierdas."), { exact: false })).toBeVisible();
        await page.getByRole("button", { name: t("I'm ready for the task", "Empezar la tarea") }).click();
        await expect(page.getByText(t("You found your way around.", "Ya recorriste las partes principales."), { exact: false })).toBeVisible();
        expect(renderUpdates).toEqual([]);
      });
    });
  }
}
