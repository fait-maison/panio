# Dependabot + Automerge

## Goal

Automate dependency updates across npm, GitHub Actions, and Docker ecosystems.
Patch and minor updates auto-merge after CI passes; major updates require manual review.

## Files

1. `.github/dependabot.yml` — Dependabot configuration
2. `.github/workflows/dependabot-automerge.yml` — Automerge workflow

## Dependabot Config

Three ecosystems, all on a weekly schedule (Monday):

### npm

Grouped PRs:

- **svelte** — svelte, svelte-check, @sveltejs/\*
- **tailwind** — tailwindcss, @tailwindcss/\*, tailwind-merge, tailwind-variants, tw-animate-css
- **vitest** — vitest, @vitest/\*
- **playwright** — @playwright/test

Ignore: major bumps on `vite` (SvelteKit pins its Vite range).

### github-actions

All updates grouped into a single PR.

### docker

Covers Dockerfile base images (node, nginx).

## Automerge Workflow

- Triggers on `pull_request` from `dependabot[bot]`
- Checks update type via `github.event.pull_request` metadata
- If patch or minor: `gh pr review --approve` + `gh pr merge --auto --squash`
- Major updates: no action (manual review required)
- Uses built-in `GITHUB_TOKEN`

## Prerequisites

Branch protection on `main` must have:

- Require PR reviews (so auto-approve satisfies the gate)
- Require status checks to pass (so auto-merge waits for CI)
