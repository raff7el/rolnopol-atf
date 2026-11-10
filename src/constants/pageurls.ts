/**
 * Single source of truth for application page paths.
 * Paths are relative to `baseURL` from `playwright.config.ts`.
 */
export const PAGE_URLS = {
  home: "/",
  login: "/login.html",
  register: "/register.html",
  swagger: "/swagger.html",
  docs: "/docs.html",
} as const;

export type PageUrl = (typeof PAGE_URLS)[keyof typeof PAGE_URLS];
