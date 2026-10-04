import { test, expect } from "@playwright/test";
import { waitForInteractive } from "./interactive";

for (const lang of ["en", "es"]) {
  test(`${lang}: pathways precede topics and preserve context through lessons`, async ({ page }, testInfo) => {
    await page.goto(`/lessons?lang=${lang}`);
    const pathways = page.getByTestId("lesson-pathways");
    await expect(pathways.getByRole("link")).toHaveCount(3);
    const section = await pathways.boundingBox();
    const topics = await page.locator("#topics-heading").boundingBox();
    expect(section!.y + section!.height).toBeLessThan(topics!.y);
    await page.screenshot({ path: testInfo.outputPath("pathways-home.png"), fullPage: true });
    await page.getByTestId("pathway-classwork").click();
    const cards = page.locator('[data-testid^="lesson-card-"]');
    await expect(cards).toHaveCount(4);
    expect(await cards.evaluateAll(nodes => nodes.map(n => n.getAttribute("data-testid")))).toEqual([
      "lesson-card-account-recovery", "lesson-card-mail-reply", "lesson-card-mail-attach", "lesson-card-coursework",
    ]);
    for (const card of await cards.all()) await expect(card.getByRole("link")).toHaveCount(1);
    await page.getByRole("link", { name: lang === "en" ? "Español" : "English", exact: true }).click();
    await expect(page).toHaveURL(/pathway=classwork/);
    const other = lang === "en" ? "es" : "en";
    await page.getByRole("link", { name: other === "es" ? "Para docentes" : "For teachers", exact: true }).click();
    await page.getByTestId("preview-student-view").click();
    await expect(page).toHaveURL(/pathway=classwork/);
    await expect(page.getByTestId("teacher-view-bar")).toHaveCount(0);
    await page.getByTestId("lesson-card-account-recovery").getByRole("link").click();
    await waitForInteractive(page);
    await page.getByTestId("lesson-intro-start").click();
    await page.getByTestId("lesson-leave").click();
    await expect(page).toHaveURL(/pathway=classwork/);
    await expect(cards).toHaveCount(4);
  });
}

for (const width of [390, 1366]) {
  test(`pathway fits ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/lessons?lang=es&pathway=job-application");
    await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("pathway.png"), fullPage: true });
  });
}

test("pathways work without JavaScript and invalid keys return to discovery", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/lessons?pathway=unknown");
  await expect(page.getByTestId("lesson-pathways")).toBeVisible();
  await page.getByTestId("pathway-work-communication").click();
  await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(3);
  await context.close();
});
