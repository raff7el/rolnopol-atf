import { type Locator, type Page, type Response } from "@playwright/test";
import { API_URLS } from "../config/urls";
import { PAGE_URLS } from "../constants/pageurls";
import { BasePage } from "./base.page";

/** Data for the "Add Field" form. */
export type FieldData = {
  name: string;
  area: string;
};

/** Data for the "Add Animal" form. `type` is the option value, e.g. "cow". */
export type AnimalData = {
  type: string;
  amount: number;
};

export class StaffFieldsPage extends BasePage {
  readonly url = PAGE_URLS.staffFields;

  // Fields section
  readonly fieldsList: Locator;
  readonly fieldsSearchInput: Locator;
  readonly openAddFieldModalButton: Locator;
  readonly addFieldModal: Locator;
  readonly fieldNameInput: Locator;
  readonly fieldAreaInput: Locator;
  /**
   * Injected into the "Add Field" modal after it opens and disabled while
   * districts load. Once loaded the page moves focus to "Field Name", which
   * would steal keystrokes from another input, so wait for it to be enabled.
   */
  readonly fieldDistrictSelect: Locator;
  readonly addFieldSubmitButton: Locator;

  // Animals section
  readonly animalsList: Locator;
  readonly animalCards: Locator;
  readonly animalsSearchInput: Locator;
  readonly openAddAnimalModalButton: Locator;
  readonly addAnimalModal: Locator;
  readonly animalTypeSelect: Locator;
  readonly animalAmountInput: Locator;
  readonly addAnimalSubmitButton: Locator;

  /**
   * Visible once the page script has wired up the "Add Field" and
   * "Add Animal" buttons: it renders animal cards only after that step.
   * Clicking the buttons earlier does nothing. Needs a user with animals.
   */
  readonly viewReadyMarker: Locator;

  constructor(page: Page) {
    super(page);
    // The app exposes no test ids or accessible names for these sections,
    // so the ids from the markup are the most stable hooks.
    this.fieldsList = page.locator("#fieldsList");
    this.fieldsSearchInput = page.locator("#fieldsSearch");
    this.openAddFieldModalButton = page.locator("#openAddFieldModal");
    this.addFieldModal = page.locator("#addFieldModal");
    this.fieldNameInput = this.addFieldModal.getByLabel("Field Name");
    this.fieldAreaInput = this.addFieldModal.getByLabel("Area (ha)");
    this.fieldDistrictSelect = this.addFieldModal.getByLabel("District (optional)");
    this.addFieldSubmitButton = this.addFieldModal.getByRole("button", {
      name: "Add Field",
    });

    this.animalsList = page.locator("#animalsList");
    this.animalCards = this.animalsList.locator("li.animal-card");
    this.animalsSearchInput = page.locator("#animalsSearch");
    this.openAddAnimalModalButton = page.locator("#openAddAnimalModal");
    this.addAnimalModal = page.locator("#addAnimalModal");
    this.animalTypeSelect = this.addAnimalModal.getByLabel("Type");
    this.animalAmountInput = this.addAnimalModal.getByLabel("Amount");
    this.addAnimalSubmitButton = this.addAnimalModal.getByRole("button", {
      name: "Add Animal",
    });

    this.viewReadyMarker = this.animalCards.first();
  }

  // ---- Fields ----

  /** Card of one field in the list, found by its id from the API. */
  fieldCard(id: number | string): Locator {
    return this.fieldsList.locator(`li.field-card-${id}`);
  }

  fieldCardArea(id: number | string): Locator {
    return this.fieldCard(id).locator(".list-card-area");
  }

  /** Resolves with the response of the "add field" request. Not awaited here. */
  waitForAddFieldResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (r) => r.url().endsWith(API_URLS.fields) && r.request().method() === "POST",
    );
  }

  async openAddFieldModal(): Promise<void> {
    await this.openAddFieldModalButton.click();
  }

  async fillAddFieldForm(data: FieldData): Promise<void> {
    await this.fieldNameInput.fill(data.name);
    await this.fieldAreaInput.fill(data.area);
  }

  async submitAddFieldForm(): Promise<void> {
    await this.addFieldSubmitButton.click();
  }

  async searchFields(term: string): Promise<void> {
    await this.fieldsSearchInput.fill(term);
  }

  // ---- Animals ----

  /** Card of one animal group in the list, found by its id from the API. */
  animalCard(id: number | string): Locator {
    return this.animalsList.locator(`li[data-animal-id="${id}"]`);
  }

  animalCardAmount(id: number | string): Locator {
    return this.animalCard(id).locator(".list-card-amount");
  }

  /** Resolves with the response of the "add animal" request. Not awaited here. */
  waitForAddAnimalResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (r) => r.url().endsWith(API_URLS.animals) && r.request().method() === "POST",
    );
  }

  /**
   * Resolves with the response of the request that (re)loads the animals list.
   * The page reloads the list after an animal is added.
   */
  waitForAnimalsListResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (r) => r.url().endsWith(API_URLS.animals) && r.request().method() === "GET",
    );
  }

  async openAddAnimalModal(): Promise<void> {
    await this.openAddAnimalModalButton.click();
  }

  async fillAddAnimalForm(data: AnimalData): Promise<void> {
    await this.animalTypeSelect.selectOption(data.type);
    await this.animalAmountInput.fill(String(data.amount));
  }

  async submitAddAnimalForm(): Promise<void> {
    await this.addAnimalSubmitButton.click();
  }

  /**
   * Filters the list client-side by animal type or field name. The page
   * clears this box after an animal is added, before it reloads the list,
   * so search only once that reload has been received.
   */
  async searchAnimals(term: string): Promise<void> {
    await this.animalsSearchInput.fill(term);
  }
}
