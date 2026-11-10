import { test, expect } from "@playwright/test";

test(
  "displays the Rolnopol page title and welcome heading",
  { tag: "@smoke" },
  async ({ page }) => {
    // Act
    await page.goto("/");

    // Assert
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
    // Act
    const response = await page.goto("/login.html");

    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Login - Rolnopol");
    await expect(page.getByTestId("login-form")).toBeVisible();
  },
);

test(
  "loads and displays the registration page",
  { tag: "@smoke" },
  async ({ page }) => {
    // Act
    const response = await page.goto("/register.html");

    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Register - Rolnopol");
    await expect(page.getByTestId("register-form")).toBeVisible();
  },
);

test(
  "loads and displays the Swagger API documentation",
  { tag: "@smoke" },
  async ({ page }) => {
    // Act
    const response = await page.goto("/swagger.html");

    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Rolnopol - Swagger");
    await expect(page.getByTitle("Swagger API Documentation")).toBeVisible();
    await expect(
      page
        .frameLocator("#swagger-frame")
        .locator("#swagger-ui > section.swagger-ui"),
    ).toBeVisible();
  },
);

test(
  "loads and displays the documentation page",
  { tag: "@smoke" },
  async ({ page }) => {
    // Act
    const response = await page.goto("/docs.html");

    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Documentation - Rolnopol");
    await expect(page.getByTestId("docs-header")).toBeVisible();
    await expect(page.getByTestId("docs-content")).toBeVisible();
  },
);
