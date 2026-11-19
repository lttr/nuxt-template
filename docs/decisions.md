# Template decisions

A starting point for internal full-stack Nuxt apps, built to be worked on by coding agents (Claude Code first). This file records what was chosen and why. `CLAUDE.md` holds the day-to-day rules; the README explains setup.

Versions and behaviour were checked on 2026-11-19 against the npm registry, the installed Nuxt schema, the Vite+ CLI and the Claude Code docs.

## Principles

- **Defaults first.** A setting is written down only when the default doesn't do the job.
- **Fail loudly.** Types, lint and tests catch mistakes. Prose rules are kept for what tools can't check.
- **Optional means removable.** An add-on is a folder that can be deleted.
- **Context stays short.** `CLAUDE.md` lists commands and non-obvious conventions; everything else loads on demand.

## Runtime and toolchain

| Decision              | Detail                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node 26 (LTS)         | Exact version pinned in `devEngines.runtime`. Vite+ downloads it.                                                                                                                                 |
| pnpm 12               | Exact version pinned in `devEngines.packageManager`.                                                                                                                                              |
| Vite+ (`vp`)          | The only toolchain: `vp install`, `vp check` (oxfmt, oxlint, type-aware checks), `vp test`, `vp run`, `vp staged`. It replaces Prettier, husky and lint-staged.                                   |
| Single package        | No monorepo. Optional parts are Nuxt layers inside the app.                                                                                                                                       |
| `pnpm-workspace.yaml` | Holds only what Vite+ needs: a catalog that pins `vite-plus` and `vitest` and aliases `vite` to the Vite+ core, overrides that apply it to every dependent, vitest peer rules, and `allowBuilds`. |
| Scripts               | Plain `package.json` scripts, no `run.tasks` in `vite.config.ts`.                                                                                                                                 |

## Nuxt

| Decision                                | Detail                                                                                                                                                                              |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nuxt 4.6 with `compatibilityVersion: 5` | Turns on typed pages, typed `$fetch` routes and case-sensitive routing, and turns off Nitro auto-imports.                                                                           |
| Extra flags                             | `experimental.strictRouteTypes` (a wrong API path or method is a type error) and `experimental.typescriptPlugin`. Both are off by default.                                          |
| Server imports                          | Follows from Nitro auto-imports being off: server code imports helpers from `nuxt/server`.                                                                                          |
| `postinstall: nuxt prepare`             | Generates `.nuxt` types, so typecheck and the editor work right after install.                                                                                                      |
| Minimal scaffold                        | `app.vue` with `UApp`, one page and one example feature (a contact form) that covers a shared schema, a form, an API route and all three test kinds. Replace it with real features. |
| Nitro esbuild target `esnext`           | Nitro defaults to es2019, which warns about BigInt literals in Nuxt UI. The server runs on the pinned Node, so no downleveling is needed.                                           |
| `/api/health`                           | One endpoint for uptime checks. The `run-app` skill uses it to tell when the server is ready.                                                                                       |
| `.env.example`                          | Lists every env var the app reads. Each maps to `runtimeConfig` through the `NUXT_` prefix.                                                                                         |

## Explicit imports

Project code is imported explicitly; Vue, Nuxt and module APIs stay auto-imported. A reader, or an agent, can rely on one rule: **if something has no import, it comes from the framework or a module.** Agents otherwise tend to invent auto-imports that don't exist.

- `imports: { scan: false }` and `components: { dirs: [] }`. Module components such as `U*` keep working.
- Not `imports.autoImport: false`, which would also remove `ref`, `useFetch` and the rest.
- Lazy components use `defineAsyncComponent(() => import(...))`, because the `Lazy*` prefix only exists for registered components.
- Libraries are imported explicitly too: `@vueuse/core` instead of the `@vueuse/nuxt` module.
- Aliases: `~/` for `app/`, `#shared/` for `shared/`; relative paths only for siblings.
- `antfu/nuxt-explicit-imports` isn't used. It is a migration tool for existing apps, and its strict mode turns off the framework presets.

