# Coding Standards

## Page Object Pattern

Page Objects describe **what is on a page and what a user can do there**. Tests decide **what the result should be**.

### Key rules

1. **No assertions in Page Objects.** No `expect`, no `import { expect }`, and no `verify*` / `assert*` / `should*` helpers.
2. **All verifications live in test files** (`tests/**/*.spec.ts`, `tests/auth/*.setup.ts`), inside the `// Assert` block.
3. **Return what the test needs to check.** Expose a `Locator`, a value, or a `Promise<Response>` and let the test assert on it.

> Enforced by ESLint: importing `expect` from `@playwright/test` in `src/pages/**` fails `npm run lint`.

### Structure

| Item         | Convention                                                               |
| ------------ | ------------------------------------------------------------------------ |
| Location     | `src/pages/<name>.page.ts`                                               |
| Class name   | `<Name>Page`, e.g. `RegisterPage`                                        |
| Base class   | Extends `BasePage` (`src/pages/base.page.ts`), which holds shared logic  |
| Constructor  | Takes `page: Page`, calls `super(page)`; defines all static locators     |
| Page URL     | `readonly url = PAGE_URLS.<name>`; navigate with the inherited `goto()`  |
| Locators     | `readonly` fields; prefer `getByTestId` / `getByRole` over CSS selectors |
| Dynamic ones | Methods that return a `Locator`, e.g. `notification(message)`            |
| Actions      | `async` methods named after user intent (`fillForm`, `submit`)           |
| Input data   | Typed object parameter (e.g. `RegistrationData`) instead of many args    |

### Good practices

- Keep one Page Object per page (or per reusable component).
- Keep methods small and focused on one user action.
- Return listener promises (e.g. `page.waitForResponse`) **without awaiting** them, so the test can register them in `// Arrange` before the action.
- Keep test data, timeouts, and `test.*` calls out of Page Objects; they belong in the test.
- Keep selectors in the Page Object, not in the test.

### Example

```ts
// ✅ Page Object: exposes a locator
notification(message: string): Locator {
  return this.page.getByRole("alert").filter({
    has: this.page.getByText(message, { exact: true }),
  });
}

// ✅ Test: performs the verification
await expect(registerPage.notification("Registration successful!")).toBeVisible();
```

```ts
// ❌ Page Object must not assert
async verifySuccess(): Promise<void> {
  await expect(this.page.getByRole("alert")).toBeVisible();
}
```

## URLs and Paths

Every application path is defined **once** and imported wherever it is needed. Never hard-code a page or API path in a Page Object or a test.

### Key rules

1. **Page paths** live in `PAGE_URLS` (`src/constants/pageurls.ts`).
2. **API paths** live in `API_URLS` (`src/config/urls.ts`).
3. **Paths are relative to `baseURL`** from `playwright.config.ts`. Never include the host or port.
4. **Add the path to the map first** when you cover a new page or endpoint, then reference it by key.
5. **Use the constant everywhere:** in a Page Object's `readonly url`, in `waitForResponse` / `waitForRequest` predicates, in `toHaveURL` checks, and in API requests.

### Structure

| Item       | Convention                                                               |
| ---------- | ------------------------------------------------------------------------ |
| Map        | Plain object exported as `UPPER_SNAKE_CASE`, declared `as const`         |
| Keys       | `camelCase`, named after the page or endpoint (`register`, `login`)      |
| Values     | Path starting with `/`, e.g. `"/register.html"`, `"/api/v1/register"`    |
| Value type | Export a union type of the values (`PageUrl`, `ApiUrl`) for typed params |

### Example

```ts
// ✅ Page Object: URL and API path come from the shared maps
export class RegisterPage extends BasePage {
  readonly url = PAGE_URLS.register;

  waitForRegisterResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (r) =>
        r.url().endsWith(API_URLS.register) && r.request().method() === "POST",
    );
  }
}

// ✅ Test: redirect target comes from the shared map
await expect(page).toHaveURL(PAGE_URLS.login);
```

```ts
// ❌ Hard-coded paths
readonly url = "/register.html";
await expect(page).toHaveURL(/\/login\.html$/);
```
