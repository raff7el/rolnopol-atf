import { test, expect } from "@playwright/test";
import { PAGE_URLS } from "../src/constants/pageurls";
import { RegisterPage } from "../src/pages/register.page";

test(
  "registers a new user and redirects to the login page",
  { tag: "@ui" },
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

    const successMessage = "Registration successful!";
    const successBanner = registerPage.notification(successMessage);
    await expect(successBanner).toBeVisible();
    await expect(successBanner).toHaveClass(/\bsuccess\b/);
    await expect(registerPage.notificationTitle(successMessage)).toHaveText(
      "Success",
    );
    await expect(registerPage.notificationMessage(successMessage)).toHaveText(
      successMessage,
    );

    await expect(page).toHaveURL(PAGE_URLS.login, { timeout: 10_000 });
  },
);
