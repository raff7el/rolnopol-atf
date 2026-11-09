import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows title and welcome heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Rolnopol/);
    await expect(page.getByRole('heading', { name: 'Welcome to Rolnopol' })).toBeVisible();
  });

  test('Get Started Free opens registration page', async ({ page }) => {
    await page.getByRole('link', { name: 'Get Started Free' }).click();

    await expect(page).toHaveURL(/\/register\.html/);
  });

  test('Sign In opens login page', async ({ page }) => {
    await page.getByRole('main').getByRole('link', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/login\.html/);
  });
});

test.describe('Navigation', () => {
  const pages = [
    { link: 'Alerts', url: /\/alerts\.html/, title: 'Alerts - Rolnopol' },
    { link: 'Documentation', url: /\/docs\.html/, title: 'Documentation - Rolnopol' },
    { link: 'Register', url: /\/register\.html/, title: 'Register - Rolnopol' },
    { link: 'Login', url: /\/login\.html/, title: 'Login - Rolnopol' },
  ];

  for (const { link, url, title } of pages) {
    test(`${link} link opens ${link} page`, async ({ page }) => {
      await page.goto('/');

      await page.getByRole('navigation').first().getByRole('link', { name: link, exact: true }).click();

      await expect(page).toHaveURL(url);
      await expect(page).toHaveTitle(title);
    });
  }
});

test.describe('Login page', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/login.html');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByTestId('login-submit-btn')).toBeVisible();
  });
});

test.describe('Register page', () => {
  test('shows registration form', async ({ page }) => {
    await page.goto('/register.html');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Display Name')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByTestId('register-submit-btn')).toBeVisible();
  });
});
