---
type: how-to
status: living
created: 2026-06-02
updated: 2026-06-02
---

# Writing a requirement (the one move that starts everything)

1. **Duplicate** [[../02 - Requirements/_TEMPLATE]] into `02 - Requirements/` and give it a
   name like `REQ-00X - Short title.md`.
2. Fill in the problem, outcome, scope, and **acceptance criteria** (these become the
   issue's checklist — be concrete and testable).
3. When it's ready to build, set the frontmatter:
   ```yaml
   status: ready
   ```
4. **Commit & push.** That's it.

```bash
git add "vault/02 - Requirements"
git commit -m "req: REQ-00X ready for grooming"
git push
```

Within a minute the **Analyst routine** wakes up, grooms your note into GitHub issues, and
the rest of the [[SDLC Pipeline|pipeline]] takes over — implementation, review, tests,
merge, and deploy — while you watch from the GitHub *Actions* and *Pull requests* tabs.

> 💡 **Live demo tip:** the fastest crowd-pleaser is to open
> [[../02 - Requirements/REQ-001 - Streaks and momentum]], change `status: draft` to
> `status: ready`, and push. Then switch to the GitHub Actions tab and narrate as the
> agents take over.
