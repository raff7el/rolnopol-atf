import { type Locator, type Page } from "@playwright/test";

import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
  readonly url = PAGE_URLS.profile;
  readonly profileHeader: Locator;
  readonly profileInformationHeading: Locator;
  readonly updateProfileHeading: Locator;
  readonly dangerZoneHeading: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.profileHeader = page.getByTestId("profile-header");
    this.profileInformationHeading = page.getByRole("heading", {
      name: "Profile Information",
    });
    this.updateProfileHeading = page.getByRole("heading", {
      name: "Update Profile",
    });
    this.dangerZoneHeading = page.getByRole("heading", { name: "Danger Zone" });
    this.logoutButton = this.profileHeader.getByTestId("logout-btn");
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
