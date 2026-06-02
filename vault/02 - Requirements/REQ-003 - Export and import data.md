---
type: requirement
id: REQ-003
title: Export and import data
status: draft
priority: low
created: 2026-06-02
issues: []
---

# REQ-003 — Export and import data

## Problem / opportunity
Zenith is local-first, so a user's data lives only in their browser. They need a way to
back it up and move it between devices.

## Desired outcome
One button downloads all habits as a JSON file; another imports a previously-exported file.

## Scope
- `serialize(habits)` / `deserialize(json)` pure helpers with validation.
- Export button → downloads `zenith-backup.json`.
- Import button → file picker → replaces current data after a confirm.

## Acceptance criteria
- [ ] Round-trip `deserialize(serialize(habits))` deep-equals the input (tested).
- [ ] `deserialize` rejects malformed input gracefully (tested).
- [ ] UI export/import works in the browser.
- [ ] `npm test` and `npm run build` pass.

---
> Set `status: ready` when you want the pipeline to build this.
