# `package.json` quality section and Husky hook

## `package.json`

This example mirrors the recommended architecture:

- Full-project lint and format
- Non-mutating CI checks
- Staged-file formatting/linting
- Explicit Node engine
- Direct `typescript` dependency

```json
{
  "scripts": {
    "check": "npm run format && npm run lint && npm run tsc:check",
    "check:ci": "npm run format:check && npm run lint && npm run tsc:check",
    "format": "npx prettier --write .",
    "format:check": "npx prettier --check .",
    "lint": "npx eslint . --max-warnings=0",
    "lint-staged": "npx lint-staged",
    "tsc:check": "npx tsc --noEmit --pretty --strict"
  },
  "engines": {
    "node": "^20.19.0 || ^22.13.0 || >=24"
  },
  "lint-staged": {
    "*.ts": [
      "npx eslint --fix --max-warnings=0 --no-warn-ignored",
      "npx prettier --write"
    ],
    "*.{json,md,mjs,yml,yaml}": "npx prettier --write"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "eslint": "^10.0.3",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-playwright": "^2.10.1",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "globals": "^17.4.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.4.0",
    "prettier": "3.8.1",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.57.1"
  }
}
```

**`format:check` must cover the same files as `format`.** In this setup (Model A) no ESLint rule checks formatting, so the Prettier CLI is the only formatting check for `*.ts`. A non-TS glob such as `"**/*.{json,md,mjs,yml,yaml}"` would leave TypeScript formatting unchecked in CI. Use a non-TS glob only with `eslint-plugin-prettier` (Model B), and then name the script `format:check:non-ts` so the split is visible.

**Script naming conventions:**

| Script         | Purpose                                 | Mutates files?  | Use in CI? |
| -------------- | --------------------------------------- | --------------- | ---------- |
| `check`        | Local aggregate: format + lint + tsc    | Yes (`--write`) | No         |
| `check:ci`     | CI aggregate: format:check + lint + tsc | No              | Yes        |
| `format`       | Apply Prettier formatting               | Yes             | No         |
| `format:check` | Validate formatting                     | No              | Yes        |
| `lint`         | Run ESLint (includes import sort)       | No              | Yes        |
| `lint-staged`  | Staged-file checks                      | Yes (fix mode)  | No         |
| `tsc:check`    | TypeScript type checking                | No              | Yes        |

## Husky hook (`.husky/pre-commit`)

```sh
npm run lint-staged
npm run tsc:check
```
