import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never' }],
      ]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: process.env.CI ? 'retain-on-failure' : 'on',
  },
  webServer: {
    command: 'npm start',
    cwd: '../test-repo/rolnopol',
    url: 'http://localhost:3000',
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