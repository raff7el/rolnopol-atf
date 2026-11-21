import { expect, test } from "@playwright/test";

import { FarmApi } from "../../src/api/farm.api";
import { PAGE_URLS } from "../../src/constants/pageurls";
import {
  type FieldData,
  StaffFieldsPage,
} from "../../src/pages/staff-fields.page";

// Runs in the `demo-user` project, which starts already logged in as the demo
// user with the session saved by tests/auth/demo-user.setup.ts.

let createdFieldId: number | undefined;

test.afterEach(async ({ page }) => {
  if (createdFieldId === undefined) return;
  const id = createdFieldId;
  createdFieldId = undefined;
  const response = await new FarmApi(page.request).deleteField(id);
  expect(
    response.ok(),
    `cleanup: delete field ${id} -> ${response.status()} ${await response.text()}`,
  ).toBe(true);
});

// FARM-01: the field is removed through the API after the test, so the demo
// user's farm stays the same for other tests.
test(
  "creates a new field in the Staff & Fields view for a logged-in user",
  { tag: "@ui" },
  async ({ page }) => {
    // Arrange
    const staffFieldsPage = new StaffFieldsPage(page);
    const field: FieldData = { name: `ATF field ${Date.now()}`, area: "12.5" };

    await staffFieldsPage.goto();
    await expect(page).toHaveURL(PAGE_URLS.staffFields);
    await expect(staffFieldsPage.viewReadyMarker).toBeVisible();

    // Act
    await staffFieldsPage.openAddFieldModal();
    await expect(staffFieldsPage.addFieldModal).toBeVisible();
    // The modal loads districts and then focuses "Field Name"; wait for that first.
    await expect(staffFieldsPage.fieldDistrictSelect).toBeEnabled();
    await staffFieldsPage.fillAddFieldForm(field);
    await expect(staffFieldsPage.fieldNameInput).toHaveValue(field.name);
    await expect(staffFieldsPage.fieldAreaInput).toHaveValue(field.area);

    const addFieldResponsePromise = staffFieldsPage.waitForAddFieldResponse();
    await staffFieldsPage.submitAddFieldForm();

    // Assert
    const addFieldResponse = await addFieldResponsePromise;
    expect(addFieldResponse.status()).toBe(201);

    const body = await addFieldResponse.json();
    createdFieldId = body.data?.id;
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({ name: field.name });

    await expect(staffFieldsPage.addFieldModal).toBeHidden();

    await staffFieldsPage.searchFields(field.name);
    const createdField = staffFieldsPage.fieldCard(body.data.id);
    await expect(createdField).toBeVisible();
    await expect(createdField).toContainText(field.name);
    await expect(staffFieldsPage.fieldCardArea(body.data.id)).toHaveText(
      `${field.area} ha`,
    );
  },
);
