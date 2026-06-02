#!/usr/bin/env bash
# Bootstraps the GitHub side of the Zenith SDLC pipeline.
# Safe to re-run (idempotent). Requires: gh authenticated with repo+workflow scope.
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"
echo "▶ Bootstrapping pipeline for: $REPO"

echo "▶ Creating pipeline labels…"
create_label () { gh label create "$1" --color "$2" --description "$3" --repo "$REPO" --force >/dev/null; }
create_label "agent"             "5319e7" "Created/handled by the autonomous pipeline"
create_label "ready-for-dev"     "0e8a16" "Groomed issue, ready for the Developer agent"
create_label "needs-review"      "fbca04" "PR awaiting the Reviewer agent"
create_label "ready-to-merge"    "0e8a16" "Approved by the Reviewer agent"
create_label "changes-requested" "d93f0b" "Reviewer asked for changes"

echo "▶ Enabling auto-merge & Pages (best-effort)…"
gh api -X PATCH "repos/$REPO" -f allow_auto_merge=true -f delete_branch_on_merge=true >/dev/null || true
gh api -X POST "repos/$REPO/pages" -f "source[branch]=main" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 || true

echo "✅ Done."
echo "   The Analyst / Developer / Reviewer are Claude Routines (claude.ai/code/routines) —"
echo "   they run on your Claude cloud subscription and need NO repo secrets or PAT."
echo "   CI + Deploy are GitHub Actions and use the built-in GITHUB_TOKEN."
