import { type Locator, type Page } from "@playwright/test";

import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

export class SwaggerPage extends BasePage {
  readonly url = PAGE_URLS.swagger;
  readonly apiDocsFrame: Locator;
  readonly swaggerUi: Locator;

  constructor(page: Page) {
    super(page);
    this.apiDocsFrame = page.getByTitle("Swagger API Documentation");
    this.swaggerUi = page
      .frameLocator("#swagger-frame")
      .locator("#swagger-ui > section.swagger-ui");
  }
}
