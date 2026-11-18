import { test, expect } from "@playwright/test";
import { PAGE_URLS } from "../src/constants/pageurls";
import { createUser } from "../src/factories/user.factory";
import { LoginPage } from "../src/pages/login.page";
import { ProfilePage } from "../src/pages/profile.page";

// FARM-06: emptyuser (TEST_USER_* in .env) has no farm data, so the profile page should load
// successfully with all sections visible and no errors.
test(
  "logs in as the empty user, displays profile sections, and logs out",
  { tag: "@ui" },
  async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const user = createUser();

    await loginPage.goto();
    await loginPage.fillForm(user);

    // Act
    await loginPage.submit();

    // Assert
    await expect(page).toHaveURL(PAGE_URLS.profile);
    await expect(page).toHaveTitle("Profile - Rolnopol");
    await expect(profilePage.profileContent).toBeVisible();

    // Independent facts about the loaded profile - report every mismatch at once.
    await expect.soft(profilePage.headerName).toHaveText(user.displayName);
    await expect.soft(profilePage.headerEmail).toHaveText(user.email);
    await expect.soft(profilePage.statusText).toHaveText("Active");
    await expect.soft(profilePage.logoutButton).toBeVisible();

    await expect.soft(profilePage.profileInformationHeading).toBeVisible();
    await expect.soft(profilePage.updateProfileHeading).toBeVisible();
    await expect.soft(profilePage.dangerZoneHeading).toBeVisible();

    await expect.soft(profilePage.userIdValue).toHaveText(/^\d+$/);
    await expect.soft(profilePage.displayedNameValue).toHaveText(user.displayName);
    await expect.soft(profilePage.emailValue).toHaveText(user.email);
    // "-" is the placeholder before data loads, "N/A" means the value is missing.
    await expect.soft(profilePage.createdAtValue).not.toHaveText(/^(-|N\/A)$/);
    await expect.soft(profilePage.lastLoginValue).not.toHaveText(/^(-|N\/A)$/);

    // Do not continue to logout on a broken profile state.
    expect(test.info().errors).toHaveLength(0);

    // Act
    await profilePage.logout();

    // Assert
    // The profile page's logout button sends the user back to the login
    // page (see profile.js `_handleLogout`), not the home page.
    await expect(page).toHaveURL(PAGE_URLS.login);
    await expect(loginPage.form).toBeVisible();
  },
);
