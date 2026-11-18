import { type Locator, type Page } from "@playwright/test";
import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export interface LoginCredentials {
  email: string;
  password: string;
}

export class LoginPage extends BasePage {
  readonly url = PAGE_URLS.login;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId("login-form");
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.submitButton = page.getByTestId("login-submit-btn");
  }

  async fillForm({ email, password }: LoginCredentials): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
