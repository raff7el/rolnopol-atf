# Copilot Instructions

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with
`<type>(<scope>): <subject>`. Use an imperative, lowercase subject without a
period; keep the header to 72 characters; make one logical change per commit.
Add `!` after the type or scope for breaking changes.

## Test Plan and Tagging System

- Tag each new or updated Playwright test with the appropriate tag from the
  [test plan](../docs/test-plan.md#test-approach).
- Keep tag guidance synchronized between the test plan and this file.

## Test Structure (Arrange / Act / Assert)

Separate each test into `// Arrange`, `// Act`, and `// Assert` blocks with blank
lines between them. Arrange setup and listeners before the action; keep all
expectations in Assert. Omit Arrange when there is no setup.

## Page Objects

- Page Objects (`src/pages/*.page.ts`) expose locators, navigation, and actions;
  do not put assertions or verification helpers in them.
- Keep verifications in test files (`tests/*.spec.ts`) under Assert. Return the
  values tests need to check.
- Follow the [Page Object conventions](../docs/coding-standards.md#page-object-pattern).
