import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Owner notes, 30 Sep: Maria's Day 2 text says exactly what to reply, and a
 * new hire sends their own food handler certificate instead of the district
 * safety report. This walks Day 2 the way a learner could get it wrong: the
 * reply Maria asked for, the practice-test answer, the expired certificate,
 * the practice test, then the right certificate, with a reload in between.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: Lang, name: string) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

async function openTodaysJob(page: Page) {
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

/** Nothing in the open picker (a file row, the page preview, Attach) is under the Job Card. */
async function expectPickerClearOfCard(page: Page) {
  const covered = await page.evaluate(() => {
    const c = document.querySelector("[data-job-card]")!.getBoundingClientRect();
    const hit = (b: DOMRect) => b.left < c.right && b.right > c.left && b.top < c.bottom && b.bottom > c.top;
    const dialog = document.querySelector('[role="dialog"]')!;
    const parts = [...dialog.querySelectorAll<HTMLElement>('[data-showme="attach-list"] button, [data-showme="attach-preview"], [data-showme="attach-confirm"]')];
    return parts.filter((el) => hit(el.getBoundingClientRect())).map((el) => el.textContent?.trim().slice(0, 40) || el.dataset.showme);
  });
  expect(covered).toEqual([]);
}

async function pickFile(page: Page, file: RegExp) {
  const picker = page.getByRole("dialog");
  await picker.getByRole("button", { name: file }).click();
  await page.locator('[data-showme="attach-confirm"]').click();
}

for (const [lang, size] of [["en", { width: 1366, height: 768 }], ["es", { width: 911, height: 512 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });

    test(`Day 2: the reply Maria asks for, then the food handler certificate (${lang})`, async ({ page }) => {
      test.slow();
      const t = (en: string, es: string) => (lang === "en" ? en : es);
      const name = `E2e Cert ${lang} ${Date.now() % 1_000_000}`;
      await signUp(page, lang, name);
      await page.goto("/studio");
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 2: / }).click());
      await page.goto("/");
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);

      // Task 1: the swap, then Maria's text. It says what to write, and the
      // card asks for the same words; typing exactly that finishes it.
      await page.locator('[data-showme="swap-button"]').first().click();
      await page.locator('[data-showme="swap-cover"]').selectOption("thu-late");
      await page.locator('[data-showme="submit-button"]').click();
      const model = t("Yes, Thursday works.", "Sí, el jueves está bien.");
      await expect(page.getByTestId("text-thread")).toContainText(model);
      await expect(card(page)).toContainText(model);
      await page.getByTestId("text-reply").fill(model);
      await page.getByTestId("text-send").click();
      await card(page).getByRole("button", { name: /Next task|Siguiente tarea/ }).click();

      // Task 2: Maria's email is about the training, not a district report.
      await openTodaysJob(page);
      const row = page.locator('[data-showme="maria-row"]');
      await expect(row).toContainText(t("Food handler training", "Capacitación de manipulador de alimentos"));
      if (!(await page.locator('[data-showme="reply-button"]').isVisible())) await row.click();
      await expect(appWindow(page)).toContainText(t("not the practice test", "no el examen de práctica"));
      await expect(appWindow(page)).not.toContainText(/safety report|reporte de seguridad|district|distrito/i);
      await page.locator('[data-showme="reply-button"]').click();

      // The practice-test answer is refused with a pointer back to the email.
      await page.getByRole("button", { name: t("Your food handler practice test, today by 3 PM", "Tu examen de práctica de manipulador de alimentos, hoy antes de las 3 PM"), exact: true }).click();
      await expect(page.getByText(t("Does she want the practice test?", "¿Quiere el examen de práctica?")).first()).toBeVisible();
      await page.getByRole("button", { name: t("Your food handler certificate, today by 3 PM", "Tu certificado de manipulador de alimentos, hoy antes de las 3 PM"), exact: true }).click();

      // The picker: the expired one, then the practice test, are each refused.
      await page.locator('[data-showme="attach-button"]').click();
      await expectPickerClearOfCard(page);
      await pickFile(page, /food-handler-certificate-2022\.pdf/);
      await expect(card(page)).toContainText(t("expired on Jun 3, 2025", "venció (Expires) el 3 de junio de 2025"));
      await pickFile(page, /food-handler-practice-test\.pdf/);
      await expect(card(page)).toContainText(t("That page is the practice test", "Esa página es el examen de práctica"));

      // The right one shows the learner's own name on the page.
      await page.getByRole("dialog").getByRole("button", { name: /food-handler-certificate\.pdf/ }).click();
      const preview = page.locator('[data-showme="attach-preview"]');
      await expect(preview).toContainText("Food Handler Certificate");
      await expect(preview).toContainText(name);
      await expect(preview).toContainText("Aug 12, 2029");
      // The card has grown with a correction: still clear of the picker.
      await expectPickerClearOfCard(page);
      await page.locator('[data-showme="attach-confirm"]').click();
      await expect(appWindow(page)).toContainText("food-handler-certificate.pdf");

      // A reload keeps the attachment and the words.
      const note = t("Hi Maria, here is my food handler certificate.", "Hola Maria, aquí está mi certificado de manipulador de alimentos.");
      await page.locator('[data-showme="compose-body"]').last().fill(note);
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);
      if (!(await page.locator('[data-showme="compose-body"]').last().isVisible())) await page.getByTestId("bookmark-mail").click();
      await expect(page.locator('[data-showme="compose-body"]').last()).toHaveValue(note);
      await expect(appWindow(page)).toContainText("food-handler-certificate.pdf");
      await page.locator('[data-showme="send-button"]').last().click();
      await expect(page.locator("[data-celebration-continue]").or(card(page).locator('[data-card-tone="green"]')).first()).toBeVisible({ timeout: 20_000 });
    });
  });
}
