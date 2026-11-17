import { test, expect } from "@playwright/test";
import { PAGE_URLS } from "../src/constants/pageurls";
import { LoginPage } from "../src/pages/login.page";
import { ProfilePage } from "../src/pages/profile.page";

// FARM-06: emptyuser has no farm data, so the profile page should load
// successfully with all sections visible and no errors.
test(
  "logs in as the empty user, displays profile sections, and logs out",
  { tag: "@ui" },
  async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.goto();
    await loginPage.fillForm({
      email: "emptyuser@rolnopol.demo.pl",
      password: "demoPass123",
    });

    // Act
    await loginPage.submit();

    // Assert
    await expect(page).toHaveURL(PAGE_URLS.profile);
    await expect(page).toHaveTitle("Profile - Rolnopol");
    await expect(profilePage.profileInformationHeading).toBeVisible();
    await expect(profilePage.updateProfileHeading).toBeVisible();
    await expect(profilePage.dangerZoneHeading).toBeVisible();

    // Act
    await profilePage.logout();

    // Assert
    // The profile page's logout button sends the user back to the login
    // page (see profile.js `_handleLogout`), not the home page.
    await expect(page).toHaveURL(PAGE_URLS.login);
    await expect(loginPage.form).toBeVisible();
  },
);
