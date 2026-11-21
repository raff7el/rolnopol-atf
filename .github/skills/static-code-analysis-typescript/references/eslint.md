# ESLint flat config (`eslint.config.mjs`)

This example shows:

- ESLint flat config
- `typescript-eslint`
- Playwright lint rules
- Prettier CLI validation kept separate from ESLint
- Import sorting via `eslint-plugin-simple-import-sort`
- Ignored generated folders

```js
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPlaywright from "eslint-plugin-playwright";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["package-lock.json", "playwright-report/**", "test-results/**"] },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-console": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
  eslintPluginPlaywright.configs["flat/recommended"],
  {
    rules: {
      "playwright/no-nested-step": "off",
    },
    settings: {
      playwright: {
        globalAliases: {
          test: ["setup", "health"],
        },
      },
    },
  },
  // Must stay last: turns off rules that conflict with Prettier.
  eslintConfigPrettier,
];
```

**Key design decisions:**

- `simple-import-sort/imports` and `simple-import-sort/exports` enforce consistent import order as an ESLint rule, not a Prettier plugin
- Prettier formatting checks run via `prettier --check` on all files, including `*.ts`; ESLint focuses on code quality and import order
- `eslint-config-prettier` is the **last** entry. It only turns rules off, so anything listed after it (a plugin preset or a custom style rule) could re-enable a formatting rule that conflicts with Prettier. Import the `/flat` entry point for flat config.
- `files: ["**/*.ts"]` sits on the same object as the TypeScript-only rule, so the rule applies to `.ts` files only. A config object that contains only `files` scopes nothing: it just adds those files to the set ESLint lints (typescript-eslint already includes `.ts`), and every other entry still applies to all files
- Playwright `globalAliases` tells the Playwright plugin that `setup` and `health` are valid test functions

**Adapting for non-Playwright repos:**

Remove the Playwright-specific blocks:

```js
// Remove these two blocks:
eslintPluginPlaywright.configs['flat/recommended'],
{
 rules: { 'playwright/no-nested-step': 'off' },
 settings: { playwright: { ... } },
},
```

And remove `eslint-plugin-playwright` from `devDependencies`.
