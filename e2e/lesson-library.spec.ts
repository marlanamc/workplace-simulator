import { test, expect } from "@playwright/test";

for (const lang of ["en", "es"] as const) {
  test(`${lang}: search, preview and completion preserve library context`, async ({ page }) => {
    await page.goto(`/lessons${lang === "es" ? "?lang=es" : ""}`);
    await expect(page.getByRole("heading", { name: lang === "es" ? "Empieza aquí" : "Start here", exact: true })).toBeVisible();
    await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(14);
    await page.getByLabel(lang === "es" ? "Buscar lecciones" : "Search lessons").fill("W-4");
    await page.getByRole("button", { name: lang === "es" ? "Buscar" : "Search", exact: true }).click();
    await page.getByTestId("skill-filter-forms").click();
    await expect(page.getByTestId("skill-filter-forms")).toHaveAttribute("aria-current", "page");
    await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { name: lang === "es" ? "Empieza aquí" : "Start here", exact: true })).toHaveCount(0);
    const card = page.getByTestId("lesson-card-w4-form");
    await card.getByRole("link", { name: /Teacher preview|Vista del docente/ }).click();
    await expect(page.getByTestId("teacher-preview")).toBeVisible();
    expect(new URL(page.url()).searchParams.get("returnTo")).toContain("q=W-4");
    await page.goBack();
    await expect(page.getByTestId("skill-filter-forms")).toHaveAttribute("aria-current", "page");
    await card.getByRole("link", { name: /^(Start|Empezar)/ }).click();
    await page.getByRole("button", { name: /Hide the rest|Ocultar el resto/ }).click();
    await page.getByRole("radio", { name: /^(Single,|Soltero\/a,)/ }).check();
    await page.getByRole("textbox", { name: /^(Number of dependents|Número de dependientes)/ }).fill("0");
    await page.getByRole("textbox", { name: /^(Signature|Firma)/ }).fill("Robin Avery");
    await page.getByRole("textbox", { name: /^(Date|Fecha)/ }).fill("10/01/2026");
    await page.getByRole("button", { name: /^(Submit W-4|Enviar W-4)$/ }).click();
    await page.getByTestId("lesson-practice-again").click();
    await expect(page.getByRole("textbox", { name: /^(Signature|Firma)/ })).toHaveValue("");
    expect(new URL(page.url()).searchParams.get("returnTo")).toContain("skill=forms");
    // Complete again, then switch language to verify the return uses live language.
    await page.getByRole("button", { name: /Hide the rest|Ocultar el resto/ }).click();
    await page.getByRole("radio", { name: /^(Single,|Soltero\/a,)/ }).check();
    await page.getByRole("textbox", { name: /^(Number of dependents|Número de dependientes)/ }).fill("0");
    await page.getByRole("textbox", { name: /^(Signature|Firma)/ }).fill("Robin Avery");
    await page.getByRole("textbox", { name: /^(Date|Fecha)/ }).fill("10/01/2026");
    await page.getByRole("button", { name: /^(Submit W-4|Enviar W-4)$/ }).click();
    await page.getByRole("button", { name: lang === "en" ? "ES" : "EN", exact: true }).click();
    await page.getByTestId("lesson-back").click();
    await expect(page).toHaveURL(/\/lessons\?/);
    const returned = new URL(page.url());
    expect(returned.pathname).toBe("/lessons");
    expect(returned.searchParams.get("skill")).toBe("forms");
    expect(returned.searchParams.get("q")).toBe("W-4");
    expect(returned.searchParams.get("lang")).toBe(lang === "en" ? "es" : null);
  });
}

test("no results, language switching, clearing and keyboard search", async ({ page }) => {
  await page.goto("/lessons?skill=forms&q=zzzz");
  await expect(page.getByText("No lessons match your search.", { exact: false })).toBeVisible();
  await page.getByRole("link", { name: "Español", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("q")).toBe("zzzz");
  await page.getByRole("link", { name: "Quitar filtros", exact: true }).click();
  await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(14);
  await page.getByLabel("Buscar lecciones").fill("CODIGO");
  await page.getByLabel("Buscar lecciones").press("Enter");
  await expect(page.getByTestId("lesson-card-account-recovery")).toBeVisible();
  await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(1);
});

for (const width of [390, 640, 1366]) {
  test(`library fits width ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 768 });
    await page.goto("/lessons?lang=es");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByLabel("Buscar lecciones")).toBeVisible();
  });
}

test("search and skill links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/lessons?lang=es&skill=forms");
  await page.getByLabel("Buscar lecciones").fill("W-4");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(1);
  expect(new URL(page.url()).searchParams.get("skill")).toBe("forms");
  await context.close();
});
