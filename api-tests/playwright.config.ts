import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: [
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: '../allure-results',
      suiteTitle: 'API Tests',
    }],
    ['json', { outputFile: '../test-results/api-results.json' }],
  ],
  use: {
    baseURL: 'http://20.188.112.117:3030',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'api-tests',
      testDir: './tests',
    },
  ],
});
