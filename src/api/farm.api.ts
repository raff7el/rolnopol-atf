import { type APIRequestContext, type APIResponse } from "@playwright/test";
import { API_URLS } from "../config/urls";

/**
 * Thin client for the farm resources API, used to clean up test data.
 * Pass `page.request`: it shares the browser context's cookies, and the API
 * accepts the `rolnopolToken` session cookie as authentication.
 */
export class FarmApi {
  constructor(private readonly request: APIRequestContext) {}

  deleteField(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${API_URLS.fields}/${id}`);
  }

  deleteAnimal(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${API_URLS.animals}/${id}`);
  }
}
