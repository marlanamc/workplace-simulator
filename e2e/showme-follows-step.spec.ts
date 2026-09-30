import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 N-1: Show me's ring stayed on the old control after the step moved
 * on, for anyone not using a mouse (a mouse press already put it away). The
 * card said "Click Submit request." while the ring still said "This one.
 * Click it." over the filled shift choice; on Day 6 the ring and "Net pay."
 * stayed on an empty spot after the stub closed. Here every action is done
 * from the keyboard, so nothing but the step change can put the ring away.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");
const ring = (page: Page) => page.locator(".animate-showme-pulse");

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

async function startOf(page: Page, day: RegExp) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: day }).click());
  await page.goto("/");
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  await openTodaysJob(page);
}

async function openTodaysJob(page: Page) {
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

/** Focus a control and press Enter: no pointer event at all. */
async function enter(page: Page, target: ReturnType<Page["locator"]>) {
  await target.focus();
  await page.keyboard.press("Enter");
}

const showMe = (page: Page) => card(page).getByRole("button", { name: /^(Show me|Muéstrame)$/ });

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });
    const t = (en: string, es: string) => (lang === "en" ? en : es);

    test(`Day 2: the ring leaves the shift choice once the card says Submit (${lang})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      await startOf(page, /Start of Day 2: /);
      await enter(page, page.locator('[data-showme="swap-button"]').first());

      // Show me on the empty choice: the ring is up.
      await enter(page, showMe(page));
      await expect(ring(page)).toHaveCount(1);

      // Pick the shift from the keyboard. The card moves on to Submit.
      const cover = page.locator('[data-showme="swap-cover"]');
      await cover.focus();
      await cover.selectOption("thu-late");
      await expect(card(page)).toContainText(t("Click Submit request.", "Haz clic en Enviar solicitud."));
      await expect(ring(page)).toHaveCount(0);

      // A reload, then Show me again points at the current step: Submit.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);
      await expect(ring(page)).toHaveCount(0);
      await enter(page, showMe(page));
      await expect(ring(page)).toHaveCount(1);
      const hole = await ring(page).boundingBox();
      const submit = await page.locator('[data-showme="submit-button"]').boundingBox();
      expect(hole && submit && Math.abs(hole.y + hole.height / 2 - (submit.y + submit.height / 2)) < 4).toBe(true);
    });

    test(`Day 6: the ring goes when the stub closes (${lang})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      await startOf(page, /Start of Day 6: /);
      await enter(page, page.locator('[data-showme="target-stub"]'));
      await expect(card(page)).toContainText(t("Find the net pay on this stub.", "pago neto (Net pay)"));
      await enter(page, showMe(page));
      await expect(ring(page)).toHaveCount(1);

      // Back to the Browser from the keyboard: the stub is gone, so is the ring.
      await enter(page, card(page).locator(".job-card-primary").first());
      await expect(appWindow(page)).toContainText(t("What was the net pay on your stub?", "¿Cuál fue el pago neto (Net pay) en tu recibo?"));
      await expect(ring(page)).toHaveCount(0);
    });
  });
}
