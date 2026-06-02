---
type: explainer
status: living
created: 2026-06-02
updated: 2026-06-02
---

# The autonomous SDLC pipeline

This vault isn't just notes — it's the **front door of a software factory**. A requirement
written here flows, with no human writing code, all the way to a deployed feature.

```mermaid
flowchart TD
    A["📝 Requirement note in Obsidian<br/>(status: ready)"] -->|git push| B
    B["🧭 Analyst<br/><i>analyst.yml</i>"] -->|creates| C["🎫 GitHub Issues<br/>label: ready-for-dev"]
    C -->|issue labeled| D["👩‍💻 Developer<br/><i>developer.yml</i>"]
    D -->|opens PR<br/>label: needs-review| E["🔀 Pull Request"]
    E --> F["✅ CI / Tester<br/><i>ci.yml</i> — npm test + build"]
    E --> G["🧐 Reviewer<br/><i>reviewer.yml</i>"]
    G -->|review + label: ready-to-merge| H["🤝 Squash-merge"]
    F -->|green check| H
    H -->|push to main| I["🚀 Deploy<br/><i>deploy.yml</i> → GitHub Pages"]
    I --> J["🌍 Live app"]
    B -.->|sets status: groomed,<br/>links issues| A
```

## The cast

Every stage is an **event-triggered GitHub Actions workflow** running Claude Code. Nothing
runs on a clock — each step fires on the event the previous step produced.

| Stage | Fires on | What the agent does |
| ----- | -------- | ------------------- |
| 🧭 **Analyst** `analyst.yml` | push to `vault/02 - Requirements/**` | Reads `ready` requirements, decomposes each into 2–4 well-formed issues with acceptance criteria, labels them `ready-for-dev`, links them back into the note, sets it `groomed`. |
| 👩‍💻 **Developer** `developer.yml` | issue labeled `ready-for-dev` | Branches, implements the feature + tests, runs the build, opens a PR (`Closes #N`), labels it `needs-review`. |
| ✅ **Tester / CI** `ci.yml` | every pull request | `npm ci && npm test && npm run build`. The green check. |
| 🧐 **Reviewer** `reviewer.yml` | PR labeled `needs-review` | Reviews the diff against `CLAUDE.md` standards, posts a review, then (if it passes and CI is green) labels `ready-to-merge` and squash-merges. |
| 🚀 **Deploy** `deploy.yml` | push to `main` | Builds and publishes to GitHub Pages. |

> The chain cascades because each workflow runs with a `PIPELINE_TOKEN` (a PAT) instead of the
> default `GITHUB_TOKEN` — GitHub deliberately blocks `GITHUB_TOKEN`-created events from
> triggering further workflows, so the token is what lets issue→PR→review→merge→deploy flow.
>
> The same agent roles can also run as scheduled **Claude Routines** — that variant is wired
> but disabled in favour of these event-driven workflows.

The detailed brief each agent follows lives in [`.github/agents/`](https://github.com/markoub/zenith)
(`analyst.md`, `developer.md`, `reviewer.md`).

## Why labels matter
Labels are the baton in this relay. Each stage only acts on a specific label and then
hands off the next one, which keeps the flow ordered and prevents agents from stepping on
each other.

## Try it
See [[Writing a requirement]] for the one move that starts the whole machine.
