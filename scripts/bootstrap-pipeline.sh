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

echo "✅ Done. The pipeline is event-driven GitHub Actions. Set two repo secrets (one-time):"
echo "   1) gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo $REPO   (value from: claude setup-token)"
echo "   2) gh secret set PIPELINE_TOKEN          --repo $REPO   (classic PAT: repo + workflow scopes)"
echo "      → https://github.com/settings/tokens/new?scopes=repo,workflow&description=zenith-pipeline"
echo "   CI + Deploy use the built-in GITHUB_TOKEN; the agent stages need the two secrets above."
