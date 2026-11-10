import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class DocsPage extends BasePage {
  readonly url = "/docs.html";
  readonly header: Locator;
  readonly content: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByTestId("docs-header");
    this.content = page.getByTestId("docs-content");
  }
}
