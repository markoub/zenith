# ✦ Zenith

> **Small steps, every day.** A tiny, joyful habit tracker — and a live demo of an
> **autonomous software-delivery pipeline** powered by Claude Code.

🌍 **Live app:** https://markoub.github.io/zenith/ &nbsp;·&nbsp; 🧠 **Knowledge base:** [`/vault`](vault) (open in Obsidian)

---

## The twist: nobody writes the code

A product idea is written as a **requirement note in Obsidian**. From there, a relay of
**Claude Routines** (scheduled cloud agents) carries it all the way to a deployed feature,
with **GitHub Actions** handling the deterministic plumbing (tests + deploy):

```mermaid
flowchart LR
    A["📝 Requirement<br/>in Obsidian"] -->|API / Run now| B["🧭 Analyst<br/><i>routine</i>"]
    B -->|fires (API) + GitHub issues| C["👩‍💻 Developer<br/><i>routine</i>"]
    C -->|opens pull request| D["✅ CI / Tester<br/><i>action</i>"]
    C -->|GitHub PR event| E["🧐 Reviewer<br/><i>routine</i>"]
    D --> F["🤝 Merge"]
    E --> F
    F -->|push to main| G["🚀 Deploy<br/><i>action</i>"]
    G --> H["🌍 Live app"]
```

The three AI roles are **Claude Routines** — cloud agents in the
[Routines panel](https://claude.ai/code/routines). They run on **triggers, never on a clock**:

| Stage | Runs as | Trigger |
| ----- | ------- | ------- |
| 🧭 **Analyst** | Claude Routine | **API** (`/fire`) or *Run now* — kicked when a requirement is ready |
| 👩‍💻 **Developer** | Claude Routine | **API** (`/fire`) — chained from the Analyst |
| ✅ **Tester / CI** | GitHub Action ([`ci.yml`](.github/workflows/ci.yml)) | every pull request |
| 🧐 **Reviewer** | Claude Routine | **GitHub event** — `pull_request.opened` |
| 🚀 **Deploy** | GitHub Action ([`deploy.yml`](.github/workflows/deploy.yml)) | push to `main` |

> Routine triggers (GitHub event + API) are configured in the
> [Routines UI](https://claude.ai/code/routines) and need the **Claude GitHub App** installed.
> GitHub-event triggers support `pull_request` and `release` events — so the **Reviewer**
> reacts to PRs directly, while the Analyst→Developer hops fire over the routine API.

Each routine follows a versioned role brief in [`.github/agents/`](.github/agents). The full
story is in the vault: [`vault/09 - How it works/SDLC Pipeline.md`](vault/09%20-%20How%20it%20works/SDLC%20Pipeline.md).

### Start the machine
Mark a requirement `status: ready`, push, then fire the **Analyst** routine (Run now, or its
`/fire` API endpoint). It grooms the requirement into issues and kicks the Developer; the
Developer's PR then triggers the Reviewer automatically. Watch it in the
[Routines panel](https://claude.ai/code/routines) and the repo's **Pull requests** tab.

---

## The app itself

Plain **Vite + TypeScript**, no framework, no backend. Domain logic lives in a pure,
fully-tested module so the agents can grow it safely.

```bash
npm install      # install
npm run dev      # local dev server
npm test         # unit tests (Vitest)
npm run build    # type-check + production build
```

```
src/habits.ts        # pure domain logic (Habit type + operations)  ← grows first
src/habits.test.ts   # unit tests                                    ← grows alongside
src/main.ts          # DOM rendering + localStorage
src/style.css        # styles
vault/               # Obsidian knowledge base — where requirements are born
.github/agents/      # the role briefs each pipeline agent follows
.github/workflows/   # the pipeline
```

See [`CLAUDE.md`](CLAUDE.md) for the conventions every agent obeys.
