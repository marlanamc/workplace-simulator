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

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  // Playwright's 5s default assumes the assertion is about the page. Much of
  // this suite waits on a server round-trip instead — a route saved before the
  // next screen renders, or `expect.poll` reading the database back. Those are
  // comfortably under a second locally and occasionally several times that on
  // a loaded CI runner, which showed up as act-intro and course-route flakes.
  expect: { timeout: 20_000 },
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/login",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