## Modules and libraries

| Included                     | Why                                                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nuxt/ui` (v4)              | Components, forms and theming (`app.config.ts` `ui.colors`). It installs `@nuxt/fonts`, `@nuxt/icon` and color mode itself, so those aren't listed separately. |
| `@iconify-json/lucide`       | Local icon set, so icons don't need a network request.                                                                                                         |
| `@nuxt/image`                | Image optimisation.                                                                                                                                            |
| `@vueuse/core`               | Utility composables.                                                                                                                                           |
| `zod` (v4)                   | One schema in `shared/`, used by `UForm` on the client and `readValidatedBody` on the server.                                                                  |
| `@total-typescript/ts-reset` | Safer built-in types (`JSON.parse`, `.filter(Boolean)`), loaded through `reset.d.ts`.                                                                          |

Not included: the README lists add-ons to install when needed. Auth and authorization are out of scope.

## Optional add-ons as layers

Add-ons live in `layers/<name>/`, which Nuxt registers automatically. Removing one means deleting the folder plus the few leftovers its README section lists.

- **`layers/db`:** SQLite through Drizzle and libsql. libsql ships prebuilt binaries, so there is no native build to approve. The DB file lives in `.data/`. Dates use `integer({ mode: "timestamp" })`.

## Lint, format, types

| Decision            | Detail                                                                                                                                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| oxfmt               | `semi: false`, otherwise defaults. Generated DB migrations are ignored.                                                                                                                                                                                          |
| oxlint              | Type-aware. The `correctness`, `suspicious` and `perf` categories are errors, plus `no-explicit-any` and Vite+'s `prefer-vite-plus-imports`. `style` and `pedantic` stay off: `style` mostly flags key and import order, and `pedantic` gets noisy in real apps. |
| ESLint, `.vue` only | `@nuxt/eslint` lints only what oxlint can't yet: Vue `<template>` rules (oxlint reads only `<script>`). `eslint-plugin-oxlint` turns off the rules oxlint already covers.                                                                                        |
| Typecheck           | `nuxt typecheck` (vue-tsc). It covers app, server, shared, config and test code through the generated tsconfig references, and it is the only check that type-checks `.vue` files.                                                                               |
| TypeScript 6        | TypeScript 7 is out, but vue-tsc crashes on it and typescript-eslint caps its peer range below 6.1.                                                                                                                                                              |

Vue conventions that lint can't enforce live in `.claude/rules/vue.md`.

## Tests

The goal is basic coverage through good examples, with no coverage threshold. Agents copy the patterns they see, so there is exactly one example of each kind:

| Project | Folder       | Tool                                                                                                                                    |
| ------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| unit    | `test/unit/` | Plain Vitest for functions and schemas.                                                                                                 |
| nuxt    | `test/nuxt/` | `@nuxt/test-utils` with happy-dom; components through `mountSuspended`.                                                                 |
| e2e     | `test/e2e/`  | `@nuxt/test-utils/e2e`: `setup()` with `$fetch` for routes, `createPage` (Playwright) for a browser journey against a production build. |

- Components are mounted with `mountSuspended` only, not Testing Library as well, so agents have one pattern to copy.
- `vitest` is a direct dependency, and tests import from `vitest` rather than `vite-plus/test`. `@nuxt/test-utils` needs the upstream module; otherwise it gets a duplicate `vi`. The lint rule accepts `vitest` imports because of the direct dependency.
- The `nuxt` project has its own config file. Defined inline in `vite.config.ts`, it would boot Nuxt on every `vp lint` or `vp fmt` call.
- The browser test uses the installed Google Chrome through `playwright-core`, so no browser is downloaded.

## Gates

All checks must pass before code is pushed, but not before every commit: the full run builds the app and is too slow for that.

| When                  | What                                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| After each agent edit | `vp check --fix` on the edited file (Claude Code hook). Remaining errors are shown to Claude.                        |
| Pre-commit            | `vp staged`: `vp check --fix` on staged files.                                                                       |
| Pre-push              | `vp run check:all`: check, Vue lint, typecheck, all tests. The e2e setup builds the app, so it catches build errors. |

There is no CI config, because every host differs. The README describes the minimal pipeline.

## Claude Code setup

| File                     | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`              | Commands, the imports rule, where things go, env vars, commit style. Self-contained, with no assumptions about the user's own setup.                                                                                                                                                                                                                                                                                                          |
| `.claude/rules/*.md`     | Path-scoped notes (Vue files, the DB layer). They load only when matching files are touched.                                                                                                                                                                                                                                                                                                                                                  |
| `.claude/skills/run-app` | Start, check and stop the dev or production server. The port is chosen from 3000 upward, so several apps can run side by side.                                                                                                                                                                                                                                                                                                                |
| `.claude/skills/verify`  | Replaces the built-in `/verify`: run the app and exercise the changed behaviour; verdict PASS / FAIL / BLOCKED / SKIP. Claude Code runs it before each commit, so it returns SKIP when nothing can be run.                                                                                                                                                                                                                                    |
| `.claude/settings.json`  | Hooks and plugins. Hooks: the post-edit fix, and a session-start hook that installs dependencies when `node_modules` is missing and notes a missing `.env`. It also fires in new `claude --worktree` sessions (tested on Claude Code 2.1.328). Enables the `maintenance` and `browser` plugins (`lttr/claude-marketplace`) that the upkeep routine and the run/verify skills use. No permissions or attribution; those are the user's choice. |
| `.worktreeinclude`       | Copies `.env` and `.data/` (with the SQLite file) into new `claude --worktree` checkouts.                                                                                                                                                                                                                                                                                                                                                     |
| `.gitignore`             | Adds `CLAUDE.local.md`, `.claude/settings.local.json` and `.claude/worktrees/`.                                                                                                                                                                                                                                                                                                                                                               |

