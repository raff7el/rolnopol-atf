/**
 * Single source of truth for API paths.
 * Paths are relative to `baseURL` from `playwright.config.ts`.
 */
export const API_URLS = {
  register: "/api/v1/register",
  login: "/api/v1/login",
  animals: "/api/v1/animals",
  fields: "/api/v1/fields",
} as const;

export type ApiUrl = (typeof API_URLS)[keyof typeof API_URLS];
