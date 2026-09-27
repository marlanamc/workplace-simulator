import { test, expect } from "@playwright/test";
import { MATERIAL_TASKS } from "../src/lib/lessons/materials-links";

for (const lang of ["en", "es"] as const) {
  test(`teacher materials discovery, language, and print isolation (${lang})`, async ({ page }) => {
    await page.goto(`/lessons?skill=email&teacher=1&lang=${lang}`);
    const row = page.getByTestId("lesson-card-mail-attach");
    await row.getByRole("link", { name: lang === "en" ? "Workplace materials" : "Materiales del trabajo", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/lessons/mail-attach/materials\\?lang=${lang}`));
    await expect(page.locator("main")).toHaveAttribute("lang", lang);
    await expect(page.getByTestId("practice-documents").locator("article")).toHaveCount(2);
    await expect(page.getByTestId("practice-teacher-notes")).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await expect(page.getByTestId("practice-teacher-notes")).toBeHidden();
    await expect(page.getByRole("navigation")).toBeHidden();
    await expect(page.getByTestId("practice-documents")).toBeVisible();
    await page.emulateMedia({ media: "screen" });
    await page.getByRole("link", { name: lang === "en" ? "Español" : "English", exact: true }).click();
    await expect(page.locator("main")).toHaveAttribute("lang", lang === "en" ? "es" : "en");
  });
}

test("every packet fits a phone and unsupported packets return 404", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const key of MATERIAL_TASKS) {
    await page.goto(`/lessons/${key}/materials?lang=es`);
    await expect(page.getByTestId("practice-documents")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  const response = await page.goto("/lessons/account-recovery/materials");
  expect(response?.status()).toBe(404);
});

test("preview guide links to materials without exposing links in student library", async ({ page }) => {
  await page.goto("/lessons/mail-reply?preview=1");
  await page.getByTestId("lesson-intro-start").click();
  await page.getByTestId("teacher-preview").getByRole("button", { name: "Teacher guide", exact: true }).click();
  await expect(page.getByRole("link", { name: "Workplace materials", exact: true })).toHaveAttribute("href", "/lessons/mail-reply/materials?lang=en");
  await page.goto("/lessons?skill=email");
  await expect(page.getByRole("link", { name: "Workplace materials", exact: true })).toHaveCount(0);
});
