---
name: static-code-analysis-typescript
description: "Create, review, or modernize static code analysis for Node.js and TypeScript repositories. Use for ESLint flat config, typescript-eslint, TypeScript/tsconfig, Prettier split, import sorting, Husky, lint-staged, package.json scripts, engines, naming conventions, CI quality gates, and GitHub Actions workflows."
argument-hint: "Repository type, current tooling, and target quality gate"
user-invocable: true
disable-model-invocation: false
---

# Static Code Analysis for TypeScript Projects

Use this skill when you need to create, review, fix, or modernize static code analysis in a Node.js + TypeScript repository.

It is designed for repositories that use or should use:

- `eslint` (flat config)
- `typescript-eslint`
- `typescript`
- `tsconfig.json`
- `prettier`
- `eslint-plugin-simple-import-sort` (import sorting via ESLint)
- `husky`
- `lint-staged`
- `package.json` scripts
- CI quality gates (GitHub Actions)

## When to Use

Use this skill when the user asks things like:

- "set up static analysis for TypeScript"
- "add ESLint / typescript-eslint / Prettier"
- "review our lint, tsc, husky, or lint-staged setup"
- "fix package.json scripts for code quality"
- "prepare CI checks for linting and type checking"
- "standardize naming for static code analysis scripts"
- "audit whether this repo follows current best practices"
- "set up import sorting"
- "replace trivago import sorting plugin"
- "add a CI quality gate workflow"

## Goals

This skill should help produce a setup that is:

- explicit
- reproducible
- CI-friendly
- fast enough for local development
- strict enough to catch issues early
- easy to understand from `package.json`, `README.md`, and the config files
- portable across Playwright, Cypress, and general TypeScript projects

## Recommended Outcome

A strong baseline should usually include:

- ESLint flat config (`eslint.config.mjs`)
- `typescript-eslint` for TypeScript-aware linting
- direct `typescript` dependency when `tsc` is used directly
- strict `tsconfig.json`
- clear split between formatting and linting responsibilities
- import sorting via ESLint (`eslint-plugin-simple-import-sort`)
- `husky` hook for local guardrails
- `lint-staged` for staged-file workflows
- CI commands that do not mutate files
- explicit Node version support in `package.json#engines`
- GitHub Actions workflow for quality gate

---

## Example Configs

Baseline configs for repositories similar to this one live in `references/`.
Load only the file for the tool you are changing.

| File                                                     | Contains                                                                                     | Load when                                       |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [references/eslint.md](references/eslint.md)             | `eslint.config.mjs`, design decisions, adapting for non-Playwright repos                     | Creating or changing the ESLint config          |
| [references/package-json.md](references/package-json.md) | Scripts, `engines`, `lint-staged`, devDependencies, script naming table, `.husky/pre-commit` | Changing scripts, hooks, or dependencies        |
| [references/prettier.md](references/prettier.md)         | `.prettierrc.json`, `.prettierignore`                                                        | Creating or changing Prettier config            |
| [references/tsconfig.md](references/tsconfig.md)         | `tsconfig.json`, why `ESNext` + `bundler` instead of `CommonJS`                              | Creating or reviewing `tsconfig.json`           |
| [references/vscode.md](references/vscode.md)             | `.vscode/settings.json`, `.vscode/extensions.json`                                           | Changing editor save actions or recommendations |
| [references/ci-workflows.md](references/ci-workflows.md) | `quality` job for an existing pipeline, standalone fallback workflow                         | Adding or reviewing the CI quality gate         |

---

## Import Sorting

### Recommended approach: `eslint-plugin-simple-import-sort`

Import sorting belongs in ESLint, not in Prettier. The recommended plugin is `eslint-plugin-simple-import-sort`.

**Why ESLint-based import sorting is preferred:**

