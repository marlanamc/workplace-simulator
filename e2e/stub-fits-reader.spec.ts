import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 N-9: at 911x512 the app window sits beside the docked Job Card,
 * and the pay stub opened wider than the room left, cut off at the side: the
 * amounts and Net pay were off screen with nothing to say there was more.
 * Day 6 now reads the stub inline in the Browser task, beside the questions
 * (above them when narrow). Its pane opens the page at the width it has
 * (fit to width, never below 60%), re-measured when the view changes, and
 * centers it with `justify-center-safe`, so nothing is cut at either side
 * (reading down is ordinary scrolling).
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

/** The scroll pane around the stub's page: the overflow ancestor of the real Net pay figure. */
const PANE_JS = `(() => {
  const net = [...document.querySelectorAll('[data-showme="stub-net-pay"]')].find((e) => !e.classList.contains("sr-only"));
  let el = net && net.parentElement;
  while (el && !/(auto|scroll)/.test(getComputedStyle(el).overflowX)) el = el.parentElement;
  return el && net ? { pane: el, net } : null;
})()`;

async function openStub(page: Page) {
  await openTodaysJob(page);
  const zoomIn = page.getByRole("button", { name: /^(Zoom in|Acercar)$/ });
  // The stub from the list; after a reload the question view (and the stub) is already up.
  if (!(await zoomIn.isVisible())) await page.locator('[data-showme="target-stub"]').click();
  await expect(zoomIn).toBeVisible();
  await expect.poll(() => page.evaluate((js) => eval(js) !== null, PANE_JS)).toBe(true);
  await page.waitForTimeout(300);
}

/** The stub's pane, and how the page sits in it across. */
async function layout(page: Page) {
  return page.evaluate((js) => {
    const { pane, net } = eval(js) as { pane: HTMLElement; net: HTMLElement };
    const p = pane.getBoundingClientRect();
    const n = net.getBoundingClientRect();
    // The page itself: PdfSheet's outer box, sized to the scaled sheet.
    let sheet: HTMLElement = net;
    while (sheet.parentElement && sheet.parentElement.parentElement !== pane) sheet = sheet.parentElement;
    const s = sheet.getBoundingClientRect();
    const zoom = [...pane.parentElement!.querySelectorAll("span")].map((e) => e.textContent ?? "").find((t) => /^\d+%$/.test(t)) ?? "";
    return {
      clientWidth: pane.clientWidth,
      scrollWidth: pane.scrollWidth,
      sideways: pane.scrollWidth - pane.clientWidth,
      scrollLeft: pane.scrollLeft,
      netInside: n.left >= p.left - 1 && n.right <= p.right + 1,
      sheetInside: s.left >= p.left - 1 && s.right <= p.right + 1,
      sheet: { x: Math.round(s.x), width: Math.round(s.width) },
      paneBox: { x: Math.round(p.x), width: Math.round(p.width) },
      zoom,
    };
  }, PANE_JS);
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });

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
        const why = JSON.stringify(l);
        // Not cut off: no sideways scroll, and the whole page (Net pay included) inside the pane.
        expect(l.sideways, why).toBeLessThanOrEqual(1);
        expect(l.sheetInside, why).toBe(true);
        expect(l.netInside, why).toBe(true);
        // Opened fitted to the pane: at most 100%, never below the readable 60%.
        const zoom = parseInt(l.zoom, 10);
        expect(zoom, why).toBeLessThanOrEqual(100);
        expect(zoom, why).toBeGreaterThanOrEqual(60);
      };

      await openStub(page);
      await check();
      await page.screenshot({ path: test.info().outputPath(`stub-${lang}-${size.width}.png`) });

      // Zoom still works from the fitted size.
      const before = (await layout(page)).zoom;
      await page.getByRole("button", { name: /^(Zoom in|Acercar)$/ }).click();
      await expect.poll(async () => (await layout(page)).zoom).not.toBe(before);

      // A reload opens the same way.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openStub(page);
      await check();
    });
  });
}
