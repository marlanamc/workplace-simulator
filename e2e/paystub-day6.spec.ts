import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Wave 5 F-8 and F-21, Day 6 (First Paycheck).
 * - F-8: the list row does not show the net pay, and nothing states the hours.
 *   The learner counts the shifts on a time record shown under the question.
 * - F-21: the stub stays in English; the Spanish card names the English words
 *   ("Net pay", "Regular hours").
 * Run in both languages, at 911x512 (docked card) and 1366x768, with a wrong
 * answer on each question and a reload before the second.
 */

const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");
const SHOTS = process.env.DAY6_SHOTS;

async function signUp(page: Page, lang: "en" | "es") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Paystub ${lang} ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

async function openTodaysJob(page: Page) {
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

async function startOfDay6(page: Page) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 6: / }).click());
  await page.goto("/");
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  await openTodaysJob(page);
}

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  await page.waitForTimeout(500); // let the window's open animation finish
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
}

const SIZES = [
  { width: 911, height: 512 },
  { width: 1366, height: 768 },
];

for (const lang of ["en", "es"] as const) {
  for (const size of SIZES) {
    const t = (en: string, es: string) => (lang === "en" ? en : es);
    const tag = `${lang}-${size.width}`;

    test(`Day 6: the stub's answers are the learner's to find (${lang}, ${size.width}x${size.height})`, async ({ page }) => {
      test.slow();
      await page.setViewportSize(size);
      await signUp(page, lang);
      await startOfDay6(page);

      // The list: the pay date, not the net pay.
      const row = page.locator('[data-showme="target-stub"]');
      await expect(row).toBeVisible();
      await expect(row).toContainText(t("Paid", "Pagado"));
      await expect(row).toContainText(t("Aug 28", "28 ago"));
      await expect(row).not.toContainText("$");
      await expect(row).not.toContainText("$571");
      await expect(card(page)).not.toContainText("$571");
      await shot(page, `${tag}-list`);

      // Open the stub. The Spanish card names the English words on it.
      await row.click();
      await expect(page.locator('[data-showme="stub-net-pay"][data-showme-primary]')).toBeAttached();
      await expect(card(page)).toContainText(t("Find the net pay on this stub.", "pago neto (Net pay)"));
      await card(page).locator(".job-card-primary").first().click();

      // Question 1, with a wrong answer first.
      await expect(appWindow(page)).toContainText(t("What was the net pay on your stub?", "¿Cuál fue el pago neto (Net pay) en tu recibo?"));
      await expect(card(page)).not.toContainText("$571");
      await shot(page, `${tag}-q1`);
      await page.getByRole("button", { name: "$720.00", exact: true }).click();
      await expect(card(page)).toContainText(t("That's the gross pay, before taxes", "pago bruto (Gross pay)"));
      await page.getByRole("button", { name: "$571.32", exact: true }).click();

      // Question 2: a time record to count, no total, no count in the words.
      const record = page.getByTestId("time-record");
      await expect(record).toBeVisible();
      await expect(record.getByTestId("time-record-row")).toHaveCount(6);
      await expect(record).not.toContainText(/\b48\b/);
      await expect(record).toContainText(t("(fixed)", "(corregido)"));
      await expect(record).toContainText("2:00 PM – 10:00 PM");
      await expect(appWindow(page)).toContainText(t("Count the shifts on your time record.", "Cuenta los turnos de tu registro de horas."));
      await expect(appWindow(page)).not.toContainText(/\b(6|six|seis) (shifts|turnos)\b/i);
      await expect(card(page)).not.toContainText(/\b48\b|\b(6|six|seis) (shifts|turnos)\b/i);
      if (lang === "es") await expect(card(page)).toContainText("(Regular hours)");

      // Every row of the record and every choice are on screen together,
      // and nothing (the Job Card) sits on top of them. At 911x512 the
      // Portal's scroll area is ~170px tall, so at most one scroll.
      const choices = page.locator('[data-showme="paystub-choices"]');
      const rows = record.getByTestId("time-record-row");
      // One scroll: the record's heading to the top of the Portal.
      await record.evaluate((el) => el.scrollIntoView({ block: "start" }));
      const onTop = async (el: ReturnType<Page["locator"]>) => {
        await expect(el).toBeInViewport({ ratio: 0.9 });
        const box = (await el.boundingBox())!;
        const hit = await page.evaluate(
          ([x, y]) => {
            const e = document.elementFromPoint(x, y);
            return e?.closest("[data-app-window]") ? true : (e?.outerHTML ?? "nothing").slice(0, 200);
          },
          [box.x + box.width / 2, box.y + box.height / 2],
        );
        expect(hit, "what is on top").toBe(true);
      };
      await shot(page, `${tag}-q2`);
      for (const r of [rows.first(), rows.last()]) await onTop(r);
      for (const b of await choices.getByRole("button").all()) await onTop(b);

      // A wrong answer gets its own correction.
      await page.getByRole("button", { name: t("40 hours", "40 horas"), exact: true }).click();
      await expect(card(page)).toContainText(t("That is 5 shifts of 8 hours.", "Eso son 5 turnos de 8 horas."));
      await page.getByRole("button", { name: "$720.00", exact: true }).click();
      await expect(card(page)).toContainText(t("gross pay in dollars", "pago bruto (Gross pay) en dólares"));

      // A reload keeps the step and the record.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);
      await expect(appWindow(page)).toContainText(t("Which paid hours on the stub match it?", "¿Qué horas pagadas del recibo coinciden?"));
      await expect(page.getByTestId("time-record").getByTestId("time-record-row")).toHaveCount(6);

      await page.getByRole("button", { name: t("48 hours", "48 horas"), exact: true }).click();
      await expect(appWindow(page)).toContainText(t("Checked", "Revisado"));
      await expect(page.getByTestId("time-record")).toHaveCount(0);
    });
  }
}
