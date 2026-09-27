import { test, expect } from "@playwright/test";
import { waitForInteractive } from "./interactive";

/**
 * Story Mode Audit #16: Studio's time machine wipes the account's progress,
 * and any signed-in learner could open it. A learner in a real class is now
 * sent back to the desktop. (Teachers and STUDIO_CLASS_CODES get in; the rest
 * of the suite relies on the TEST-E2E default.)
 */
test("a learner in a real class cannot open Studio", async ({ page }) => {
  await page.goto("/login");
  await waitForInteractive(page);
  // Sign-in is open, so the staff "work in progress" note is not shown.
  await expect(page.getByTestId("login-wip-notice")).toHaveCount(0);

  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Class ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill(`CLASS-${Date.now().toString().slice(-6)}`);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await expect(page.getByTestId("simulator-welcome")).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Studio" })).toHaveCount(0);
});
