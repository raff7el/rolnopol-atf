import { expect, test } from "@playwright/test";

import { FarmApi } from "../../src/api/farm.api";
import { PAGE_URLS } from "../../src/constants/pageurls";
import {
  type AnimalData,
  StaffFieldsPage,
} from "../../src/pages/staff-fields.page";

// Runs in the `demo-user` project, which starts already logged in as the demo
// user with the session saved by tests/auth/demo-user.setup.ts.

let createdAnimalId: number | undefined;

test.afterEach(async ({ page }) => {
  if (createdAnimalId === undefined) return;
  const id = createdAnimalId;
  createdAnimalId = undefined;
  const response = await new FarmApi(page.request).deleteAnimal(id);
  expect(
    response.ok(),
    `cleanup: delete animal group ${id} -> ${response.status()} ${await response.text()}`,
  ).toBe(true);
});

// FARM-03 (partial): adds an animal group with type and amount, but does not
// assign it to a field yet.
test(
  "creates a new animal group in the Staff & Fields view for a logged-in user",
  { tag: "@ui" },
  async ({ page }) => {
    // Arrange
    const staffFieldsPage = new StaffFieldsPage(page);
    // A rarely used type, so the search below fits on one page of 5 cards.
    const animal: AnimalData = { type: "tardigrade", amount: 42 };

    await staffFieldsPage.goto();
    await expect(page).toHaveURL(PAGE_URLS.staffFields);
    await expect(staffFieldsPage.viewReadyMarker).toBeVisible();

    // Act
    await staffFieldsPage.openAddAnimalModal();
    await expect(staffFieldsPage.addAnimalModal).toBeVisible();
    await staffFieldsPage.fillAddAnimalForm(animal);

    const addAnimalResponsePromise = staffFieldsPage.waitForAddAnimalResponse();
    const reloadAnimalsResponsePromise =
      staffFieldsPage.waitForAnimalsListResponse();
    await staffFieldsPage.submitAddAnimalForm();

    // Assert
    const addAnimalResponse = await addAnimalResponsePromise;
    expect(addAnimalResponse.status()).toBe(201);

    const body = await addAnimalResponse.json();
    createdAnimalId = body.data?.id;
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      type: animal.type,
      amount: animal.amount,
    });

    await expect(staffFieldsPage.addAnimalModal).toBeHidden();

    await reloadAnimalsResponsePromise;
    await staffFieldsPage.searchAnimals(animal.type);
    const createdAnimal = staffFieldsPage.animalCard(body.data.id);
    await expect(createdAnimal).toBeVisible();
    await expect(createdAnimal).toContainText(animal.type);
    await expect(staffFieldsPage.animalCardAmount(body.data.id)).toHaveText(
      String(animal.amount),
    );
  },
);
