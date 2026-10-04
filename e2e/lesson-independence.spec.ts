import { test, expect } from "@playwright/test";
import { waitForInteractive } from "./interactive";

for (const lang of ["en", "es"]) for (const scenario of ["classroom", "try", "home"]) {
  test(`${lang} ${scenario}: email must be entered and corrected without losing password`, async ({ page }, testInfo) => {
    const es = lang === "es";
    await page.goto(`/lessons/account-recovery?preview=1&lang=${lang}&scenario=${scenario}`);
    await waitForInteractive(page);
    await page.getByTestId("lesson-intro-start").click();
    if (scenario !== "classroom") await page.getByTestId("confidence-practice").getByRole("button", { name: es ? "Iniciar sesión" : "Sign in", exact: true }).click();
    const email = scenario === "classroom" ? page.getByTestId("practice-email") : page.getByLabel(es ? "Correo" : "Email", { exact: true });
    const password = scenario === "classroom" ? page.locator('[data-showme="password-field"]') : page.getByLabel(es ? "Contraseña de práctica" : "Practice password");
    const value = scenario === "classroom" ? "Harbor2026" : scenario === "try" ? "Class!26" : "Books!26";
    const address = scenario === "classroom" ? "you@harborsidecafe.com" : scenario === "try" ? "student@class.example.test" : "reader@library.example.test";
    const next = scenario === "classroom" ? page.getByTestId("practice-sign-in") : page.getByRole("button", { name: scenario === "classroom" ? (es ? "Iniciar sesión" : "Sign in") : (es ? "Siguiente" : "Next"), exact: true });
    await expect(email).toHaveValue("");
    await expect(password).toHaveValue("");
    await password.fill(value);
    await next.click();
    await expect(page.locator("[data-job-card]")).toContainText(es ? "Compara el correo" : "Check the email");
    await email.fill("wrong@example.test");
    await next.click();
    await expect(email).toHaveValue("wrong@example.test");
    await expect(password).toHaveValue(value);
    await email.fill(` ${address.toUpperCase()} `);
    await next.click();
    const code = scenario === "classroom" ? page.locator('[data-showme="code-field"]') : page.getByLabel(es ? "Código de verificación" : "Verification code");
    await expect(code).toBeVisible();
    if (scenario === "classroom") {
      await page.getByTestId("phone-texts").getByRole("button", { name: /Google Alert|Alerta de Google/ }).click();
      await expect(page.locator("[data-job-card]")).not.toContainText(es ? "Ese mensaje es falso" : "That text is fake");
      await code.fill("915482");
      await page.getByRole("button", { name: es ? "Verificar" : "Verify", exact: true }).click();
      await expect(code).toHaveValue("915482");
      await expect(page.locator("[data-job-card]")).toContainText(es ? "Ese código es del mensaje falso" : "That code is from the fake text");
      await code.fill("482915");
      await page.getByRole("button", { name: es ? "Verificar" : "Verify", exact: true }).click();
      await page.getByTestId("lesson-practice-again").click();
      await expect(email).toHaveValue("");
      await expect(password).toHaveValue("");
      await expect(next).toBeInViewport({ ratio: 1 });
      await page.screenshot({ path: testInfo.outputPath("blank-sign-in.png"), fullPage: true });
    }
  });
}
