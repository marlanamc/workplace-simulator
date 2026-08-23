import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests drive the real app in a real browser: dev server +
 * the real database (a fresh throwaway learner per run, so no cleanup
 * is needed and no real learner's progress is ever touched).
 *
 * First time: npx playwright install chromium
 * Run:        npm run test:e2e
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
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
