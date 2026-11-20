import { test, expect } from "@playwright/test";

test(
  "creates a new field in the Staff & Fields view for a logged-in user",
  { tag: "@ui" },
  async ({ page }) => {
    // Arrange
    const fieldName = `ATF field ${Date.now()}`;
    const fieldArea = "12.5";

    await page.goto("/staff-fields-main.html");
    await expect(page).toHaveURL("/staff-fields-main.html");
    await expect(page.locator("#fieldsList")).toBeVisible();

    // Act
    await page.locator("#openAddFieldModal").click();
    await expect(page.locator("#addFieldModal")).toBeVisible();
    await page.locator("#fieldName").fill(fieldName);
    await page.locator("#fieldArea").fill(fieldArea);

    const createFieldResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/v1/fields") &&
        response.request().method() === "POST",
    );

    await page.locator("#addFieldForm button[type='submit']").click();

    // Assert
    const createFieldResponse = await createFieldResponsePromise;
    expect(createFieldResponse.ok()).toBe(true);

    const body = await createFieldResponse.json();
    expect(body.success).toBe(true);

    await page.locator("#fieldsSearch").fill(fieldName);
    const createdField = page.locator("#fieldsList li", { hasText: fieldName });
    await expect(createdField).toBeVisible();
    await expect(createdField).toContainText(`${fieldArea} ha`);
  },
);
