import { expect, type Page } from "@playwright/test";

/**
 * Waits until React has taken over the page.
 *
 * Playwright's actionability checks answer "is this button on screen, stable
 * and clickable?" — which a server-rendered button is long before its handler
 * exists. Clicking in that window does nothing at all, and because the click
 * itself "succeeds", the failure surfaces much later as a screen that never
 * arrives. Call this after every load a click follows.
 *
 * `MarkHydrated` in the root layout sets the flag from an effect, so it lands
 * on the exact commit that attaches the handlers. Cheap to over-use: once the
 * document is live this resolves immediately, and a client-side navigation
 * keeps the flag (the app is already listening).
 */
export async function waitForInteractive(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true", { timeout: 30_000 });
}

/**
 * The same wait, for a click that loads a whole new document — a Studio jump,
 * which navigates with `window.location.assign` on purpose (see
 * `jump-to-preset.ts`). The click returns before the new document commits, so
 * a plain wait would be answered by the page we are leaving: already
 * interactive, and no news about the one we are going to. Dropping the flag
 * first means only the new page's own hydration can satisfy it.
 *
 * Not for a click that stays in the app (signing in, opening a task): those
 * re-render client-side, the flag stays up because the app really is still
 * listening, and clearing it would wait for a hydration that never comes.
 */
export async function clickIntoPage(page: Page, click: () => Promise<unknown>) {
  await page.evaluate(() => {
    delete document.documentElement.dataset.hydrated;
  });
  await click();
  await waitForInteractive(page);
}
