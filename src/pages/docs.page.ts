import { type Locator, type Page } from "@playwright/test";
import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export class DocsPage extends BasePage {
  readonly url = PAGE_URLS.docs;
  readonly header: Locator;
  readonly content: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByTestId("docs-header");
    this.content = page.getByTestId("docs-content");
  }
}
