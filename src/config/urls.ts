/**
 * Single source of truth for API paths.
 * Paths are relative to `baseURL` from `playwright.config.ts`.
 */
export const API_URLS = {
  register: "/api/v1/register",
  profile: "/api/v1/users/profile",
} as const;

export type ApiUrl = (typeof API_URLS)[keyof typeof API_URLS];
