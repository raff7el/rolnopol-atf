import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPlaywright from "eslint-plugin-playwright";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "package-lock.json",
      "playwright-report/**",
      "test-results/**",
      "blob-report/**",
      "playwright/.cache/**",
      "playwright/.auth/**",
      ".playwright-mcp/**",
      ".ai-temp/**",
    ],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
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
      // Env values are read only through ENV (src/config/env.ts).
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Read environment values through ENV from src/config/env.ts.",
        },
      ],
    },
  },
  {
    files: ["src/config/env.ts"],
    rules: {
      "no-restricted-properties": "off",
    },
  },
  {
    // Page Objects expose locators and values; assertions live in tests.
    // See docs/coding-standards.md ("No assertions in Page Objects").
    files: ["src/pages/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@playwright/test",
              importNames: ["expect"],
              message:
                "Page Objects must not assert. Return a Locator or value and assert in the test.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["tests/**/*.ts", "src/**/*.ts"],
    extends: [eslintPluginPlaywright.configs["flat/recommended"]],
  },
  // Must stay last: turns off rules that would conflict with Prettier.
  eslintConfigPrettier,
]);
