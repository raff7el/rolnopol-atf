import { test, expect } from "@playwright/test";
import { PAGE_URLS } from "../../src/constants/pageurls";
import { createUniqueEmail } from "../../src/factories/user.factory";
import { RegisterPage } from "../../src/pages/register.page";

// AUTH-14: "John@Doe!" passes the browser's own checks (3-20 chars, no
// `pattern` attribute), so only the app's display-name validation can stop it.
test(
  "rejects a display name with disallowed characters and sends no request",
  { tag: "@ui" },
  async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const invalidDisplayName = "John@Doe!";
    const expectedError =
      "Display name can only contain letters, numbers, spaces, hyphens, and underscores";

    await registerPage.goto();
    await registerPage.fillForm({
      email: createUniqueEmail(),
      displayName: invalidDisplayName,
      password: "Test123!",
    });
    const registerRequests = registerPage.recordRegisterRequests();

    // Act
    await registerPage.submit();

    // Assert
    const displayNameError = registerPage.fieldError(
      registerPage.displayNameInput,
    );
    await expect(displayNameError).toBeVisible();
    await expect(displayNameError).toHaveText(expectedError);
    await expect(registerPage.displayNameInput).toHaveClass(
      /\bform__field--error\b/,
    );
    await expect(registerPage.displayNameInput).toHaveValue(invalidDisplayName);

    // Only the invalid field is flagged
    await expect(registerPage.fieldError(registerPage.emailInput)).toHaveCount(0);
    await expect(
      registerPage.fieldError(registerPage.passwordInput),
    ).toHaveCount(0);

    // Validation runs before the request is built, so once the error shows,
    // a request would already have been sent if validation had failed.
    expect(registerRequests).toHaveLength(0);
    await expect(registerPage.notification("Registration successful!")).toHaveCount(0);
    await expect(page).toHaveURL(PAGE_URLS.register);
  },
);
