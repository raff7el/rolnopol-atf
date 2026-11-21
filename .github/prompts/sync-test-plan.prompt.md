---
name: sync-test-plan
description: Audit docs/test-plan.md against the implemented tests and, if asked, update its Automated coverage table.
---

Use the `test-plan-traceability` skill in **Audit** mode: compare the test
plan's scenario and Automated coverage tables with the tests under `tests/`
and report every finding with its fix.

Change files only if the user asks for a sync; then switch to **Sync** mode.
