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
    test(`calendar proposal stays pending and can be corrected ${lang} ${mode}`, async ({ page }) => {
      await page.goto(`/lessons/calendar?lang=${lang}&mode=${mode}&preview=1`);
      await waitForInteractive(page);
      await page.getByTestId("lesson-intro-start").click();
      const p=page.getByTestId('confidence-practice'); const es=lang==='es';
      const propose=p.getByRole('button',{name:es?'Proponer otra hora':'Propose a new time',exact:true});
      await propose.click();
      const date=p.getByLabel(es?'Fecha':'Date',{exact:true});
      const start=p.getByLabel(es?'Hora de inicio':'Start time');
      const end=p.getByLabel(es?'Hora de fin':'End time');
      const send=p.getByRole('button',{name:es?'Enviar propuesta':'Send proposal',exact:true});
      await date.fill('2026-09-02');await start.fill('10:00');await end.fill('10:30');await send.click();
      await expect(p.getByTestId('practice-result')).toContainText(es?'pendiente':'awaiting');
      const check=page.locator('[data-job-card]').getByRole('button',{name:es?'Revisar mi trabajo':'Check my work',exact:true});
      await check.click();await expect(page.getByTestId('lesson-back')).toHaveCount(0);
      await propose.click();await expect(start).toHaveValue('10:00');await date.fill('2026-09-03');await send.click();await check.click();
      await expect(page.getByTestId('lesson-back')).toBeVisible();
      await page.getByTestId('lesson-practice-again').click();await propose.click();
      await expect(date).toHaveValue('');await expect(start).toHaveValue('');await expect(end).toHaveValue('');
    });
  }
}
