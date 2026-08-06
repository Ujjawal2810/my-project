// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

/**
 * PrismStructure — Playwright config with UI and API separated via projects.
 * UI: tests/ui/  |  API: tests/api/
 * Reports: reports/html/
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(__dirname, 'reports', 'html'), open: 'never' }],
    ['json', { outputFile: path.join(__dirname, 'reports', 'results.json') }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
      },
    },
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com',
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
});
