import { test, expect } from "@playwright/test";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";

/**
 * Wave 4, everyday recovery. On Day 7 the practice Wi-Fi is off when the
 * learner opens the handbook. Reload alone does nothing; turning Wi-Fi back
 * on in Quick Settings and then reloading loads the page. Both survive a
 * browser reload.
 */
test("Day 7: no internet, turn on Wi-Fi, reload, handbook loads", async ({ page }) => {
  test.slow();
  await page.goto("/login");
  await waitForInteractive(page);
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Offline ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();

  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /When Something Happens/ }).click());
  await page.getByTestId("act-intro-continue").click();
  await continuePastStudioArrivalIfPresent(page);
  const card = page.locator("[data-job-card]");

  // Day 7's first job, unchanged: the incident report.
  await card.getByRole("button", { name: /Open Forms/ }).click();
  await page.getByPlaceholder("Write what happened, in order…").fill("The customer is OK. I cleaned the floor and told Renata.");
  await page.getByRole("button", { name: "Submit report" }).click();
  await card.getByRole("button", { name: /^Next task$/ }).click();

  // The Wi-Fi dropped: the handbook shows Chrome's offline page.
  await card.getByRole("button", { name: /Open Docs/ }).click();
  await expect(page.getByTestId("offline-page")).toBeVisible();
  await expect(card).toContainText("Check the Wi-Fi");
  await expect(page.getByTitle("Wi-Fi off")).toBeVisible();

  // Reload first: still offline, with a correction, nothing reset.
  await page.getByTestId("offline-reload").click();
  await expect(card).toContainText("Still no internet");
  await expect(page.getByTestId("offline-page")).toBeVisible();

  // Turn the Wi-Fi back on from Quick Settings.
  await page.getByRole("button", { name: "Me", exact: true }).click();
  const wifi = page.getByTestId("quick-wifi");
  await expect(wifi).toHaveAttribute("aria-checked", "false");
  await wifi.click();
  await expect(wifi).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");

  // A real reload keeps the Wi-Fi on and the page still waiting for Reload.
  await page.reload();
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  await card.getByRole("button", { name: /Open Docs/ }).click();
  await expect(page.getByTestId("offline-page")).toBeVisible();
  await expect(page.getByTitle("Wi-Fi connected")).toBeVisible();

  // The toolbar's Reload works like the page's own button.
  await page.getByRole("button", { name: "Reload", exact: true }).first().click();
  await expect(page.getByTestId("offline-page")).toHaveCount(0);
  await expect(page.getByText("Employee Handbook").first()).toBeVisible();
});
