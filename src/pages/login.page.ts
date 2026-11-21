import { type Locator, type Page } from "@playwright/test";

import { API_URLS } from "../config/urls";
import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Status and parsed JSON body of a `POST /api/v1/login` response. */
export interface LoginResponse {
  status: number;
  body: {
    success: boolean;
    data?: { token: string; user: { email: string } };
    message?: string;
  };
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

  /**
   * Captures the next `POST` to the login endpoint, including its JSON body.
   * The app redirects as soon as login succeeds, which discards the body of a
   * plain `waitForResponse`, so the request is routed, fetched here and
   * passed through to the page unchanged.
   *
   * Call it before submitting; it returns a function that resolves with the
   * captured response. (A getter is returned because an `async` method
   * cannot return a still-pending promise: awaiting it would wait for the
   * login request before the form is submitted.)
   */
  async captureLoginResponse(): Promise<() => Promise<LoginResponse>> {
    let resolve!: (value: LoginResponse) => void;
    const captured = new Promise<LoginResponse>((r) => (resolve = r));

    await this.page.route(`**${API_URLS.login}`, async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      const response = await route.fetch();
      resolve({ status: response.status(), body: await response.json() });
      await route.fulfill({ response });
    });

    return () => captured;
  }
}
