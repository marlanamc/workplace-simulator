import { test, expect, type Browser, type Page } from "@playwright/test";
import { waitForInteractive } from "./interactive";

/**
 * Wave 5 F-20: the language was kept on the device only. A Spanish learner
 * who signed in on another Chromebook landed in English. It now lives on
 * the learner's account, so it follows them.
 */

const PIN = "1234";
const CODE = "TEST-E2E";
const card = (page: Page) => page.locator("[data-job-card]");

/** A fresh browser: nothing on this "Chromebook" yet. */
async function freshChromebook(browser: Browser) {
  const context = await browser.newContext({ viewport: { width: 911, height: 512 } });
  return { context, page: await context.newPage() };
}

async function signUp(page: Page, name: string, spanish: boolean) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (spanish) await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type(PIN);
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

/** "Add user" on a Chromebook that has never seen this learner, with its login page left in English. */
async function signInElsewhere(page: Page, name: string) {
  await page.goto("/login");
  await waitForInteractive(page);
  await expect(page.getByRole("button", { name: "Add user" })).toBeVisible();
  await page.getByRole("button", { name: "Add user" }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type(PIN);
  await page.getByRole("button", { name: /^Add$/ }).click();
  // A device that has never seen this learner shows the welcome first.
  const welcome = page.getByTestId("welcome-continue");
  await expect(welcome.or(card(page)).first()).toBeVisible({ timeout: 20_000 });
  if (await welcome.isVisible()) await welcome.click();
  await expect(card(page)).toBeVisible();
}

test("a Spanish learner is in Spanish on another Chromebook, and a switch follows them too", async ({ browser }) => {
  test.slow();
  const name = `E2e Lang ${Date.now() % 1_000_000}`;

  const first = await freshChromebook(browser);
  await signUp(first.page, name, true);
  await expect(card(first.page)).toContainText(/Bienvenida|Hola|Empezar/);

  // Another Chromebook: English login page, no saved language on the device.
  const second = await freshChromebook(browser);
  await signInElsewhere(second.page, name);
  await expect(card(second.page)).toContainText(/Bienvenida|Hola|Empezar/);
  await expect(second.page.locator("html")).toHaveAttribute("lang", "es");
  // A reload keeps it.
  await second.page.reload();
  await waitForInteractive(second.page);
  await expect(second.page.locator("html")).toHaveAttribute("lang", "es");

  // They switch to English here; a third Chromebook opens in English.
  await second.page.getByTitle(/Switch to English|Cambiar a inglés/).first().click();
  await expect(second.page.locator("html")).toHaveAttribute("lang", "en");
  await second.page.waitForTimeout(1_500); // the save to the account is fire-and-forget
  const third = await freshChromebook(browser);
  await signInElsewhere(third.page, name);
  await expect(third.page.locator("html")).toHaveAttribute("lang", "en");

  for (const c of [first, second, third]) await c.context.close();
});
