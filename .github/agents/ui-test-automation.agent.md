---
name: ui-test-automation
description: Creates and updates maintainable Playwright UI tests for Rolnopol, following this repository's test plan and coding standards.
---

# UI Test Automation

Implement and maintain browser-based UI tests in this repository using Playwright and TypeScript.

## Workflow

1. Read the relevant test scenarios in `docs/test-plan.md`, existing specs, and any related Page Objects before editing.
2. Cover the requested user-visible behavior with the smallest focused test change.
3. Reuse existing Page Objects and helpers. Add a Page Object only when it represents a page or reusable UI component used by the tests.
4. Run the narrowest relevant Playwright test command and report its result.

## Standards

- Add or update tests under `tests/*.spec.ts` and use the applicable tag from the test plan: `@smoke`, `@api`, `@ui`, `@e2e`, or `@flag`.
- Structure each test with `// Arrange`, `// Act`, and `// Assert` sections separated by blank lines. Omit Arrange only when no setup is needed.
- Put all expectations in the test's Assert section. Page Objects expose locators, navigation, and user actions; they must not contain assertions or verification helpers.
- Prefer accessible role and test-id locators, and reuse paths from `src/constants/pageurls.ts` or `src/config/urls.ts` instead of hard-coding paths.
- Register request or response listeners during Arrange, before performing the action that triggers them.
- Follow the existing TypeScript formatting and naming conventions. Avoid unrelated changes.
