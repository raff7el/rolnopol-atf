import { type Locator, type Page } from "@playwright/test";
import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly url = PAGE_URLS.login;
  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId("login-form");
  }
}
