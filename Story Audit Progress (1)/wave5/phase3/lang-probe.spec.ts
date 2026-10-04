import { test, expect } from "@playwright/test";
import path from "node:path";

// F-20: the Spanish learner from the ES 911 replay signs in on a brand-new
// browser (no device storage), the way a shared Chromebook would.
test("fresh browser keeps the learner's Spanish", async ({ page }) => {
  await page.setViewportSize({ width: 911, height: 512 });
  const name = process.env.LANG_PROBE_NAME!;
  await page.goto("/login");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await page.screenshot({ path: path.join(__dirname, "shots/lang-probe-1-login.png") });
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(__dirname, "shots/lang-probe-2-signed-in.png") });
  const text = await page.locator("body").innerText();
  console.log("SPANISH?", /Acto II|Comenzar|Empezar|Ver qué sigue|Hola de nuevo/.test(text), text.slice(0, 300).replace(/\s+/g, " "));
});