1. **Clean separation of concerns** — Prettier handles formatting (whitespace, quotes, semicolons); ESLint handles code quality and structure (including import order)
2. **Auto-fixable** — `eslint --fix` sorts imports, which integrates naturally with `lint-staged`
3. **No Prettier plugin complexity** — Prettier plugins for import sorting add a parser layer (often Babel-based) that can be slow, fragile, or incompatible with newer Prettier versions
4. **No VS Code conflicts** — Prettier import sorting plugins fight with VS Code's `source.organizeImports`; ESLint-based sorting does not
5. **Future-proof** — No coupling to Prettier's plugin API changes; ESLint plugin API is stable
6. **Lightweight** — `eslint-plugin-simple-import-sort` has zero dependencies and works with ESLint >=5

**Setup:**

1. Install: `npm install -D eslint-plugin-simple-import-sort`
2. Add to `eslint.config.mjs`:

```js
import simpleImportSort from 'eslint-plugin-simple-import-sort';

// Inside the config array:
{
 plugins: {
   'simple-import-sort': simpleImportSort,
 },
 rules: {
   'simple-import-sort/imports': 'error',
   'simple-import-sort/exports': 'error',
 },
},
```

3. Remove any Prettier import sorting plugins and their config options from `.prettierrc.json`
4. Remove `source.organizeImports` from `.vscode/settings.json` if present

**Default behavior:** Groups imports into: external packages → scoped packages → path aliases → relative imports. This works well out of the box for most TypeScript projects.

### Decision tree: choosing an import sorting strategy

```
Do you need import sorting?
├── No → Skip (but consider adding it for consistency)
└── Yes
   ├── Is the project new or being set up fresh?
   │   └── Use eslint-plugin-simple-import-sort (recommended)
   ├── Does the project already use @trivago/prettier-plugin-sort-imports?
   │   ├── Is there a strong reason to keep it?
   │   │   └── Keep it, but document that it uses Babel parser
   │   │       and has no Prettier 4 support
   │   └── Otherwise → migrate to eslint-plugin-simple-import-sort
   ├── Does the project already use @ianvs/prettier-plugin-sort-imports?
   │   └── Acceptable — it uses TS parser and supports Prettier 4
   │       Consider migrating to ESLint-based sorting for cleaner separation
   └── Does the project use eslint-plugin-perfectionist?
       └── Acceptable for teams wanting broader sorting (objects, types, enums)
           But overkill if only import sorting is needed
```

### Migrating from `@trivago/prettier-plugin-sort-imports`

1. Uninstall: `npm uninstall @trivago/prettier-plugin-sort-imports`
2. Install: `npm install -D eslint-plugin-simple-import-sort`
3. Remove from `.prettierrc.json`:
   - `"plugins": ["@trivago/prettier-plugin-sort-imports"]`
   - `"importOrder"` / `"importOrderSeparation"` / `"importOrderSortSpecifiers"` / any `importOrder*` options
4. Add ESLint rules (see setup above)
5. Remove `"source.organizeImports"` from `.vscode/settings.json`
6. Run `npx eslint . --fix` to re-sort all imports
7. Verify with `npx eslint . --max-warnings=0`

### Migrating from `@ianvs/prettier-plugin-sort-imports`

Same steps as trivago migration. Remove `"plugins"` and any `importOrder*` options from `.prettierrc.json`.

---

## Procedure

### 1. Inspect the existing setup

Check at least these files when they exist:

- `package.json`
- `eslint.config.*` (or legacy `.eslintrc*`)
- `tsconfig.json`
- `.prettierrc*`
- `.prettierignore`
- `.husky/*`
- `.github/workflows/*`
- `.vscode/settings.json`
- `.vscode/extensions.json`
- `README.md`
- any existing audit or decision documents

Identify:

- what tools are already installed
- whether the repo uses flat config or legacy ESLint config
- whether `typescript` is direct or transitive
- whether `tsc` is used as a real gate
- whether `prettier` is standalone, inside ESLint, or split by file type
- whether commit hooks validate the whole repo or only staged files
- whether CI enforces the same checks as local hooks
- how import sorting is handled (Prettier plugin, ESLint plugin, VS Code, or not at all)
- whether VS Code `source.organizeImports` could conflict with other import sorting

### 2. Classify the current architecture

Choose the current model before editing anything:

#### Model A — Separate responsibilities

- ESLint for code quality
- Prettier for formatting
- `prettier --check` used directly
- `eslint-config-prettier` used to avoid rule conflicts

