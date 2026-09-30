import { test, expect, type Page } from "@playwright/test";
import { waitForInteractive } from "./interactive";

/**
 * Phase 3 N-6: at 911x512 (a Chromebook at 150% text) the welcome page's only
 * way in, "Start my first day", sat below the screen (y=578 EN, 620 ES), and
 * a cut-off box was the only hint to scroll. On a short screen the first job
 * and its button now come before the skills row; tall screens keep the order.
 */

type Lang = "en" | "es";

async function signUpToWelcome(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Start ${lang} ${Date.now() % 1_000_000}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await expect(page.getByTestId("simulator-welcome")).toBeVisible({ timeout: 20_000 });
}

/** Whether the skills row is above the first job's button on the page. */
async function skillsFirst(page: Page) {
  const skills = await page.locator("#welcome-skills-title").boundingBox();
  const start = await page.getByTestId("welcome-continue").boundingBox();
  return Boolean(skills && start && skills.y < start.y);
}

for (const lang of ["es", "en"] as const) {
  test(`911x512: "Start my first day" is on screen without scrolling (${lang})`, async ({ page }) => {
    await page.setViewportSize({ width: 911, height: 512 });
    await signUpToWelcome(page, lang);
    const start = page.getByTestId("welcome-continue");
    await expect(start).toBeInViewport({ ratio: 1 });
    expect(await page.evaluate(() => document.scrollingElement?.scrollTop ?? 0)).toBe(0);
    // The skills row is still on the page, below.
    await expect(page.locator("#welcome-skills-title")).toBeAttached();
    expect(await skillsFirst(page)).toBe(false);

    await page.reload();
    await waitForInteractive(page);
    await expect(page.getByTestId("simulator-welcome")).toBeVisible();
    await expect(start).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: test.info().outputPath(`welcome-911-${lang}.png`) });
  });
}

test("1366x768 keeps the skills row before the first job", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await signUpToWelcome(page, "en");
  expect(await skillsFirst(page)).toBe(true);
});
