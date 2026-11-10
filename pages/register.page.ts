import { type Locator, type Page, type Response } from "@playwright/test";

export interface RegistrationData {
  email: string;
  displayName: string;
  password: string;
}

export class RegisterPage {
  readonly url = "/register.html";
  readonly emailInput: Locator;
  readonly displayNameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByTestId("email-input");
    this.displayNameInput = page.getByTestId("display-name-input");
    this.passwordInput = page.getByTestId("password-input");
    this.submitButton = page.getByTestId("register-submit-btn");
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
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
        r.url().endsWith("/api/v1/register") && r.request().method() === "POST",
    );
  }

  notification(message: string): Locator {
    return this.page.getByRole("alert").filter({
      has: this.page.getByText(message, { exact: true }),
    });
  }
}
