import { expect, test } from "@playwright/test";

import { PAGE_URLS } from "../../src/constants/pageurls";
import { ProfilePage } from "../../src/pages/profile.page";

// Runs in the `demo-user` project, which starts already logged in as the demo
// user with the session saved by tests/auth/demo-user.setup.ts.
// Supporting: checks that the saved session (AUTH-04) still works, so a broken
// setup shows up here instead of as failures in every session test.
test(
  "opens the profile page with the saved demo user session",
  { tag: "@ui" },
  async ({ page }) => {
    // Arrange
    const profilePage = new ProfilePage(page);

    // Act
    await profilePage.goto();

    // Assert
    // Without a valid session the app sends the user to the login page.
    await expect(page).toHaveURL(PAGE_URLS.profile);
    await expect(page).toHaveTitle("Profile - Rolnopol");
    await expect(profilePage.profileInformationHeading).toBeVisible();
    await expect(profilePage.logoutButton).toBeVisible();
  },
);
