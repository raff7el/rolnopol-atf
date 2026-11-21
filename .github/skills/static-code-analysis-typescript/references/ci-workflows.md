# CI quality gate (GitHub Actions)

## Integrated into an existing pipeline (PREFERRED)

When the repository already has a CI workflow (e.g. for Playwright tests), add a `quality` job to that workflow and make the test job depend on it:

```yaml
jobs:
  quality:
    name: Lint, Format & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format:check

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run tsc:check

  test:
    needs: quality
    # ... existing test job configuration ...
```

**Key integration points:**

- The `quality` job is added as a **separate job** within the same workflow
- The existing test job gets `needs: quality` — tests only run after quality checks pass
- Shared workflow triggers (`on:`) and `concurrency` settings apply to both jobs
- No need for duplicate `permissions`, `on`, or `concurrency` blocks

## Standalone workflow (FALLBACK)

Use this only when the repository has **no existing CI workflow** to integrate into:

```yaml
name: Quality Gate

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  quality:
    name: Lint, Format & Type Check
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20, 22, 24]
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format:check

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run tsc:check
```

**CI design principles:**

- Every command is non-mutating — no `--write` or `--fix`
- `npm ci` ensures reproducible installs
- Steps are separate for clear failure diagnosis
- Node version matches `engines.node` from `package.json`
- `permissions: contents: read` follows least-privilege principle
- **Prefer integrating into an existing pipeline** — only use a standalone workflow as a fallback
