import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { pressNextTask } from "./next-task";

/**
 * Phase 3 N-8: on Day 2, after the expired certificate is refused, Show me
 * rings the page in the picker's preview. The page is taller than the preview
 * (and wider, at 911), so the ring ran past the preview, over Cancel and
 * Attach and off the bottom of the screen, and at 911 over the file names,
 * with its "Look here." label off screen. The ring is the part of the target
 * that can be seen: inside the preview, on screen, with its label.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Ring ${lang} ${Date.now() % 1_000_000}`);
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

/** The ring, the preview it points into, the screen, and the label. */
async function ringAndPreview(page: Page) {
  return page.evaluate(() => {
    const box = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    };
    return {
      ring: box(document.querySelector(".animate-showme-pulse")),
      preview: box(document.querySelector('[data-testid="picker-preview"]')),
      screen: { width: innerWidth, height: innerHeight },
    };
  });
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });
    const t = (en: string, es: string) => (lang === "en" ? en : es);
    const look = t("Look here.", "Mira aquí.");

    async function refuseExpiredThenShowMe(page: Page) {
      await page.getByRole("dialog").getByRole("button", { name: /food-handler-certificate-2022\.pdf/ }).click();
      await page.locator('[data-showme="attach-confirm"]').click();
      await card(page).getByRole("button", { name: /^(Show me|Muéstrame)$/ }).click();
      await expect(page.locator(".animate-showme-pulse")).toBeVisible();
      // Let the preview's scroll settle before measuring.
      await page.waitForTimeout(400);
      const { ring, preview, screen } = await ringAndPreview(page);
      expect(ring && preview).toBeTruthy();
      // The ring keeps its few pixels of padding around what it points at.
      const pad = 8;
      expect(ring!.left).toBeGreaterThanOrEqual(preview!.left - pad);
      expect(ring!.right).toBeLessThanOrEqual(preview!.right + pad);
      expect(ring!.top).toBeGreaterThanOrEqual(preview!.top - pad);
      expect(ring!.bottom).toBeLessThanOrEqual(preview!.bottom + pad);
      expect(ring!.bottom).toBeLessThanOrEqual(screen.height);
      expect(ring!.right).toBeLessThanOrEqual(screen.width);
      // Attach is not under the ring.
      const attach = await page.locator('[data-showme="attach-confirm"]').boundingBox();
      expect(attach!.y).toBeGreaterThanOrEqual(ring!.bottom - 1);
      // The label says where to look, on screen.
      await expect(page.getByText(look, { exact: true })).toBeInViewport();
    }

    test(`Day 2 picker: Show me after the expired certificate stays inside the preview (${lang}, ${size.width})`, async ({ page }) => {
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

      await refuseExpiredThenShowMe(page);
      await page.screenshot({ path: test.info().outputPath(`ring-${lang}-${size.width}.png`) });

      // After a reload, the same.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openPicker(page);
      await refuseExpiredThenShowMe(page);
    });
  });
}
