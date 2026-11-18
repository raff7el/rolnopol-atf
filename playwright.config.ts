import { defineConfig, devices } from '@playwright/test';
// Loads .env and validates all required variables; throws before any test runs.
import { ENV } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: ENV.isCI,
  retries: ENV.isCI ? 2 : 0,
  reporter: ENV.isCI
    ? [
        ['github'],
        ['html', { open: 'never' }],
      ]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: ENV.baseUrl,
    trace: ENV.isCI ? 'retain-on-failure' : 'on',
  },
  webServer: {
    command: 'npm start',
    cwd: '../test-repo/rolnopol',
    url: ENV.baseUrl,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
