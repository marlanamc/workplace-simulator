import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Wave 5 F-1: in Spanish, Maria's text refused "Sí, el jueves" and told the
 * learner to start with "Sí". And "yes, Friday 10 AM" passed, although Maria
 * moved them to Thursday. The check now reads with the shared reader.
 */

const card = (page: Page) => page.locator("[data-job-card]");

async function toMariasText(page: Page, lang: "en" | "es") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Text ${lang} ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 2: / }).click());
  await continuePastStudioArrivalIfPresent(page);
  if (!(await page.locator("[data-app-window]").isVisible())) await card(page).locator(".job-card-primary").first().click();
  await page.locator('[data-showme="swap-button"]').first().click();
  await page.getByRole("combobox").nth(1).selectOption("thu-late");
  await page.locator('[data-showme="submit-button"]').click();
  await expect(page.getByTestId("text-thread")).toBeVisible();
}

async function send(page: Page, text: string) {
  await page.getByTestId("text-reply").fill(text);
  await page.getByTestId("text-send").click();
}

test("Spanish: an accented Sí with the day finishes the text", async ({ page }) => {
  await toMariasText(page, "es");
  // A different day is corrected with the right day, not "start with Sí".
  await send(page, "Sí, el viernes");
  await expect(card(page)).toContainText("Maria te pasó al jueves");
  await expect(card(page)).not.toContainText("Empieza con Sí");
  await send(page, "Sí, el jueves");
  await expect(page.getByTestId("text-thread")).toContainText("Sí, el jueves");
  await expect(card(page)).toHaveAttribute("data-card-tone", "green", { timeout: 20_000 });
});

test("English: the wrong day does not pass, a misspelled Thursday does", async ({ page }) => {
  await toMariasText(page, "en");
  await send(page, "yes, Friday 10 AM");
  await expect(card(page)).toContainText("Maria moved you to Thursday");
  await send(page, "ok but i no can thursday");
  await expect(card(page)).toContainText("Tell her it works");
  await send(page, "yes thurday");
  await expect(card(page)).toHaveAttribute("data-card-tone", "green", { timeout: 20_000 });
});