#### Model B — ESLint also enforces Prettier in TypeScript

- `eslint-plugin-prettier` runs formatting checks inside ESLint
- often paired with a separate Prettier CLI check for non-TS files

#### Model C — Mixed or inconsistent

- scripts overlap
- responsibilities are unclear
- TS formatting may be checked twice or not clearly at all

When possible, make the final state explicit in docs so the split is understandable.

### 3. Normalize dependency expectations

For TypeScript repositories, prefer these principles:

- if the repo runs `tsc`, add `typescript` directly in `devDependencies`
- if ESLint is used, make the config style explicit and modern (flat config)
- if `typescript-eslint` is installed, ensure versions are compatible with ESLint and TypeScript
- if tooling requires newer Node versions, declare them in `package.json#engines`

If a legacy `.eslintrc*` file is found, migrate it to `eslint.config.mjs` using flat config. Remove the legacy file and any `eslintConfig` key in `package.json`, then run `npx eslint . --max-warnings=0` to confirm the migration.

Typical direct dev dependencies may include:

- `eslint`
- `@eslint/js`
- `typescript-eslint`
- `typescript`
- `prettier`
- `eslint-config-prettier`
- `eslint-plugin-simple-import-sort`
- optionally repo-specific plugins such as `eslint-plugin-playwright`
- `globals`
- `husky`
- `lint-staged`

If the repository contains Playwright tests, strongly consider:

- `eslint-plugin-playwright`
- Playwright-specific rule tuning in ESLint
- ignoring generated Playwright artifacts such as `playwright-report/**` and `test-results/**`

### 4. Assess import sorting

Check how imports are currently sorted:

- **No sorting** → add `eslint-plugin-simple-import-sort`
- **`@trivago/prettier-plugin-sort-imports`** → migrate to `eslint-plugin-simple-import-sort` (Babel parser, no Prettier 4 support)
- **`@ianvs/prettier-plugin-sort-imports`** → consider migrating for cleaner separation
- **`eslint-plugin-simple-import-sort`** → already optimal
- **`eslint-plugin-perfectionist`** → acceptable if broader sorting rules are wanted
- **VS Code `source.organizeImports`** → remove if any other import sorting tool is active; it conflicts

After migration, run `npx eslint . --fix` to normalize all imports, then verify with `npx eslint . --max-warnings=0`.

### 5. Normalize script naming in `package.json`

Example: [references/package-json.md](references/package-json.md) (scripts and the script naming table).

Prefer predictable script names.

Recommended naming:

- `lint` → runs ESLint in non-fix mode and should fail on warnings if that is the chosen policy
- `format` → mutating formatter run, usually `prettier --write`
- `format:check` → non-mutating formatting validation
- `tsc:check` → `tsc --noEmit`
- `check` → aggregate quality command (local, may mutate)
- `check:ci` → aggregate quality command (CI, non-mutating)
- `lint-staged` → entrypoint for staged-file validation

Guidelines:

- commands used in CI should not mutate files
- provide both `check` (local, with `--write`) and `check:ci` (CI, with `--check`)
- if the repo intentionally splits non-TS and TS formatting, make that explicit with names such as:
  - `format:check`
  - `format:check:non-ts`

### 6. Decide how formatting should work

Make one of the following explicit:

#### Preferred modern baseline

- Prettier CLI validates formatting
- ESLint handles code-quality rules
- `eslint-config-prettier` disables formatting-conflicting lint rules

#### Acceptable intentional split

- TypeScript files are checked via ESLint + `eslint-plugin-prettier`
- non-TypeScript files are checked by `prettier --check`
- docs clearly explain the split

Avoid leaving the repo in a state where it is unclear whether `*.ts` files are:

- checked by Prettier CLI
- checked by ESLint
- checked twice
- or not checked consistently

### 7. Validate TypeScript configuration

Example: [references/tsconfig.md](references/tsconfig.md).

For `tsconfig.json`, prefer:

