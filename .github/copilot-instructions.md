# Copilot Instructions

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <subject>
```

**Types:** `feat`, `fix`, `test`, `refactor`, `docs`, `style`, `chore`, `ci`, `build`, `perf`, `revert`

**Scope** (optional): affected area, e.g. `smoke`, `pages`, `fixtures`, `config`, `deps`, `vscode`, `github`

**Rules:**

- Imperative mood, lowercase, no trailing period ("add test", not "Added test.")
- Header max 72 characters
- One logical change per commit
- Breaking change: add `!` after type/scope, e.g. `refactor(fixtures)!: rename userFixture`

**Examples:**

```
test(smoke): add navigation test for registration link
fix(pages): use role-based locator for login button
chore(deps): bump @playwright/test to 1.48.0
docs(github): add conventional commit instructions
```

## Test Plan and Tagging System

- When creating or updating Playwright tests, add the appropriate `@smoke`, `@api`, `@ui`, `@e2e`, or `@flag` tag as defined in the [test plan](../docs/test-plan.md#test-approach).
- Keep the tag guidance in the test plan and this reference synchronized whenever the available tags or their usage change.

## Test Structure (Arrange / Act / Assert)

Structure every Playwright test body with `// Arrange`, `// Act`, and `// Assert` comments, each followed by its block and separated by a blank line.

- **Arrange**: test setup, such as timeouts, test data, navigation to the starting page, form filling, and response/event listeners (e.g. `page.waitForResponse`) that must be registered before the action.
- **Act**: the single action under test, such as a submit click or a `page.goto` when loading the page is itself the behavior under test.
- **Assert**: all expectations, including awaiting promises set up in Arrange and checking their results.
- Omit `// Arrange` when there is no setup (e.g. smoke tests whose only step is navigation).

## Page Objects

- Page Objects (`pages/*.page.ts`) expose locators, navigation, and actions only. Never include assertions in them: no `expect`, no `import { expect }`, and no `verify*`/`assert*`/`should*` helpers.
- Keep all verifications in the test files (`tests/*.spec.ts`), under the `// Assert` block.
- To support an assertion, return the value the test needs (e.g. a `Locator` or a `Promise<Response>`) and let the test check it.
