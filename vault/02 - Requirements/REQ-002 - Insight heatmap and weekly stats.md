---
type: requirement
id: REQ-002
title: Insight — heatmap and weekly stats
status: ready
priority: medium
created: 2026-06-02
issues: []
---

# REQ-002 — Insight: heatmap and weekly stats

## Problem / opportunity
Streaks show *now*; users also want to see the shape of the last few weeks to spot
patterns ("I always skip weekends").

## Desired outcome
A compact 30-day heatmap per habit and a "done X of last 7 days" summary.

## Scope
- `completionsInRange(habit, fromDay, toDay)` pure helper.
- `last7Count(habit, today)` → number completed in the trailing 7 days.
- A small CSS-grid heatmap of the last 30 days in the UI.

## Acceptance criteria
- [ ] Pure helpers in `src/habits.ts` with tests.
- [ ] UI renders a 30-cell heatmap and a "X / 7 this week" label.
- [ ] `npm test` and `npm run build` pass.

---
> Set `status: ready` when you want the pipeline to build this.
