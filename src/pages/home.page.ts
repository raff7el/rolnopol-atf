import { type Locator, type Page } from "@playwright/test";

import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  readonly url = PAGE_URLS.home;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole("heading", {
      name: "Welcome to Rolnopol",
    });
  }
}
