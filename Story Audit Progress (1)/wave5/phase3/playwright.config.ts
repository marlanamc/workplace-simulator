import { loadEnvConfig } from "@next/env";
import { defineConfig } from "@playwright/test";

// Phase 3 replay (not part of the e2e suite). Run from the repo root:
//   npx playwright test -c "Story Audit Progress (1)/wave5/phase3/playwright.config.ts"
loadEnvConfig(process.cwd());
const port = Number(process.env.E2E_PORT ?? 3310);

export default defineConfig({
  testDir: ".",
  timeout: 30 * 60_000,
  expect: { timeout: 20_000 },
  workers: Number(process.env.REPLAY_WORKERS ?? 2),
  reporter: "list",
  use: {
    baseURL: `http://localhost:${port}`,
    actionTimeout: 20_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
