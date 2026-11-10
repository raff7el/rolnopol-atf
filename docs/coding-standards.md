# Coding Standards

## Page Object Pattern

Page Objects describe **what is on a page and what a user can do there**. Tests decide **what the result should be**.

### Key rules

1. **No assertions in Page Objects.** No `expect`, no `import { expect }`, and no `verify*` / `assert*` / `should*` helpers.
2. **All verifications live in test files** (`tests/*.spec.ts`), inside the `// Assert` block.
3. **Return what the test needs to check.** Expose a `Locator`, a value, or a `Promise<Response>` and let the test assert on it.

### Structure

| Item         | Convention                                                                |
| ------------ | ------------------------------------------------------------------------- |
| Location     | `src/pages/<name>.page.ts`                                                |
| Class name   | `<Name>Page`, e.g. `RegisterPage`                                         |
| Base class   | Extends `BasePage` (`src/pages/base.page.ts`), which holds shared logic   |
| Constructor  | Takes `page: Page`, calls `super(page)`; defines all static locators      |
| Page URL     | `readonly url` constant; navigate with the inherited `goto()`             |
| Locators     | `readonly` fields; prefer `getByTestId` / `getByRole` over CSS selectors  |
| Dynamic ones | Methods that return a `Locator`, e.g. `notification(message)`             |
| Actions      | `async` methods named after user intent (`fillForm`, `submit`)            |
| Input data   | Typed object parameter (e.g. `RegistrationData`) instead of many args     |

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
