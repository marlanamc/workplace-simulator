import { test, expect } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Story Mode Audit #3. Finishing the last day of an act and pressing "Start
 * Act …" left an empty desktop with no Job Card until a reload, and the shelf
 * still said yesterday was done. Studio jumps never showed it, because they
 * start with no celebration pending, so this *plays* Day 33 to its end.
 */
for (const lang of ["en", "es"] as const) {
  test(`the Job Card is there after playing into Act VII (${lang})`, async ({ page }) => {
    await page.goto("/login");
    await waitForInteractive(page);
    if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
    await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
    await page.getByPlaceholder("Jordan").fill(`E2e Boundary ${lang} ${Date.now()}`);
    await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
    await page.locator('input[placeholder="••••"]').first().click();
    await page.keyboard.type("1234");
    await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
    await page.getByTestId("welcome-continue").click();

    await page.goto("/studio");
    await waitForInteractive(page);
    await clickIntoPage(page, () => page.getByRole("button", { name: /Presenting to the Team/ }).click());
    await continuePastStudioArrivalIfPresent(page);

    const card = page.locator("[data-job-card]");
    await card.getByRole("button", { name: /^Open |^Abrir |^Abre / }).click();
    await page.getByTestId("bookmark-slides").click();
    await card.getByTestId("job-card-drag-handle").focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowUp");

    await page.getByPlaceholder(/Give these slides|Ponle un título/).fill("Expenses / Gastos");
    await page.getByRole("button", { name: /^Next slide$|^Siguiente$/ }).click();
    await page.getByLabel(/Total with receipts|Total con recibos/).fill("188");
    await page.getByRole("button", { name: /^Next slide$|^Siguiente$/ }).click();
    await page
      .getByPlaceholder(/One sentence|Una oración/)
      .fill(lang === "en" ? "Get the missing receipt before reporting dinner." : "Consigue el recibo que falta antes de reportar la cena.");
    await page.getByRole("button", { name: /^Present$|^Presentar$/ }).last().click();
    await page.getByRole("combobox").selectOption("receipt");
    await page.getByRole("button", { name: /Answer Chris|Responder a Chris/ }).click();

    const intro = page.getByTestId("act-intro");
    await expect(intro).toContainText("VII");
    await page.getByTestId("act-intro-continue").click();

    await expect(card).toBeVisible();
    await expect(card.getByRole("button", { name: /^Open |^Abrir |^Abre / })).toBeVisible();
    await expect(page.getByText(/This day is done|Terminaste este día/)).toHaveCount(0);
  });
}
