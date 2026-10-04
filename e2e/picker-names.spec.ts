import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { pressNextTask } from "./next-task";

/**
 * Phase 3 N-3: with the Job Card docked at 911, the Day 2 picker cut every
 * name to "food-handle…", so the three certificate files looked the same and
 * only the dates told them apart. Names now wrap at their hyphens and are
 * read in full, and Attach stays on screen.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Names ${lang} ${Date.now() % 1_000_000}`);
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

/** Each file name in the open picker, and whether any of it is cut off. */
async function names(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[role="dialog"] [data-file-name]')].map((el) => ({
      text: el.textContent,
      cut: el.scrollWidth > el.clientWidth + 1,
    })),
  );
}

async function openPicker(page: Page) {
  await openTodaysJob(page);
  if (!(await page.locator('[data-showme="attach-button"]').isVisible())) {
    const row = page.locator('[data-showme="maria-row"]');
    if (await row.isVisible()) await row.click();
    const reply = page.locator('[data-showme="reply-button"]');
    if (await reply.isVisible()) await reply.click();
  }
  await page.locator('[data-showme="attach-button"]').click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });
    const t = (en: string, es: string) => (lang === "en" ? en : es);

    test(`Day 2 picker: every file name is shown in full (${lang}, ${size.width})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      await page.goto("/studio");
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 2: / }).click());
      await page.goto("/");
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);
      await page.locator('[data-showme="swap-button"]').first().click();
      await page.locator('[data-showme="swap-cover"]').selectOption("thu-late");
      await page.locator('[data-showme="submit-button"]').click();
      await page.getByTestId("text-reply").fill(t("Yes, Thursday works.", "Sí, el jueves está bien."));
      await page.getByTestId("text-send").click();
      await pressNextTask(page);
      await openTodaysJob(page);
      const row = page.locator('[data-showme="maria-row"]');
      if (!(await page.locator('[data-showme="reply-button"]').isVisible())) await row.click();
      await page.locator('[data-showme="reply-button"]').click();
      await page.getByRole("button", { name: t("Your food handler certificate, today by 3 PM", "Tu certificado de manipulador de alimentos, hoy antes de las 3 PM"), exact: true }).click();
      await page.locator('[data-showme="attach-button"]').click();

      const expected = ["photo-jobsite-0714.jpg", "food-handler-practice-test.pdf", "food-handler-certificate.pdf", "shift-swap-form.pdf", "food-handler-certificate-2022.pdf"];
      const check = async () => {
        const shown = await names(page);
        expect(shown.map((n) => n.text)).toEqual(expected);
        expect(shown.filter((n) => n.cut)).toEqual([]);
        await expect(page.locator('[data-showme="attach-confirm"]')).toBeInViewport();
      };
      await check();
      // With a page open beside the list (the narrowest the list gets).
      await page.getByRole("dialog").getByRole("button", { name: /food-handler-certificate-2022\.pdf/ }).click();
      await check();
      await page.screenshot({ path: test.info().outputPath(`picker-${lang}-${size.width}.png`) });

      // After a reload, the same picker reads the same.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openPicker(page);
      await check();
    });
  });
}
