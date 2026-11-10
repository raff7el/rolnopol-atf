import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/register.page";

test(
  "registers a new user and redirects to the login page",
  { tag: "@e2e" },
  async ({ page }) => {
    // Arrange
    test.setTimeout(20_000);
    const registerPage = new RegisterPage(page);
    const email = `autotest_${Date.now()}@example.com`;

    await registerPage.goto();
    await registerPage.fillForm({
      email,
      displayName: "Tester",
      password: "Test123!",
    });

    const responsePromise = registerPage.waitForRegisterResponse();

    // Act
    await registerPage.submit();

    // Assert
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe(email);

    const successBanner = registerPage.notification("Registration successful!");
    await expect(successBanner).toBeVisible();
    await expect(successBanner).toHaveClass(/\bsuccess\b/);
    await expect(successBanner.locator(".notification-title")).toHaveText(
      "Success",
    );
    await expect(successBanner.locator(".notification-message")).toHaveText(
      "Registration successful!",
    );

    await expect(page).toHaveURL(/\/login\.html$/, { timeout: 10_000 });
  },
);