The template adds no Nuxt-specific skill. The `browser` plugin is the one browser-tool choice, for the run/verify skills.

## Upkeep routine

A weekly Claude Code cloud routine keeps the template itself current. Its prompt is one line, "Follow `.claude/routines/template-update.md`.", so the instructions live in the repo and the routine only sets the schedule.

| Routine                                               | ID                              | Schedule                    |
| ----------------------------------------------------- | ------------------------------- | --------------------------- |
| nuxt-template: Update dependencies and best practices | `trig_015AaPZqgj5onx3JdidE8WGZ` | Mondays 02:37 Europe/Prague |

- **Part 1** updates dependencies through the `/maintenance:dependency-update` skill from the `maintenance` plugin (`lttr/claude-marketplace`). The routine file adds what that skill can't know: which packages move together, the Vite+ catalog pins, and the **Revisit when** list below as the workaround record.
- **Part 2** looks for best practices and new possibilities in the release notes and the upstream docs (Nuxt, Nuxt UI, Vite+, Vitest, Claude Code). Small changes backed by an official source are adopted as separate commits that also update this file. Bigger ones are only proposed in the PR body.
- At most one PR per run, never automerged.
- Apps created from the template can delete `.claude/routines/`. The routine only exists for this repo.

## Revisit when

- **TypeScript 7:** once vue-tsc and typescript-eslint support it.
- **Nuxt 5:** runtime config validation with a Standard Schema such as zod ([nuxt/nuxt#36905](https://github.com/nuxt/nuxt/pull/36905), merged, not in 4.6). Until then nothing validates env vars at boot.
- **oxlint Vue template support:** the ESLint tier can go once oxlint lints templates.
- **`@nuxt/test-utils` and Vite+:** the direct `vitest` dependency can go once the duplicate-`vi` issue is fixed.
