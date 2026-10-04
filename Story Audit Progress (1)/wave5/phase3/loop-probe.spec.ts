import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Where does "Maximum update depth exceeded" come from? Plays to the Night
// Before reply, types, opens Help, and records each console error in full.
test("render loop probe", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  const out: string[] = [];
  let at = "start";
  page.on("console", async (m) => {
    if (m.type() !== "error") return;
    const args = await Promise.all(m.args().map((a) => a.jsonValue().catch(() => "?")));
    out.push(`[${at}] ${args.map(String).join(" | ").slice(0, 4000)}`);
  });
  await page.addInitScript(() => {
    const orig = console.error;
    console.error = (...a: unknown[]) => {
      if (String(a[0]).includes("Maximum update depth")) orig("STACK " + String(new Error().stack));
      orig(...a);
    };
  });
  const card = page.locator("[data-job-card]");
  await page.goto("/login");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await page.getByRole("button", { name: /Add user/ }).click();
  await page.getByPlaceholder("Jordan").fill(`Loop ${Date.now() % 100000}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^Add$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await card.getByRole("button", { name: "Start looking around" }).click();
  await card.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByTestId("bookmark-mail").click();
  await card.getByRole("button", { name: "I understand" }).click();
  await card.getByTestId("job-card-help").click();
  await card.getByRole("button", { name: /Back to my task/ }).click();
  await card.getByRole("button", { name: "I'm ready for the task" }).click();
  await page.locator("[data-celebration-continue]").click();
  at = "task list intro";
  await card.getByRole("button", { name: "I understand" }).click();
  at = "inbox";
  await page.locator('[data-showme="maria-row"]').click();
  at = "email open";
  await page.locator('[data-showme="reply-button"]').click();
  at = "compose open";
  await page.waitForTimeout(1500);
  at = "typing";
  await page.getByRole("textbox", { name: /Your reply/ }).click();
  await page.keyboard.type("Hi Maria, thank you.", { delay: 20 });
  await page.waitForTimeout(1500);
  at = "help";
  await card.getByTestId("job-card-help").click();
  await page.waitForTimeout(1500);
  fs.writeFileSync(path.join(__dirname, "loop-probe.txt"), out.join("\n\n"));
});
