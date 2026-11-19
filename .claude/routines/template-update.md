---
name: template-update
description: Weekly upkeep run for this template. Updates dependencies through /maintenance:dependency-update, then looks for new best practices and possibilities the updated stack offers and brings the template up to date with them. Opens at most one PR.
---

# Template update

This repo is a starter template, so it has two jobs to stay good at: pinning
current versions, and showing the current best way to build a Nuxt app with a
coding agent. This run handles both. Part 1 updates dependencies; part 2 uses
what that run learned, plus a short look upstream, to improve the template.

One run opens at most one PR. Nothing is automerged.

## Before you start

The environment's setup script provides `vp`, Node, pnpm and the plugins
declared in `.claude/settings.json`; the session-start hook runs `vp install`.

- If `/maintenance:dependency-update` is missing, stop and say so. Don't
  improvise the procedure.
- E2E tests need Google Chrome (`channel: "chrome"`), which the setup doesn't
  install. Run `vpx playwright-core install --with-deps chrome` once. If that
  fails, note it under **Not verified** and run only
  `vp test --project unit` and `vp test --project nuxt`. Never change the
  test's browser setup.
- Read `docs/decisions.md` in full. Part 2 is judged against it.

## Part 1: dependencies

Follow the **`/maintenance:dependency-update`** skill end to end. It covers the
preflight stop conditions, the scan, release notes, the run's shape, the
commits, the repair loop, the run note and the PR body. Where it and this file
disagree, this file wins.

If the skill stops at preflight (an open `claude/deps-` PR, a dirty tree),
stop the whole run. If it stops because nothing is outdated, go on to part 2
anyway; that run's PR, if it opens one, holds only part 2 commits.

### Project facts

- **Base branch** is `master`. Merging does not deploy anything; the template
  has no host.
- **The gate** is `vp run check:all`, run bare.
- **The run note** goes to `.aiwork/{TODAY}_template-update/notes.md` and covers
  both parts.
- **No `# ISSUE:` / `# DELETE WHEN:` comments here.** The workaround record is
  the **Revisit when** list at the end of `docs/decisions.md`. Evaluate each
  entry against the release notes you read and report it as met or not in
  the PR body. When one is met, don't apply it in part 1. It becomes a
  candidate for part 2.

### Groups that move together

- **Nuxt:** `nuxt`, `@nuxt/*`, `vue`, `vue-router`, and `nitropack` if it
  is declared.
- **Vite+:** the `vite`, `vite-plus` and `vitest` catalog rows in
  `pnpm-workspace.yaml` are exact pins and are out of scope for the scan. Bump
  them only to a new `vite-plus` release, and all three at once: `vite-plus`
  to the release, `vite` to the `@voidzero-dev/vite-plus-core` version it
  depends on, and `vitest` to the exact version it depends on. Read both from
  `vp toolchain` after the bump, not from memory. Then run `vp migrate` and
  keep whatever config or import changes it makes.
- **Lint:** `eslint`, `@nuxt/eslint` and `eslint-plugin-oxlint`. The oxlint
  plugin has to know the rules of the oxlint version Vite+ ships.
- **Types:** `typescript`, `vue-tsc`. TypeScript stays on 6 until the
  **Revisit when** entry for TypeScript 7 is met.

### Updating decisions.md

Change `docs/decisions.md` in the same commit as any version it names (Node,
pnpm, Nuxt 4.6, TypeScript 6, Nuxt UI v4, zod v4, …). Update the "Versions and
behaviour were checked on" date only when you really re-checked them.

## Part 2: best practices and new possibilities

Part 1 left you with release notes for everything that moved. Read them again
with a different question: **what does the new version let this template do
better?** Then check these sources for changes since the date in
`docs/decisions.md` (use WebSearch and WebFetch):

- Nuxt blog and release notes, including the road to Nuxt 5 (new defaults,
  compatibility-5 flags, things now recommended or deprecated).
- Nuxt UI, Vite+ (`viteplus.dev`), Vitest and `@nuxt/test-utils` docs and
  changelogs.
- Claude Code docs (`code.claude.com/docs`): new settings, hooks, skills,
  rules or worktree features that touch the files under **Claude Code setup**
  in `docs/decisions.md`.

What counts as a find:

- **A workaround or setting that can go.** A **Revisit when** entry is met, a
  default now does what our config does, or a Vite+ or oxlint release now
  covers what ESLint or a separate tool did. "Defaults first" is the template's
  first principle, so deleting config is the best kind of change.
- **A new recommended pattern** from the official docs that replaces one the
  template shows. Agents copy the example code, so it must show the current
  way.
- **A new possibility** the stack now offers that fits the template's
  principles: small, removable, useful in most internal apps.

What doesn't count: matters of taste, features only some apps need (those go
in the README's **Add when needed** list), anything with one source only, and
anything that makes `CLAUDE.md` longer without being something a tool can't
check.

### Acting on finds

Sort each find into one of two kinds:

- **Adopt** when the change is small, an official source backs it, and
  `vp run check:all` proves it. Make each one its own commit in the same PR,
  after the dependency commits (`refactor:`, `chore:` or `feat:` as fits).
  Update `docs/decisions.md` in that commit: what changed and why, with a link
  to the source. The file must never disagree with the code.
- **Propose** when the change is bigger, alters a decision rather than
  following from one, or can't be verified in the container. Don't implement
  it. Describe it in the PR body.

Adopt at most three finds per run.

A run that finds nothing is a fine outcome. Don't make changes just to have
something to show.

### PR body additions

After the dependency skill's sections, add:

- **Template improvements:** each adopted find, with its commit, the source
  link and why the template is better for it.
- **Proposals:** each proposed find, with the source link, what it would
  change and what it costs.
- **Looked at, no action:** the sources you checked and anything you rejected,
  with a short reason each. This is what keeps the next run from checking the
  same things again.

Visual rendering, the dev server experience, and hooks behaviour in a real
Claude Code session are never verified by `check:all`. They belong in **Not
verified** every time.
