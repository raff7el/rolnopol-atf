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