- `strict: true`
- `module: "ESNext"` when the project uses ESM `import`/`export` syntax (which is the default for modern TypeScript projects)
- `moduleResolution: "bundler"` — **required** when `module` is `"ESNext"` and TypeScript does not emit code. Without this, TS falls back to `"classic"` resolution which cannot resolve `node_modules`
- `noEmit: true` when TypeScript is used only for type checking
- Add `paths` only if the same alias prefix (for example `@app/*`) is imported from 3 or more directories and the test runner resolves it. Otherwise omit `baseUrl` and `paths`.
- alignment between runtime/module system and test/tooling needs

**Common mistake:** Using `"module": "CommonJS"` with `"target": "ESNext"`. This is semantically inconsistent — the project writes ESM but tells TypeScript to resolve modules as CJS. While it works (because `noEmit` means no output), it limits TypeScript's understanding of ESM-specific features and defaults to the older `"node"` resolution algorithm.

If the repo uses path aliases, confirm they are supported consistently by:

- TypeScript
- runtime/test tooling
- editor tooling

### 8. Set up Husky and lint-staged correctly

Example: [references/package-json.md](references/package-json.md) (`lint-staged` and `.husky/pre-commit`).

Recommended pattern:

- `lint-staged` handles staged-file formatting and fixable lint checks (including import sorting)
- full-project `tsc:check` may still run in `pre-commit` or `pre-push`, depending on repo size and tolerance for slower hooks

Good staged-file mapping examples:

- `*.ts` → `eslint --fix --max-warnings=0 --no-warn-ignored`, then `prettier --write` (ESLint auto-sorts imports and fixes lint issues; Prettier formats the result)
- `*.{json,md,yml,yaml,mjs}` → `prettier --write`

**Order matters: run `eslint --fix` before `prettier --write`.** `simple-import-sort` reorders import specifiers but does not normalize the whitespace around them (`import { test, expect }` becomes `import { expect,test }`), so it relies on a formatter running afterwards. If Prettier runs first, every commit that triggers a re-sort stores unformatted code and `format:check` fails in CI. The same order applies to any local script that runs `eslint --fix` together with `prettier --write` (e.g. `eslint . --fix && prettier --write .`) and to VS Code (`source.fixAll.eslint` in `codeActionsOnSave` runs before `formatOnSave`).

**Why `--no-warn-ignored`:** lint-staged passes explicit file paths. ESLint warns when an explicitly passed file matches its `ignores`, and `--max-warnings=0` turns that warning into a failed commit.

Also review ignored outputs so formatters and linters do not waste time on generated artifacts.

Guidelines:

- use `lint-staged` for fast local feedback
- avoid running whole-repo ESLint in pre-commit if staged-only checks are enough
- If `npm run tsc:check` takes longer than 30 seconds on a typical developer machine, move it from pre-commit to pre-push.

### 9. Define CI quality gates

Example: [references/ci-workflows.md](references/ci-workflows.md).

A minimal CI quality job should:

1. Install dependencies reproducibly (`npm ci`)
2. `npm run format:check`
3. `npm run lint`
4. `npm run tsc:check`

#### Pipeline discovery strategy (IMPORTANT)

**Always prefer integrating quality checks into an existing CI workflow rather than creating a separate one.**

Follow this procedure:

1. **Search for existing workflows** — look in `.github/workflows/` for any existing CI pipeline (e.g. `playwright-e2e-tests.yml`, `ci.yml`, `test.yml`, `build.yml`, etc.)
2. **If a main pipeline exists** — add a `quality` job to that workflow. This keeps all CI checks in one place, avoids duplicated triggers, and makes the pipeline status easier to track in pull requests. The quality job should run **before** the test job using `needs: quality` dependency, so tests only run after code quality checks pass.
3. **Only if NO existing pipeline is found** — create a new workflow at `.github/workflows/quality.yml` using the standalone example in [references/ci-workflows.md](references/ci-workflows.md).

**Why integrate rather than separate?**

- A single workflow provides one status check in PRs instead of multiple
- Shared triggers and concurrency settings reduce configuration drift
- The `needs` dependency ensures tests don't waste CI minutes on code that fails basic quality checks
- Teams have a single place to understand the full CI pipeline

