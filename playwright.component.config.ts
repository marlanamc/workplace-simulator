import { defineConfig, devices } from '@playwright/test';

// Browser component regressions with mocked account context; no app server or DB.
export default defineConfig({
  testDir: './e2e',
  testMatch: 'enrollment-draft.spec.ts',
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure' },
});
