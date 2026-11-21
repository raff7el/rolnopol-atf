---
name: test-plan-traceability
description: "Keep Playwright tests and docs/test-plan.md in sync. Use when writing or changing a test (pick its scenario ID and tag, link it in the spec), when tagging tests, when checking which scenarios are automated, or when auditing or updating the test plan's Automated coverage table."
argument-hint: "link <scenario ID or test> | audit | sync"
user-invocable: true
disable-model-invocation: false
---

# Test Plan Traceability

Use this skill to keep three things consistent:

1. the **scenario table** in [docs/test-plan.md](../../../docs/test-plan.md#test-scenarios),
2. the **tests** in `tests/**` (their tags and scenario links),
3. the **Automated coverage** table and its summary sentence in the same file.

## When to Use

- "write / add / change a test for AUTH-08" — use **Link** mode
- "which tag should this test have?" — use **Link** mode
- "which scenarios are automated?", "is the test plan up to date?" — use **Audit** mode
- "sync the test plan", "update the coverage table" — use **Sync** mode
- after moving, renaming or deleting spec files — use **Sync** mode

Do not use it for writing test code itself (locators, Page Objects, Arrange /
Act / Assert); those rules live in `.github/copilot-instructions.md` and
`docs/coding-standards.md`.

## Ownership

| Fact                                         | Owner                                                            | Edited by                       |
| -------------------------------------------- | ---------------------------------------------------------------- | ------------------------------- |
| Scenario ID, expected result, priority, tags | Scenario table in `docs/test-plan.md`                            | A human, or with human approval |
| Which scenario a test covers                 | Scenario link comment in the spec                                | Whoever writes the test         |
| Test tags                                    | `tag` option in the spec, copied from the scenario's Tags column | Whoever writes the test         |
| Automated coverage table and summary         | Derived from the two rows above                                  | This skill only (Sync mode)     |

The coverage table is derived data. Never edit it by hand without running the
Sync procedure, because a partial edit is how it drifts.

## Conventions

### Tags

- Copy the scenario's Tags column exactly. One tag: `{ tag: "@ui" }`.
  Several tags: `{ tag: ["@smoke", "@api"] }`.
- Use only the tags the plan defines: `@smoke`, `@api`, `@ui`, `@e2e`, `@flag`.
- If the test's real level differs from the plan (for example the plan says
  `@api` but the only way to check it is through the UI), do not silently pick
  another tag. Report the mismatch and ask the human whether to change the plan.

### Scenario link

Put a line comment directly above the `test(` / `setup(` call, starting with the
scenario ID and followed by why the test is built the way it is:

```ts
// AUTH-14: "John@Doe!" passes the browser's own checks (3-20 chars, no
// `pattern` attribute), so only the app's display-name validation can stop it.
test(
  "rejects a display name with disallowed characters and sends no request",
  { tag: "@ui" },
```

- **Several tests for one scenario in one file** (for example the five SYS-02
  page-load tests): one comment at the top of the file, after the imports.
- **One test covering several scenarios**: list them, `// AUTH-08, FARM-06: ...`.
- **Partial coverage**, when the test checks only part of the expected result:
  `// FARM-03 (partial): <what is not checked yet>`.
- **Supporting tests** that check test infrastructure and map to no scenario
  (for example that a saved session works): `// Supporting: <what it protects>`.
  Audits list them but do not flag them.

### No scenario yet

Do not write a test for behaviour the plan does not describe. Propose a new row
instead: the next free ID in the area (e.g. `AUTH-17`), the expected result
quoted from the [app documentation](http://localhost:3000/docs.html), a
priority and tags. Add it only after the human approves.

## Procedure

### Link mode (one test)

1. Find the scenario row. If there is none, follow [No scenario yet](#no-scenario-yet).
2. Check whether a test for the ID already exists (`grep -rn "<ID>" tests`).
   Extend it rather than adding a duplicate.
3. Take the tag from the row and write the scenario link comment.
4. When the test passes, run **Sync** so the coverage table includes it.

### Audit mode (report only)

1. **Read the plan.** From the scenario table build `ID → priority, tags`. From
   the coverage table build `ID → spec file, test title`.
2. **List the tests.** Run `npx playwright test --list` for titles per project,
   and read each spec under `tests/` for its `tag` option and scenario link
   comment. `grep -rnE "^// ([A-Z]+-[0-9]+|Supporting)" tests` finds the links.
3. **Compare** and classify every difference:

   | Finding       | Meaning                                                         |
   | ------------- | --------------------------------------------------------------- |
   | Stale path    | Coverage row points to a file that moved or no longer exists    |
   | Missing row   | A linked test exists, but the coverage table does not list it   |
   | Orphan row    | Coverage row for a test that no longer exists                   |
   | Unlinked test | Test with no scenario link and no `Supporting` comment          |
   | Unknown ID    | Link to an ID that is not in the scenario table                 |
   | Tag mismatch  | Test tags differ from the scenario's Tags column                |
   | Partial       | Test linked as `(partial)`; say what is still missing           |
   | Wrong summary | Count or missing-P1 note in the summary sentence is out of date |
   | P1 gap        | P1 scenario with no test; call out `@smoke` and `@api` first    |

4. **Report** a table of findings (finding, ID, file, fix) followed by the
   corrected counts. Change no files.

### Sync mode (audit, then fix)

1. Run Audit mode.
2. Add missing scenario link comments to specs. Where a test's scenario is not
   obvious from its title and assertions, ask instead of guessing.
3. Fix tag mismatches only in the direction of the plan, and only when the test
   clearly checks what the scenario describes. Otherwise report and ask.
4. Rebuild the **Automated coverage** table from the links:
   - one row per covered scenario, in the same order as the scenario table;
   - columns `ID | Spec file | Test`, with repo-relative paths in backticks
     (`tests/ui/register.spec.ts`);
   - the exact test title, or a short summary when one file has several tests
     for the ID ("5 page-load tests: ...");
   - partial coverage ends the Test cell with `— partial: <what is missing>`.
5. Below the table, list supporting tests in one sentence, if any.
6. Rewrite the summary sentence above the table: how many of the scenarios are
   fully automated, which are partial, and which P1 `@smoke` scenarios are
   still missing.
7. Do not change scenario rows, priorities or the "As of" date; they record
   what was taken from the app documentation.
8. Run `npm run check` (Prettier aligns the Markdown tables).

## Completion Checklist

- [ ] Every test has a scenario link or a `Supporting` comment
- [ ] Every test's tags match its scenario's Tags column
- [ ] Every coverage row points to an existing file and test title
- [ ] Every linked scenario appears in the coverage table
- [ ] The summary sentence matches the table
- [ ] Any new scenario rows were approved by the human
- [ ] `npm run check` passes

## Example prompts

- "Which tag and scenario ID should the logout test use?"
- "Audit the test plan against the tests."
- "I moved the specs into folders; sync the coverage table."
- "Which P1 scenarios still have no automated test?"
