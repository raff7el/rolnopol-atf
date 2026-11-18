import { type Locator, type Page, type Response } from "@playwright/test";
import { API_URLS } from "../config/urls";
import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
  readonly url = PAGE_URLS.profile;

  // Header
  readonly profileHeader: Locator;
  readonly headerName: Locator;
  readonly headerEmail: Locator;
  readonly statusText: Locator;
  readonly logoutButton: Locator;

  // Section headings
  readonly profileInformationHeading: Locator;
  readonly updateProfileHeading: Locator;
  readonly dangerZoneHeading: Locator;

  // Profile Information card (shown once the profile data has loaded)
  readonly profileContent: Locator;
  readonly userIdValue: Locator;
  readonly displayedNameValue: Locator;
  readonly emailValue: Locator;
  readonly createdAtValue: Locator;
  readonly lastLoginValue: Locator;

  // Update Profile form
  readonly newDisplayedNameInput: Locator;
  readonly updateProfileSubmitButton: Locator;
  readonly updateMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.profileHeader = page.getByTestId("profile-header");
    this.headerName = this.profileHeader.getByRole("heading", { level: 2 });
    this.headerEmail = this.profileHeader.locator("#profileEmail");
    this.statusText = this.profileHeader.locator("#statusText");
    this.logoutButton = this.profileHeader.getByTestId("logout-btn");

    this.profileInformationHeading = page.getByRole("heading", {
      name: "Profile Information",
    });
    this.updateProfileHeading = page.getByRole("heading", {
      name: "Update Profile",
    });
    this.dangerZoneHeading = page.getByRole("heading", { name: "Danger Zone" });

    this.profileContent = page.getByTestId("profile-content");
    this.userIdValue = page.getByTestId("user-id");
    this.displayedNameValue = page.getByTestId("displayed-name");
    this.emailValue = page.getByTestId("email-value");
    this.createdAtValue = page.getByTestId("created-at");
    this.lastLoginValue = page.getByTestId("last-login");

    this.newDisplayedNameInput = page.getByTestId("new-displayed-name-input");
    this.updateProfileSubmitButton = page.getByTestId(
      "update-profile-submit-btn",
    );
    this.updateMessage = page.locator("#updateMessage");
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async fillDisplayName(displayName: string): Promise<void> {
    await this.newDisplayedNameInput.fill(displayName);
  }

  async submitUpdate(): Promise<void> {
    await this.updateProfileSubmitButton.click();
  }

  waitForUpdateProfileResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (r) =>
        r.url().endsWith(API_URLS.profile) && r.request().method() === "PUT",
    );
  }
}
