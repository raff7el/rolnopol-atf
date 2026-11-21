# TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "sourceMap": true,
    "noEmit": true
  }
}
```

**Key design decisions:**

- `module: "ESNext"` — aligns with ESM syntax used throughout TypeScript source files (`import`/`export`). Avoids the inconsistency of targeting modern JS with `target: "ESNext"` while using a legacy module system.
- `moduleResolution: "bundler"` — required when `module` is `"ESNext"`. Without it, TypeScript falls back to `"classic"` resolution which does not understand `node_modules`. The `"bundler"` strategy is the correct choice when TypeScript does not emit code (e.g. `noEmit: true`) and files are processed by a bundler or test runner (Playwright uses ESBuild internally).
- `noEmit: true` — TypeScript is used only for type checking, not code generation.
- Path aliases (`paths`) are optional — only add them when justified by project structure. If used, ensure they are also supported by the test runner.

**Why not `"module": "CommonJS"`?**

Using `"module": "CommonJS"` with `"target": "ESNext"` is a legacy pattern. It causes TS to default to `moduleResolution: "node"` (Node.js CJS algorithm), which works but is semantically incorrect for projects that:

- Use ESM `import`/`export` syntax exclusively
- Never emit code (so the module format is irrelevant for output)
- Are processed by modern tooling (ESBuild, Vite, Playwright)

If migrating from `CommonJS` to `ESNext`, the only required change is adding `"moduleResolution": "bundler"` alongside the module change.
