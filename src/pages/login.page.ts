import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly url = "/login.html";
  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId("login-form");
  }
}
