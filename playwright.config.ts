import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { STORAGE_STATE } from './src/config/auth';

// Local values live in .env (git-ignored). In CI they come from the workflow env.
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  throw new Error('BASE_URL is not set. Copy .env.example to .env and fill it in.');
}

export default defineConfig({
  testDir: './tests',
  // Playwright's default. The test timeout also covers fixture setup and
  // teardown (incl. saving the trace), and registration alone takes ~5s in
  // the app (API response + 2s redirect delay), so 10s was too tight.
  timeout: 30_000,
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
    baseURL: BASE_URL,
    trace: process.env.CI ? 'retain-on-failure' : 'on',
  },
  webServer: {
    command: 'npm start',
    cwd: '../test-repo/rolnopol',
    url: BASE_URL,
    reuseExistingServer: true,
    // Rolnopol delays writes to users.json and financial.json by 1s, which makes
    // register ~3s and login ~1s. 0 writes immediately, as the app's own tests do.
    // Applies only when Playwright starts the server, not to one already running.
    env: { JSON_DB_WRITE_DEBOUNCE_MS: '0' },
    timeout: 120_000,
  },
  projects: [
    // Fast check: is the app up and are its public pages served? No login.
    {
      name: 'smoke-tests',
      testDir: './tests/smoke',
      use: { ...devices['Desktop Chrome'] },
    },
    // Logs in as DEMO_USER once and saves the session for 'demo-user'.
    {
      name: 'setup',
      testDir: './tests/auth',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Tests that start already logged in as DEMO_USER.
    {
      name: 'demo-user',
      testDir: './tests/session',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE.demo,
      },
    },
    // UI flows that start logged out (registration, logging in as other users).
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});