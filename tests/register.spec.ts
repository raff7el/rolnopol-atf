import { test, expect } from "@playwright/test";

test(
  "registers a new user and redirects to the login page",
  { tag: "@e2e" },
  async ({ page }) => {
    // Arrange
    test.setTimeout(20_000);
    const email = `autotest_${Date.now()}@example.com`;

    await page.goto("/register.html");
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("display-name-input").fill("Tester");
    await page.getByTestId("password-input").fill("Test123!");

    const responsePromise = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/v1/register") && r.request().method() === "POST",
    );

    // Act
    await page.getByTestId("register-submit-btn").click();

    // Assert
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe(email);

    const successBanner = page.getByRole("alert").filter({
      has: page.getByText("Registration successful!", { exact: true }),
    });
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
