import { test, expect } from "@playwright/test";
import { waitForInteractive } from "./interactive";

for (const lang of ["en", "es"] as const) {
  for (const viewport of [{ width: 683, height: 384 }, { width: 911, height: 512 }, { width: 390, height: 812 }]) {
    test(`lesson work area stays separate from instructions ${lang} ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/lessons/account-recovery?lang=${lang}&preview=1`);
      await waitForInteractive(page);
      await page.getByTestId("lesson-intro-start").click();
      const card = page.locator("[data-job-card]");
      const app = page.locator('[data-app-window="active"]');
      const overlap = async () => {
        const a = await app.boundingBox();
        const b = await card.boundingBox();
        expect(a).not.toBeNull();
        expect(b).not.toBeNull();
        return a!.x < b!.x + b!.width && b!.x < a!.x + a!.width && a!.y < b!.y + b!.height && b!.y < a!.y + a!.height;
      };
      await expect(card).toBeVisible();
      expect(await overlap()).toBe(false);
      // Show me scrolls inside the app without putting the target under the card.
      await card.getByRole("button", { name: lang === "en" ? "Show me" : "Muéstrame", exact: true }).click();
      await expect(page.locator('[data-showme="password-field"]')).toBeInViewport();
      expect(await overlap()).toBe(false);
      await page.getByTestId("practice-email").fill("you@harborsidecafe.com");
      await page.locator('[data-showme="password-field"]').fill("Harbor2026");
      await page.locator('[data-showme="password-field"]').press("Enter");
      await expect(page.locator('[data-showme="code-field"]')).toBeVisible();
      expect(await overlap()).toBe(false);
      await page.getByTestId("phone-texts").getByRole("button", { name: /^Google/ }).click();
      const code = page.locator('[data-showme="code-field"]');
      await code.fill("482915");
      if (viewport.width < 800) {
        await expect(page.getByTestId("selected-phone-message")).toBeInViewport();
        await expect(code).toBeInViewport({ ratio: 1 });
        const source = await page.getByTestId("selected-phone-message").boundingBox();
        const field = await code.boundingBox();
        expect(source!.x + source!.width).toBeLessThanOrEqual(field!.x);
        expect(await code.evaluate(el => {
          const r = el.getBoundingClientRect();
          return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === el;
        })).toBe(true);
      }
      await page.screenshot({ path: `output/playwright/esol-audit-fixes/recovery-${lang}-${viewport.width}.png` });
    });
  }
  for (const mode of ["guided", "independent"]) {
    test(`calendar requires a first attempt and retains the sent reply ${lang} ${mode}`, async ({ page }) => {
      await page.goto(`/lessons/calendar?lang=${lang}&mode=${mode}&preview=1`);
      await waitForInteractive(page);
      await page.getByTestId("lesson-intro-start").click();
      await page.locator('[data-showme="huddle-event"]').click();
      await page.locator('[data-showme="propose-link"]').click();
      const reply = page.locator('[data-showme="reply-box"]');
      const chip = page.getByRole("button", { name: lang === "en" ? "Thu 10:00 AM" : "Jue 10:00 AM", exact: true });
      await expect(chip).toHaveCount(0);
      const send = page.getByRole("button", { name: lang === "en" ? "Send" : "Enviar", exact: true });
      await reply.fill(lang === "en" ? "Yes, see you Wednesday" : "Sí, nos vemos el miércoles");
      await send.click();
      await expect(page.getByTestId("lesson-back")).toHaveCount(0);
      await expect(chip).toBeVisible();
      const text = lang === "en" ? "Thursday at 10 AM" : "el jueves a las 10 AM";
      await reply.fill(text);
      await send.click();
      await expect(page.getByTestId("sent-recap")).toContainText(text);
      await expect(page.getByTestId("lesson-back")).toBeVisible();
      await page.getByTestId("lesson-practice-again").click();
      await page.locator('[data-showme="huddle-event"]').click();
      await page.locator('[data-showme="propose-link"]').click();
      await expect(reply).toHaveValue("");
      await expect(chip).toHaveCount(0);
    });
  }
}
