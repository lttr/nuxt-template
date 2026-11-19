# Template decisions

The template is a starting point for internal full-stack Nuxt apps, built to be worked on by coding agents (Claude Code first). It is meant to be solid, with defaults wherever they work and nothing that a small app has to maintain without using.

Versions and behaviour were checked on 2026-11-19 against the npm registry, the shipped Nuxt schema, the Vite+ docs and the Claude Code docs.

## Principles

- **Defaults first.** A setting is written down only when the default doesn't do the job.
- **Fail loudly.** Types, lint and tests catch mistakes. Prose rules are kept for what tools can't check.
- **Optional means removable.** Each add-on can be deleted as a folder or skipped entirely.
- **Context stays short.** `CLAUDE.md` lists commands and non-obvious conventions; everything else loads on demand.

## Runtime and toolchain

| Decision              | Detail                                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node LTS (26)         | Pinned through `devEngines.runtime` in `package.json`. `vp env pin lts` writes it there and Vite+ downloads the pinned version.                                                   |
| pnpm, latest (12)     | Pinned through `devEngines.packageManager`.                                                                                                                                       |
| Vite+ (`vp`)          | The only toolchain: `vp install`, `vp check` (oxfmt, oxlint, type-aware checks), `vp test`, `vp run`, `vp staged`. It replaces Prettier, husky and lint-staged.                   |
| Single package        | No monorepo. Optional parts are Nuxt layers inside the app.                                                                                                                       |
| `pnpm-workspace.yaml` | Holds only what Vite+ needs: a catalog aliasing `vite`/`vitest` to Vite+, overrides, `peerDependencyRules` for vitest, and `allowBuilds` (pnpm 12 refuses to install without it). |

## Nuxt

| Decision                                | Detail                                                                                                                                                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nuxt 4.6 with `compatibilityVersion: 5` | This already turns on typed pages, typed `$fetch` routes and case-sensitive routing, and turns off Nitro auto-imports.                                                                               |
| Extra flags                             | `experimental.strictRouteTypes` (a wrong API path or method is a type error) and `experimental.typescriptPlugin`.                                                                                    |
| Server imports                          | Server code imports helpers from `nuxt/server`.                                                                                                                                                      |
| `postinstall: nuxt prepare`             | Generates `.nuxt` types so typecheck and the editor work right after install.                                                                                                                        |
| Minimal scaffold                        | `app.vue` with `UApp`, one page and one example feature (a contact form). The feature covers a shared schema, a form, an API route and all three test kinds. Replace it once you have real features. |
| `/api/health`                           | One endpoint for uptime checks.                                                                                                                                                                      |
| `.env.example`                          | Lists every env var the app reads. They map through `runtimeConfig`.                                                                                                                                 |

## Explicit imports

Project code is imported explicitly; Vue, Nuxt and module APIs stay auto-imported. A reader, or an agent, can rely on one rule: **if something has no import, it comes from the framework or a module.**

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
| `zod` (latest, v4)           | One schema in `shared/`, used by `UForm` on the client and `readValidatedBody` on the server.                                                                  |
| `@total-typescript/ts-reset` | Safer built-in types (`JSON.parse`, `.filter(Boolean)`).                                                                                                       |

Not included; the README lists them as add-ons to install when needed: `@nuxt/content`, `@nuxtjs/i18n`, `@nuxtjs/seo` (with `site.indexable: false` for internal apps), `@nuxt/scripts`, MSW, and Nitro's `useStorage()` for files and blobs.

## Optional add-ons as layers

Add-ons live in `layers/<name>/`, which Nuxt registers automatically. Removing one means deleting the folder plus the few dependencies and scripts its README section lists.

- **`layers/db`:** SQLite through Drizzle and libsql. libsql ships prebuilt binaries, so there is no native build step to approve. The DB file lives in `.data/`. Dates use Drizzle's built-in `integer({ mode: "timestamp" })`. Static sites delete this layer.
- **Candidate next layer:** MSW for mocking external APIs, so the app can be developed without the real service.

Auth and authorization are out of scope for now.

## Lint, format, types

| Decision            | Detail                                                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| oxfmt               | `semi: false`, otherwise defaults.                                                                                                                                                                                                                                                                                 |
| oxlint              | Type-aware. The `correctness`, `suspicious` and `perf` categories are errors, plus `no-explicit-any`. `pedantic` and `style` stay off: a trial on the template showed `style` mostly flags key and import order, and `pedantic` includes rules like `prefer-readonly-parameter-types` that get noisy in real apps. |
| ESLint, `.vue` only | `@nuxt/eslint` lints only what oxlint can't yet, which is Vue `<template>` rules (oxlint reads only `<script>`). `eslint-plugin-oxlint` turns off rules oxlint already covers. No CSS linting.                                                                                                                     |
| Typecheck           | `nuxt typecheck` (vue-tsc). It covers app, server, shared and test code through the generated tsconfig references, and it is the only check that type-checks `.vue` files.                                                                                                                                         |
| TypeScript 6        | TypeScript 7 is out, but vue-tsc crashes on it and typescript-eslint caps its peer range below 6.1.                                                                                                                                                                                                                |

