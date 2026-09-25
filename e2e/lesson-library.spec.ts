import { test, expect } from "@playwright/test";

for (const lang of ["en", "es"] as const) {
  test(`${lang}: search, preview and completion preserve library context`, async ({ page }) => {
    await page.goto(`/lessons?teacher=1${lang === "es" ? "&lang=es" : ""}`);
    // Home is topics, not lessons.
    await expect(page.getByRole("heading", { name: lang === "es" ? "O elige un tema" : "Or choose a topic", exact: true })).toBeVisible();
    await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(0);
    await page.getByTestId("skill-filter-forms").click();
    await expect(page.getByRole("heading", { level: 1, name: lang === "es" ? "Formularios" : "Forms" })).toBeVisible();
    // Search inside the topic keeps the topic.
    await page.getByLabel(lang === "es" ? "Buscar lecciones" : "Search lessons").fill("W-4");
    await page.getByRole("button", { name: lang === "es" ? "Buscar" : "Search", exact: true }).click();
    await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(1);
    expect(new URL(page.url()).searchParams.get("skill")).toBe("forms");
    const card = page.getByTestId("lesson-card-w4-form");
    await card.getByRole("link", { name: /Teacher preview|Vista del docente/ }).click();
    await page.getByTestId("lesson-intro-start").click();
    await expect(page.getByTestId("teacher-preview")).toBeVisible();
    expect(new URL(page.url()).searchParams.get("returnTo")).toContain("q=W-4");
    await page.goBack();
    await expect(card).toBeVisible();
    await card.getByRole("link", { name: /^(Start|Empezar)/ }).click();
    await page.getByTestId("lesson-intro-start").click();
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
    expect(returned.searchParams.get("teacher")).toBe("1");
    expect(returned.searchParams.get("lang")).toBe(lang === "en" ? "es" : null);
    // The finished lesson now shows as done.
    await expect(page.getByTestId("lesson-card-w4-form")).toContainText(lang === "en" ? "Hecha" : "Done");
    await expect(page.getByTestId("lesson-card-w4-form").getByRole("link", { name: /^(Otra vez|Do again)/ })).toBeVisible();
  });
}

test("students see no teacher links unless a teacher asks for them", async ({ page }) => {
  await page.goto("/lessons?skill=forms");
  await expect(page.getByTestId("lesson-card-w4-form")).toBeVisible();
  await expect(page.getByRole("link", { name: /Teacher preview/ })).toHaveCount(0);
  await page.getByRole("link", { name: "For teachers", exact: true }).click();
  await expect(page.getByTestId("lesson-card-w4-form").getByRole("link", { name: /Teacher preview/ })).toBeVisible();
});

test("no results, language switching, clearing and keyboard search", async ({ page }) => {
  await page.goto("/lessons?skill=forms&q=zzzz");
  await expect(page.getByText("No lessons match.", { exact: false })).toBeVisible();
  await page.getByRole("link", { name: "Español", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("q")).toBe("zzzz");
  await page.getByRole("link", { name: "Ver todos los temas", exact: true }).click();
  await expect(page.getByTestId("skill-filter-forms")).toBeVisible();
  await page.getByLabel("Buscar lecciones").fill("CODIGO");
  await page.getByLabel("Buscar lecciones").press("Enter");
  await expect(page.getByTestId("lesson-card-account-recovery")).toBeVisible();
  await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(1);
  await page.getByRole("link", { name: "Todos los temas" }).click();
  await expect(page).toHaveURL(/\/lessons\?lang=es$/);
});

test("quick searches open results", async ({ page }) => {
  await page.goto("/lessons");
  await page.getByRole("link", { name: "W-4", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "1 lesson for “W-4”" })).toBeVisible();
  await expect(page.getByTestId("lesson-card-w4-form")).toBeVisible();
});

for (const width of [390, 640, 1366]) {
  for (const path of ["/lessons?lang=es", "/lessons?lang=es&skill=spreadsheets", "/lessons?lang=es&q=correo"]) {
    test(`library fits width ${width}: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 768 });
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.getByLabel("Buscar lecciones")).toBeVisible();
    });
  }
}

test("search and topic links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/lessons?lang=es");
  await page.getByTestId("skill-filter-forms").click();
  await page.getByLabel("Buscar lecciones").fill("W-4");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page.locator('[data-testid^="lesson-card-"]')).toHaveCount(1);
  expect(new URL(page.url()).searchParams.get("skill")).toBe("forms");
  await context.close();
});

test("the sign-in screen links to lessons in the chosen language", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Español", exact: true }).click();
  await page.getByRole("link", { name: "Practicar una lección, sin iniciar sesión" }).click();
  await expect(page).toHaveURL(/\/lessons\?lang=es$/);
  await expect(page.getByRole("heading", { name: "O elige un tema", exact: true })).toBeVisible();
});
