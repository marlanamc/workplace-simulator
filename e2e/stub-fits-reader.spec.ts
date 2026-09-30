import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 N-9: at 911x512 the PDF Reader's window sits beside the docked Job
 * Card, and its Downloads list took 260px of it. The pay stub opened wider
 * than the room left, cut off on the right: the amounts and Net pay were off
 * screen with nothing to say there was more. A narrow Reader now puts the
 * Downloads above the page and opens the page at the width it has, so
 * nothing is cut at the side (reading down is ordinary scrolling). A wide
 * Reader is unchanged: Downloads beside the page, at 100%.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Stub ${lang} ${Date.now() % 1_000_000}`);
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

async function openStub(page: Page) {
  await openTodaysJob(page);
  const pane = page.locator("[data-pdf-pane]");
  for (let press = 0; press < 3 && !(await pane.isVisible()); press++) {
    // The stub from the list, or, once the questions are up, from the link under them.
    await page.locator('[data-showme="target-stub"]').or(page.getByRole("button", { name: /^(Look at the pay stub again|Ver el recibo otra vez)$/ })).first().click();
    await pane.waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(pane).toBeVisible();
  await page.waitForTimeout(300);
}

/** The reader's page pane, and how the stub sits in it across. */
async function layout(page: Page) {
  return page.evaluate(() => {
    const pane = document.querySelector<HTMLElement>("[data-pdf-pane]")!;
    const p = pane.getBoundingClientRect();
    const net = pane.querySelector('[data-showme="stub-net-pay"]')!.getBoundingClientRect();
    const list = document.querySelector<HTMLElement>("[data-pdf-downloads]")!.getBoundingClientRect();
    return {
      sideways: pane.scrollWidth - pane.clientWidth,
      netInside: net.left >= p.left - 1 && net.right <= p.right + 1,
      listBeside: list.right <= p.left + 1,
      listAbove: list.bottom <= p.top + 1,
      zoom: document.querySelector("[data-pdf-zoom]")?.textContent ?? "",
    };
  });
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });
    const narrow = size.width < 1000;

    test(`Day 6: the pay stub is not cut off at the side (${lang}, ${size.width})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      await page.goto("/studio");
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 6: / }).click());
      await page.goto("/");
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);

      const check = async () => {
        const l = await layout(page);
        expect(l.sideways).toBeLessThanOrEqual(1);
        expect(l.netInside).toBe(true);
        if (narrow) {
          expect(l.listAbove).toBe(true);
        } else {
          expect(l.listBeside).toBe(true);
          expect(l.zoom).toBe("100%");
        }
        // Both files can still be opened from the list.
        await expect(appWindow(page).getByRole("button", { name: /food-handler-certificate\.pdf/ })).toBeVisible();
        await expect(appWindow(page).getByRole("button", { name: /paystub-/ })).toBeVisible();
      };

      await openStub(page);
      await check();
      await page.screenshot({ path: test.info().outputPath(`stub-${lang}-${size.width}.png`) });

      // Zoom still works from the fitted size.
      const before = (await layout(page)).zoom;
      await page.getByRole("button", { name: /^(Zoom in|Acercar)$/ }).click();
      await expect(page.locator("[data-pdf-zoom]")).not.toHaveText(before);

      // A reload opens the same way.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openStub(page);
      await check();
    });
  });
}