CI principles:

- use non-mutating commands only
- do not rely solely on local hooks — CI is the authoritative gate
- keep CI aligned with local script names
- fail loudly on configuration drift
- use `permissions: contents: read` for least-privilege
- cache `npm` dependencies for speed
- matrix test against every major Node version declared in `engines.node`

### 10. Update documentation

Always reflect the final design in docs.

At minimum, update:

- `README.md`
- audit/report docs if they exist
- optionally decision logs
- `.vscode/settings.json` recommendations when editor behavior is part of the workflow

Document clearly:

- required Node version
- what each quality script does
- whether TS formatting is checked by ESLint or Prettier CLI
- how import sorting works (ESLint-based, not Prettier plugin)
- what Husky runs on commit
- what CI runs
- what files are ignored by Prettier / ESLint and why

### 11. Verify and report

After editing, verify:

- `npm run lint` — passes with zero warnings
- `npm run format:check` — passes
- `npm run tsc:check` — passes
- `npm run lint-staged` — exits cleanly (may report nothing staged)

The final report should distinguish between:

- configuration problems
- dependency problems
- code-quality violations in the current codebase

---

## Decision Rules

### Prefer adding `typescript` directly when:

- `tsc` is invoked from `package.json`
- the repo depends on TypeScript version stability
- the current install works only because of a transitive dependency

### Prefer adding `engines.node` when:

- one or more key tools require a newer Node version
- the README requirement is vague or outdated
- the project is team-shared or CI-managed

### Prefer `lint-staged` when:

- the repo uses Husky
- pre-commit currently runs whole-repo checks that are unnecessarily slow
- the user wants local quality guardrails without painful commit latency

### Prefer `eslint-plugin-simple-import-sort` when:

- setting up a new repo from scratch
- migrating away from `@trivago/prettier-plugin-sort-imports` (Babel parser, no Prettier 4 support)
- the team wants clean separation of concerns (formatting ≠ code structure)
- VS Code `source.organizeImports` is causing conflicts

### Allow `@ianvs/prettier-plugin-sort-imports` when:

- the repo already uses it and it works well
- the team prefers regex-based import grouping over ESLint rules
- the project has complex import order requirements that benefit from explicit regex patterns

### Avoid `@trivago/prettier-plugin-sort-imports` in new projects because:

- it uses a Babel-based parser internally (slower, less TypeScript-aware)
- it only supports Prettier 2.x–3.x (no Prettier 4 support)
- it conflicts with VS Code's `source.organizeImports`
- `@ianvs/prettier-plugin-sort-imports` is a strictly better fork (TS parser, Prettier 4 support)

### Prefer separate Prettier CLI over ESLint-plugin-Prettier when:

- setting up a new repo from scratch
- performance and simplicity matter
- the team wants the current mainstream recommendation from Prettier docs

### Allow `eslint-plugin-prettier` when:

- the repo already uses it intentionally
- it is part of a documented TS/non-TS split
- changing the model would create unnecessary churn right now

### Prefer a CI workflow when:

- the repo is team-shared or has multiple contributors
- quality enforcement should not depend on individual developer hooks
- the project uses pull requests
- even for solo projects, CI catches hook-bypass scenarios (`--no-verify`)

---

## Quick Setup from Scratch

For setting up a new Playwright + TypeScript project with full static analysis, run these commands:

```bash
# 1. Initialize and install core dependencies
npm init -y
npm install -D @playwright/test typescript

# 2. Install static analysis tools
npm install -D eslint @eslint/js typescript-eslint globals
npm install -D prettier eslint-config-prettier
npm install -D eslint-plugin-simple-import-sort
npm install -D eslint-plugin-playwright
npm install -D husky lint-staged

# 3. Initialize Husky
npx husky init

# 4. Create config files using the examples in references/:
# - eslint.config.mjs
# - .prettierrc.json
# - .prettierignore
# - tsconfig.json
# - .husky/pre-commit
# - .vscode/settings.json
# - .vscode/extensions.json

# 5. CI quality gate:
#    - If .github/workflows/ already has a CI pipeline → add quality job there
#    - If no pipeline exists → create .github/workflows/quality.yml

# 6. Add scripts to package.json (see references/package-json.md)

# 7. Verify
npm run lint
npm run format:check
npm run tsc:check
```

