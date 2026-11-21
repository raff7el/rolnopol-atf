# VS Code (`.vscode/settings.json`, `.vscode/extensions.json`)

## `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**Important:** Do NOT add `"source.organizeImports": "explicit"` to `codeActionsOnSave`.
VS Code's built-in organize imports conflicts with ESLint-based import sorting (`eslint-plugin-simple-import-sort`), causing competing re-orderings on save. Let ESLint handle import order via `lint-staged` on commit and the VS Code ESLint extension in real time.

## `.vscode/extensions.json`

Recommended extensions for this style of repo:

```json
{
  "recommendations": [
    "ms-playwright.playwright",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "streetsidesoftware.code-spell-checker"
  ]
}
```
