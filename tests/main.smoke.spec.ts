import { test, expect } from "@playwright/test";

test(
  "displays the Rolnopol page title and welcome heading",
  { tag: "@smoke" },
  async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Rolnopol/);
    await expect(
      page.getByRole("heading", { name: "Welcome to Rolnopol" }),
    ).toBeVisible();
  },
);

test(
  "loads and displays the login page",
  { tag: "@smoke" },
  async ({ page }) => {
    const response = await page.goto("/login.html");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Login - Rolnopol");
    await expect(page.getByTestId("login-form")).toBeVisible();
  },
);

test(
  "loads and displays the registration page",
  { tag: "@smoke" },
  async ({ page }) => {
    const response = await page.goto("/register.html");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Register - Rolnopol");
    await expect(page.getByTestId("register-form")).toBeVisible();
  },
);
