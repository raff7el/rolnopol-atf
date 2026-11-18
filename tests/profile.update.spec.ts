import { test, expect } from "@playwright/test";
import { API_URLS } from "../src/config/urls";
import { PAGE_URLS } from "../src/constants/pageurls";
import { createUser } from "../src/factories/user.factory";
import { LoginPage } from "../src/pages/login.page";
import { ProfilePage } from "../src/pages/profile.page";

// PROF-01: the test changes account data, so it uses a freshly registered
// user instead of a shared demo account (see test plan, "Environment, data and criteria").
test(
  "updates the display name and keeps it after reload",
  { tag: "@ui" },
  async ({ page, request }) => {
    // Arrange
    test.setTimeout(20_000);
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const suffix = Date.now().toString().slice(-6);
    const user = createUser({
      email: `autotest_${Date.now()}@example.com`,
      password: "Test123!",
      displayName: `Before ${suffix}`,
    });
    const newDisplayName = `After ${suffix}`;

    const registerResponse = await request.post(API_URLS.register, {
      data: {
        email: user.email,
        displayedName: user.displayName,
        password: user.password,
      },
    });
    if (!registerResponse.ok()) {
      throw new Error(
        `Precondition failed: registering ${user.email} returned ${registerResponse.status()}`,
      );
    }

    await loginPage.goto();
    await loginPage.fillForm(user);
    await loginPage.submit();
    await expect(page).toHaveURL(PAGE_URLS.profile);
    await expect(profilePage.headerName).toHaveText(user.displayName);

    await profilePage.fillDisplayName(newDisplayName);
    const updateResponsePromise = profilePage.waitForUpdateProfileResponse();

    // Act
    await profilePage.submitUpdate();

    // Assert
    const updateResponse = await updateResponsePromise;
    expect(updateResponse.status()).toBe(200);

    await expect.soft(profilePage.updateMessage).toHaveText(
      "Profile updated successfully!",
    );
    await expect.soft(profilePage.headerName).toHaveText(newDisplayName);
    await expect.soft(profilePage.displayedNameValue).toHaveText(newDisplayName);

    // Do not continue to the reload check on a broken state.
    expect(test.info().errors).toHaveLength(0);

    // Act
    await page.reload();

    // Assert
    await expect(profilePage.profileContent).toBeVisible();
    await expect.soft(profilePage.headerName).toHaveText(newDisplayName);
    await expect.soft(profilePage.displayedNameValue).toHaveText(newDisplayName);
    await expect.soft(profilePage.newDisplayedNameInput).toHaveValue(
      newDisplayName,
    );
  },
);