Vue conventions that lint can't enforce live in a short `.claude/rules/vue.md`. It loads only when Claude works on `.vue` files.

## Tests

The goal is basic coverage through good examples. There is no coverage threshold. Agents copy the patterns they see, so there is one example of each kind:

| Project | Folder       | Tool                                                                                                         |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| unit    | `test/unit/` | Plain Vitest for functions and schemas.                                                                      |
| nuxt    | `test/nuxt/` | `@nuxt/test-utils` with happy-dom; components through `mountSuspended`.                                      |
| e2e     | `test/e2e/`  | `@nuxt/test-utils/e2e`: `setup()` with `$fetch` for routes, `createPage` (Playwright) for a browser journey. |

- Components are tested with `mountSuspended` only, not Testing Library as well. Mixing two mounting styles leaves agents with two patterns to copy.
- `vitest` is a direct dependency, and tests import from `vitest` rather than `vite-plus/test`. Vite+'s migration rules require this for `@nuxt/test-utils`, which otherwise gets a duplicate `vi`.
- The `nuxt` project has its own config file. Defining it inline in `vite.config.ts` would boot Nuxt on every `vp lint` or `vp fmt` call.

## Gates

All checks must pass before code is pushed, but not before every commit.

| When                  | What                                                                                                                               | Measured |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------- |
| After each agent edit | `vp fmt` and `vp lint --fix` on the edited file (Claude Code hook)                                                                 | ~0.5s    |
| Pre-commit            | `vp staged` (`vp check --fix` on staged files)                                                                                     | ~1s      |
| Pre-push              | `vp run check:all`: check, Vue lint, typecheck, all tests. The e2e setup builds for production, so this also catches build errors. | ~13s     |

- Plain `package.json` scripts, no `vite.config.ts` `run.tasks`.
- There is no CI config, because every host differs. The README describes the minimal steps: install Vite+, `vp install`, `vp run check:all`.

## Claude Code setup

| File                     | Purpose                                                                                                                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`              | About 30 lines: commands, the imports rule, where things go, env vars, commit style. Self-contained, with no assumptions about the user's own setup.                                                                                                                                                     |
| `.claude/rules/*.md`     | Path-scoped notes (Vue files, the DB layer). They load only when matching files are touched.                                                                                                                                                                                                             |
| `.claude/skills/run-app` | Start, check and stop the dev or production server. The port is chosen from 3000 upward, so several apps can run side by side.                                                                                                                                                                           |
| `.claude/skills/verify`  | Replaces the built-in `/verify`: run the app and exercise the changed behaviour; verdict PASS / FAIL / BLOCKED / SKIP. Claude Code also asks Claude to run a project `verify` skill before each commit, so the skill scales its effort to the change and returns SKIP when nothing user-visible changed. |
| `.claude/settings.json`  | Hooks only: the post-edit fix, and a session-start hook that installs dependencies when `node_modules` is missing and notes a missing `.env`. No permissions, plugins or attribution; those are the user's choice.                                                                                       |
| `.worktreeinclude`       | Copies `.env` and `.data/` (including the SQLite file) into new `claude --worktree` checkouts.                                                                                                                                                                                                           |
| `.gitignore`             | Adds `CLAUDE.local.md`, `.claude/settings.local.json` and `.claude/worktrees/`.                                                                                                                                                                                                                          |
| `docs/adr/`              | Architecture decisions. The first ADR covers explicit imports.                                                                                                                                                                                                                                           |

The template doesn't reimplement `/code-review` or `/simplify`; whether to use them is decided per change. It adds no Nuxt-specific skill, browser-tool choice or dependency-update automation.

## Revisit when

- **TypeScript 7:** once vue-tsc and typescript-eslint support it.
- **Nuxt 5:** runtime config validation with a Standard Schema such as zod ([nuxt/nuxt#36905](https://github.com/nuxt/nuxt/pull/36905), merged, not in 4.6). Until then nothing validates env vars at boot.
- **oxlint Vue template support:** the ESLint tier can go once oxlint lints templates.
- **`@nuxt/test-utils` and Vite+:** the direct `vitest` dependency can go once the duplicate-`vi` issue is fixed.

## Not verified

- **Session-start hook in worktrees:** the Claude Code docs don't say whether `SessionStart` fires for `claude --worktree` sessions. Not tested yet.
- **How the built-in `/verify` finds `run-app`:** the docs say `/run` and `/verify` follow a recorded `run-<name>` skill, but not how they discover it.
