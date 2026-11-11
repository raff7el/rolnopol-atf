import { type Page, type Response } from "@playwright/test";

export abstract class BasePage {
  abstract readonly url: string;

  constructor(protected readonly page: Page) {}

  goto(): Promise<Response | null> {
    return this.page.goto(this.url);
  }
}
