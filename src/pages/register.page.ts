import {
  type Locator,
  type Page,
  type Request,
  type Response,
} from "@playwright/test";
import { API_URLS } from "../config/urls";
import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export interface RegistrationData {
  email: string;
  displayName: string;
  password: string;
}

export class RegisterPage extends BasePage {
  readonly url = PAGE_URLS.register;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly displayNameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId("register-form");
    this.emailInput = page.getByTestId("email-input");
    this.displayNameInput = page.getByTestId("display-name-input");
    this.passwordInput = page.getByTestId("password-input");
    this.submitButton = page.getByTestId("register-submit-btn");
  }

  async fillForm({
    email,
    displayName,
    password,
  }: RegistrationData): Promise<void> {
    await this.emailInput.fill(email);
    await this.displayNameInput.fill(displayName);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  waitForRegisterResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (r) =>
        r.url().endsWith(API_URLS.register) && r.request().method() === "POST",
    );
  }

  /**
   * Starts recording every request sent to the register endpoint.
   * Returns the live array, so the test can check it after the action.
   */
  recordRegisterRequests(): Request[] {
    const requests: Request[] = [];
    this.page.on("request", (r) => {
      if (r.url().endsWith(API_URLS.register)) requests.push(r);
    });
    return requests;
  }

  /** Inline validation message shown under the given form field. */
  fieldError(field: Locator): Locator {
    return this.form.locator(".form-group", { has: field }).getByRole("alert");
  }

  notification(message: string): Locator {
    return this.page.getByRole("alert").filter({
      has: this.page.getByText(message, { exact: true }),
    });
  }

  notificationTitle(message: string): Locator {
    return this.notification(message).locator(".notification-title");
  }

  notificationMessage(message: string): Locator {
    return this.notification(message).locator(".notification-message");
  }
}
