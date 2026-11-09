import { test, expect } from '@playwright/test';

test('home page has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Rolnopol/);
  await expect(page.getByRole('heading', { name: 'Welcome to Rolnopol' })).toBeVisible();
});

test('get started link opens registration page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Get Started Free' }).click();

  await expect(page).toHaveURL(/\/register\.html/);
});
