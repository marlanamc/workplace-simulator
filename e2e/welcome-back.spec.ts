import { test, expect, type Page } from "@playwright/test";
import { DESKTOP_COPY } from "@/lib/desktop-content";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Wave 5 F-6: after "Stop for today", signing back in showed the same stop
 * card, with "Stop for today" as the big blue button and "Next time you
 * sign in…". A learner who pressed it was signed straight back out.
 * Coming back now shows a welcome back with one button: carry on.
 */

const modal = (page: Page) => page.locator("div.fixed.inset-0.z-\\[80\\]");
const card = (page: Page) => page.locator("[data-job-card]");

for (const [lang, size] of [["en", { width: 1366, height: 768 }], ["es", { width: 911, height: 512 }]] as const) {
  test(`finish Day 3, stop for today, sign back in: welcome back (${lang})`, async ({ page }) => {
    test.slow();
    await page.setViewportSize(size);
    const t = (en: string, es: string) => (lang === "en" ? en : es);
    const name = `E2e Back ${lang} ${Date.now() % 100000}`;
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

    // Play Day 3 through, in this session.
    await page.goto("/studio");
    await waitForInteractive(page);
    await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 3: / }).click());
    await modal(page).locator("[data-celebration-continue]").click();
    await page.locator('[data-showme="clockin-button"]').click();
    await page.locator('[data-showme="something-off-button"]').click();
    await page.locator('[data-showme="compose-body"]').first().fill(t("hi maria i come 7. clock say 8:15", "hola maria llegué a las 7 y el reloj dice 8:15"));
    await page.locator('[data-showme="send-button"]').first().click();
    await card(page).getByRole("button", { name: /Next task|Siguiente tarea/ }).click();
    for (let i = 0; i < 3 && !(await page.locator('[data-showme="shift-note-box"]').isVisible()); i++) {
      await card(page).locator(".job-card-primary").first().click();
      await page.locator('[data-showme="shift-note-box"]').waitFor({ timeout: 4_000 }).catch(() => {});
    }
    await page.locator('[data-showme="shift-note-box"]').fill(t("It got busy at 11am.", "Se puso ocupado a las 11."));
    await page.locator('[data-showme="shift-note-submit"]').click();

    // Just finished: the stop card, Stop for today first.
    const stop = modal(page).getByRole("button", { name: DESKTOP_COPY[lang].clockOut });
    await expect(stop).toBeVisible({ timeout: 20_000 });
    await expect(modal(page)).toContainText(t("Next time you sign in", "La próxima vez que entres"));
    await expect(modal(page).locator("[data-welcome-back]")).toHaveCount(0);

    // Stop for today signs out. Sign back in with the PIN.
    await stop.click();
    await page.waitForURL(/\/login/, { timeout: 20_000 });
    await waitForInteractive(page);
    await page.getByRole("button", { name }).first().click();
    await page.locator('input[placeholder="••••"]').first().click();
    await page.keyboard.type("1234");
    await page.keyboard.press("Enter");

    // Back: a welcome, one button to carry on, focused, and no way to sign out by accident.
    const back = modal(page).locator("[data-welcome-back]");
    await expect(back).toBeVisible({ timeout: 20_000 });
    await expect(back).toBeFocused();
    await expect(modal(page)).toContainText(DESKTOP_COPY[lang].welcomeBackKicker);
    await expect(modal(page)).toContainText(DESKTOP_COPY[lang].welcomeBackBody);
    await expect(modal(page)).not.toContainText(t("Next time you sign in", "La próxima vez que entres"));
    await expect(modal(page).getByRole("button", { name: DESKTOP_COPY[lang].clockOut })).toHaveCount(0);

    // A reload keeps it a welcome back, and Enter carries on into Day 4.
    await page.reload();
    await waitForInteractive(page);
    await expect(modal(page).locator("[data-welcome-back]")).toBeFocused({ timeout: 20_000 });
    await page.keyboard.press("Enter");
    await expect(modal(page)).toHaveCount(0);
    await expect(card(page)).toContainText(t("Day 4", "Día 4"));
  });
}
