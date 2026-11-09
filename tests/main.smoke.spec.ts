import { test, expect } from "@playwright/test";

test("displays the Rolnopol page title and welcome heading", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Rolnopol/);
  await expect(
    page.getByRole("heading", { name: "Welcome to Rolnopol" }),
  ).toBeVisible();
});
