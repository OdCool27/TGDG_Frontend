import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './test',
  timeout: 240000,
  expect: { timeout: 15000 },
  workers: 1,
  use: { browserName: 'chromium', channel: 'chrome', headless: true },
  reporter: 'list',
});
