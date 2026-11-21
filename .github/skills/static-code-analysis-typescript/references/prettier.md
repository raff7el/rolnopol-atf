# Prettier (`.prettierrc.json`, `.prettierignore`)

## `.prettierrc.json`

```json
{
  "singleQuote": false,
  "endOfLine": "auto",
  "tabWidth": 2,
  "semi": true
}
```

**Important:** Import sorting is NOT configured in Prettier.
Use `eslint-plugin-simple-import-sort` in ESLint instead.
See [Import Sorting](../SKILL.md#import-sorting) in the skill for the rationale.

## `.prettierignore`

Use ignore patterns for generated and heavy output folders.

```txt
package-lock.json
playwright-report
test-results
tmp
```
