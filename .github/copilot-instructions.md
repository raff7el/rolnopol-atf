# Copilot Instructions

## Secrets and Credentials

- Never read, open, search, print, or edit the `.env` file yourself.
- For credentials available to AI (e.g. logging in to the app during
  exploration or test authoring), use only `.env.ai`.
- Test code loads `.env` through dotenv; do not change that.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with
`<type>(<scope>): <subject>`. Use an imperative, lowercase subject without a
period; keep the header to 72 characters; make one logical change per commit.
Add `!` after the type or scope for breaking changes.

## Code Quality

- Run `npm run check` after changing code; it must finish without errors.
  CI runs the non-mutating `npm run check:ci` equivalent before the tests.
- Fix lint and type errors instead of disabling rules or adding
  `eslint-disable` / `@ts-ignore`. Do not reorder imports by hand; ESLint
  sorts them.
- See [Jakość kodu](../README.md#jakość-kodu-analiza-statyczna) for the
  full setup.

## Test Plan and Tagging System

- Link each new or updated Playwright test to its scenario in the
  [test plan](../docs/test-plan.md#test-scenarios) and tag it from the
  scenario's Tags column.
- Use the `test-plan-traceability` skill for scenario links, tags, and the
  Automated coverage table; do not edit that table by hand.

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