---

## Troubleshooting

### `source.organizeImports` fights with import sorting

**Symptom:** Imports keep re-ordering on every save, causing unstaged changes.
**Cause:** VS Code's built-in `source.organizeImports` and an ESLint/Prettier import sorting plugin produce different orderings.
**Fix:** Remove `"source.organizeImports"` from `.vscode/settings.json`. Let ESLint handle import order.

### ESLint reports `simple-import-sort/imports` errors after migration

**Symptom:** Many import order errors after switching from a Prettier plugin.
**Fix:** Run `npx eslint . --fix` once to normalize all imports, then commit.

### `format:check` fails after `eslint --fix` or after a commit

**Symptom:** Files touched by `eslint --fix` (or committed through lint-staged) fail `prettier --check`, often with imports like `import { expect,test } from "@playwright/test"`.
**Cause:** `simple-import-sort` reorders specifiers without fixing spacing. Prettier ran before ESLint (or not at all) in lint-staged or a local fix script.
**Fix:** Run ESLint first, then Prettier: put `eslint --fix` before `prettier --write` in lint-staged and in any local script that runs both. Repair the existing files with `npx eslint . --fix && npx prettier --write .`.

### `format:check` passes but `lint` fails on Prettier issues

**Symptom:** TypeScript files have formatting issues caught by ESLint but not by `format:check`.
**Cause:** If using Model B (`eslint-plugin-prettier`) and `format:check` targets only non-TS globs, TS formatting is checked by ESLint.
**Fix:** This is expected behavior in Model B. Run `npx eslint . --fix` to fix TS formatting.

### `tsc:check` fails but ESLint passes

**Symptom:** Type errors in `tsc --noEmit` that ESLint doesn't catch.
**Cause:** ESLint with `tseslint.configs.recommended` does not enable type-checked rules.
**Fix:** Both checks are needed. For stricter linting, consider upgrading to `tseslint.configs.recommendedTypeChecked` with `parserOptions.projectService: true`.

### Pre-commit hook is slow

**Symptom:** Commits take too long due to `tsc:check` running on every commit.
**Fix:** Move `tsc:check` from pre-commit to pre-push, or rely on CI for type checking. Keep `lint-staged` in pre-commit for fast feedback.

---

## Completion Checklist

A task using this skill is complete when:

- [ ] Dependency declarations are explicit (no transitive reliance)
- [ ] Script names are clear and consistent
- [ ] `check:ci` exists as a non-mutating aggregate command
- [ ] Formatting responsibility is understandable and documented
- [ ] Import sorting is handled by ESLint, not Prettier plugins
- [ ] `typescript` and Node requirements are documented in `engines`
- [ ] Husky and `lint-staged` are aligned
- [ ] Every fixing flow runs `eslint --fix` before `prettier --write` (lint-staged, local fix scripts, VS Code save actions)
- [ ] CI runs the quality checks — as a `quality` job in the existing pipeline, or in `.github/workflows/quality.yml` only if no pipeline exists
- [ ] `.vscode/settings.json` does not have `source.organizeImports` conflicting with ESLint import sorting
- [ ] Docs (`README.md`) match the actual setup
- [ ] Verification results are recorded (`lint`, `format:check`, `tsc:check` all pass)

---

## Example prompts

- `/static-code-analysis-typescript review this repo and standardize eslint, typescript, husky, lint-staged, and CI scripts`
- `/static-code-analysis-typescript create a modern static analysis setup for a Node + TypeScript test repository`
- `/static-code-analysis-typescript explain whether TS formatting should be handled by eslint-plugin-prettier or prettier --check in this project`
- `/static-code-analysis-typescript migrate from @trivago/prettier-plugin-sort-imports to eslint-plugin-simple-import-sort`
- `/static-code-analysis-typescript add a CI quality gate workflow for GitHub Actions`
- `/static-code-analysis-typescript set up import sorting for a Playwright project`
