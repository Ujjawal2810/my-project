// @ts-check
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { defineConfig, devices } = require('@playwright/test');

const recordVideo = process.env.RECORD_VIDEO === '1';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
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
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      grep: /@smoke|@regression/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
        video: recordVideo ? 'on' : 'retain-on-failure',
      },
    },
    {
      name: 'api-tests',
      testDir: './tests/api',
      grep: /@smoke|@regression/,
      use: {
        baseURL: process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
