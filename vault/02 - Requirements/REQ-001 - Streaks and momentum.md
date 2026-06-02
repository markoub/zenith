---
type: requirement
id: REQ-001
title: Streaks and momentum
status: draft          # 🎬 DEMO: flip this to `ready`, commit & push to wake the pipeline
priority: high
created: 2026-06-02
issues: []
---

# REQ-001 — Streaks and momentum

## Problem / opportunity
Right now a user can mark a habit done today, but nothing rewards consistency. The whole
point of Zenith (see [[../01 - Product Vision/Zenith Vision]]) is that **momentum is the
product**. People keep habits when they can *see* their streak growing.

## Desired outcome
When I look at a habit I can instantly see how many days in a row I've kept it, and I get
a small visual reward (a 🔥 badge) once I'm on a roll.

## Scope
- A **current streak**: number of consecutive days ending today (or yesterday, if today
  isn't done yet) that the habit was completed.
- A **best streak**: the longest run the habit has ever had.
- Show the current streak next to each habit in the UI, with a 🔥 badge at 3+ days.

## Out of scope
- Heatmaps and weekly stats (that's [[REQ-002 - Insight heatmap and weekly stats|REQ-002]]).
- Notifications / reminders.

## Acceptance criteria
- [ ] `currentStreak(habit, today)` returns the count of consecutive completed days ending
      at `today`; if today isn't completed but yesterday is, the streak still counts up to
      yesterday. Returns 0 when there is no active streak.
- [ ] `bestStreak(habit)` returns the longest run of consecutive completed days ever.
- [ ] Both functions are **pure** and live in `src/habits.ts` with unit tests covering:
      empty habit, single day, a broken streak, and a streak that ends yesterday.
- [ ] The UI shows the current streak number per habit and a 🔥 badge when it is ≥ 3.
- [ ] `npm test` and `npm run build` pass.

## Notes for the build
- Keep `src/habits.ts` pure — pass `today` in, don't read the clock inside the function.
- Dates are `YYYY-MM-DD` strings; there's already a `dayStr()` helper.
- This is a good candidate to split into **two issues**: (1) the streak logic + tests,
  (2) the UI badge — but the Analyst should decide.

---
> 🎬 **This is the live-demo requirement.** Set `status: ready` and push to trigger the
> Analyst routine. See [[../09 - How it works/SDLC Pipeline]].
