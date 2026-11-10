import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class SwaggerPage extends BasePage {
  readonly url = "/swagger.html";
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
