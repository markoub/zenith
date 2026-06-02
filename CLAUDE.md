# Zenith — project guide for AI agents

Zenith is a tiny, joyful **habit tracker** (Vite + TypeScript + Vitest). It is also a
live demonstration of an **autonomous SDLC pipeline**: requirements written in Obsidian
become GitHub issues, which an agent implements, reviews, tests, merges, and deploys —
with no human writing code.

## Golden rules for every agent

1. **`src/habits.ts` stays pure** — no DOM, no `localStorage`, no `window`. All UI/storage
   lives in `src/main.ts`. This keeps the logic unit-testable.
2. **Every behavioural change ships with a test** in `src/habits.test.ts`.
3. **Definition of done:** `npm ci && npm test && npm run build` all pass. Never open or
   approve a PR that doesn't build.
4. **Small, focused changes.** One issue → one feature → one PR. Match the existing code
   style (immutable updates, no new dependencies unless the ticket calls for it).
5. **Conventional commits** (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

## Commands

```bash
npm ci          # install
npm test        # vitest run
npm run build   # type-check (tsc --noEmit) + vite build
npm run dev     # local dev server
```

## Architecture

- `src/habits.ts` — pure domain logic (Habit type + operations). **Grow this first.**
- `src/habits.test.ts` — unit tests. **Grow this alongside.**
- `src/main.ts` — DOM rendering + `localStorage` persistence.
- `src/style.css` — styles.
- `vault/` — the Obsidian knowledge base where requirements originate.
- `.github/agents/` — role playbooks the pipeline agents follow.
- `.github/workflows/` — the pipeline itself (analyst → developer → reviewer → CI → merge → deploy).

## How the pipeline labels flow

`ready-for-dev` → (developer opens PR) → `needs-review` → (reviewer approves) →
`ready-to-merge` → (auto-merge) → deployed.
