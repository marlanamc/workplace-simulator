import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests drive the real app in a real browser: dev server +
 * the real database (a fresh throwaway learner per run, so no cleanup
 * is needed and no real learner's progress is ever touched).
 *
 * First time: npx playwright install chromium
 * Run:        npm run test:e2e
 */
loadEnvConfig(process.cwd());

// CI runs against a production build (E2E_PROD=1, built in its own workflow
// step). Under `next dev` every page compiles on its first request, and on a
// shared runner that compile could stall a navigation past its timeout:
// a different test timed out on waitForURL each run. Locally, the dev
// server you already have running is reused.
const prod = process.env.E2E_PROD === "1";
const port = Number(process.env.E2E_PORT ?? 3000);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  // Playwright's 5s default assumes the assertion is about the page. Much of
  // this suite waits on a server round-trip instead — a route saved before the
  // next screen renders, or `expect.poll` reading the database back. Those are
  // comfortably under a second locally and occasionally several times that on
  // a loaded CI runner, which showed up as act-intro and course-route flakes.
  expect: { timeout: 20_000 },
  // One retry on CI only, for a dropped connection to the hosted test
  // database. A test that passes on retry is still reported as flaky.
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: prod ? `npx next start -p ${port}` : "npm run dev",
    url: `${baseURL}/login`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
