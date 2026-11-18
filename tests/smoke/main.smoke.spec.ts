import { test, expect } from "@playwright/test";
import { DocsPage } from "../../src/pages/docs.page";
import { HomePage } from "../../src/pages/home.page";
import { LoginPage } from "../../src/pages/login.page";
import { RegisterPage } from "../../src/pages/register.page";
import { SwaggerPage } from "../../src/pages/swagger.page";

test(
  "displays the Rolnopol page title and welcome heading",
  { tag: "@smoke" },
  async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);

    // Act
    await homePage.goto();

    // Assert
    await expect(page).toHaveTitle(/Rolnopol/);
    await expect(homePage.welcomeHeading).toBeVisible();
  },
);

test(
  "loads and displays the login page",
  { tag: "@smoke" },
  async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    const response = await loginPage.goto();

    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Login - Rolnopol");
    await expect(loginPage.form).toBeVisible();
  },
);

test(
  "loads and displays the registration page",
  { tag: "@smoke" },
  async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);

    // Act
    const response = await registerPage.goto();

    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Register - Rolnopol");
    await expect(registerPage.form).toBeVisible();
  },
);

test(
  "loads and displays the Swagger API documentation",
  { tag: "@smoke" },
  async ({ page }) => {
    // Arrange
    const swaggerPage = new SwaggerPage(page);

    // Act
    const response = await swaggerPage.goto();

    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Rolnopol - Swagger");
    await expect(swaggerPage.apiDocsFrame).toBeVisible();
    await expect(swaggerPage.swaggerUi).toBeVisible();
  },
);

test(
  "loads and displays the documentation page",
  { tag: "@smoke" },
  async ({ page }) => {
    // Arrange
    const docsPage = new DocsPage(page);

    // Act
    const response = await docsPage.goto();

    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Documentation - Rolnopol");
    await expect(docsPage.header).toBeVisible();
    await expect(docsPage.content).toBeVisible();
  },
);
