# Decisions

What this app's setup chose and why. `CLAUDE.md` holds the day-to-day rules; the README explains setup.

Versions and behaviour last checked on 2026-11-19.

## Principles

- **Defaults first.** A setting is written down only when the default doesn't do the job.
- **Fail loudly.** Types, lint and tests catch mistakes. Prose rules are kept for what tools can't check.
- **Optional means removable.** An add-on is a folder that can be deleted.
- **Context stays short.** `CLAUDE.md` lists commands and non-obvious conventions; everything else loads on demand.

## Runtime and toolchain

| Decision              | Detail                                                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node 26 (LTS)         | Exact version in `.node-version`. Vite+ downloads it.                                                                                              |
| pnpm 12               | Exact version in the `packageManager` field of `package.json`.                                                                                     |
| Vite+ (`vp`)          | The only toolchain: install, check (oxfmt, oxlint, type-aware), test, run, staged. Replaces Prettier, husky and lint-staged.                       |
| Single package        | No monorepo. Optional parts are Nuxt layers inside the app.                                                                                        |
| `pnpm-workspace.yaml` | Only what Vite+ needs: a catalog pinning `vite-plus`, `vitest` and `vite` (aliased to the Vite+ core), overrides that apply it, and `allowBuilds`. |
| Scripts               | Plain `package.json` scripts, no `run.tasks` in `vite.config.ts`.                                                                                  |

## Nuxt

| Decision                                | Detail                                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Nuxt 4.6 with `compatibilityVersion: 5` | Typed pages, typed `$fetch` routes, case-sensitive routing, no Nitro auto-imports (server code imports from `nuxt/server`).          |
| Extra flags                             | `experimental.strictRouteTypes` (a wrong API path or method is a type error) and `experimental.typescriptPlugin`.                    |
| `postinstall: nuxt prepare`             | Types work right after install.                                                                                                      |
| Example feature                         | A contact form covering a shared schema, a form, an API route and all three test kinds. Replace it with real features.               |
| Nitro esbuild target `esnext`           | The server runs on the pinned Node, so nothing needs downleveling, and the es2019 default warns about modern syntax in dependencies. |
| `/api/health`                           | Uptime checks; also how the `run-app` skill knows the server is ready.                                                               |
| `.env.example`                          | Lists every env var the app reads, each mapped to `runtimeConfig` through the `NUXT_` prefix.                                        |

## Explicit imports

Project code is imported explicitly; Vue, Nuxt and module APIs stay auto-imported. So **if something has no import, it comes from the framework or a module**, and agents can't invent auto-imports that don't exist.

- `imports: { scan: false }` and `components: { dirs: [] }`, not `imports.autoImport: false`, which would also remove `ref`, `useFetch` and the rest.
- Lazy components use `defineAsyncComponent(() => import(...))`; the `Lazy*` prefix only exists for registered components.
- Libraries too: `@vueuse/core` instead of the `@vueuse/nuxt` module.

## Modules and libraries

| Included                     | Why                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `@nuxt/ui` (v4)              | Components, forms, theming. Brings `@nuxt/fonts`, `@nuxt/icon` and color mode with it. |
| `@iconify-json/lucide`       | Local icon set, no network request.                                                    |
| `@nuxt/image`                | Image optimisation.                                                                    |
| `@vueuse/core`               | Utility composables.                                                                   |
| `zod` (v4)                   | End-to-end type safety from one schema in `shared/`, used by both client and server.   |
| `@total-typescript/ts-reset` | Safer built-in types (`JSON.parse`, `.filter(Boolean)`).                               |

Auth and authorization are out of scope. The README lists add-ons to install when needed.

## Optional add-ons as layers

Add-ons live in `layers/<name>/`, which Nuxt registers automatically. Removing one means deleting the folder plus the leftovers its README section lists.

- **`layers/db`:** SQLite through Drizzle and libsql (prebuilt binaries, no native build). The DB file lives in `.data/`.

## Lint, format, types

| Decision            | Detail                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| oxfmt               | `semi: false`, otherwise defaults.                                                                                                   |
| oxlint              | Type-aware. `correctness`, `suspicious` and `perf` are errors, plus `no-explicit-any`. `style` and `pedantic` stay off as too noisy. |
| ESLint, `.vue` only | Only for Vue `<template>` rules, which oxlint doesn't read. `eslint-plugin-oxlint` turns off what oxlint covers.                     |
| Typecheck           | `nuxt typecheck` (vue-tsc) covers app, server, shared, config and tests, and is the only check for `.vue` files.                     |
| TypeScript 6        | vue-tsc and typescript-eslint don't support 7 yet.                                                                                   |

Vue conventions that lint can't enforce live in `.claude/rules/vue.md`.

## Tests

Basic coverage through good examples, no threshold. Agents copy what they see, so there is one example of each kind:

| Project | Folder       | Tool                                                                                          |
| ------- | ------------ | --------------------------------------------------------------------------------------------- |
| unit    | `test/unit/` | Plain Vitest for functions and schemas.                                                       |
| nuxt    | `test/nuxt/` | `@nuxt/test-utils` with happy-dom; components through `mountSuspended` only.                  |
| e2e     | `test/e2e/`  | `setup()` with `$fetch` for routes, `createPage` for a browser journey on a production build. |

- Tests import from `vitest`, a direct dependency: `@nuxt/test-utils` gets a duplicate `vi` through `vite-plus/test`.
- The `nuxt` project has its own config file, so `vp lint` and `vp fmt` don't boot Nuxt.
- The browser test uses the installed Google Chrome, so no browser is downloaded.

## Gates

| When                  | What                                                                      |
| --------------------- | ------------------------------------------------------------------------- |
| After each agent edit | `vp check --fix` on the edited file (Claude Code hook).                   |
| Pre-commit            | `vp staged`: `vp check --fix` on staged files.                            |
| Pre-push              | `vp run check:all`: everything, including the build inside the e2e setup. |

No CI config, because every host differs; the README describes the minimal pipeline.

## Claude Code setup

- `CLAUDE.md`: commands, the imports rule, where things go, env vars, commit style.
- `.claude/rules/`: path-scoped notes that load only when matching files are touched.
- `.claude/skills/run-app` and `.claude/skills/verify`: run the app, and check a change by exercising it (replaces the built-in `/verify`).
- `.claude/settings.json`: the post-edit hook, a session-start hook that installs dependencies and notes a missing `.env`, and the plugins the skills rely on. Permissions and attribution are left to the user.
- `.worktreeinclude`: copies `.env` and `.data/` into new worktrees.
- `.gitignore`: keeps personal overrides (`CLAUDE.local.md`, `.claude/settings.local.json`) and `.claude/worktrees/` out of git.

## Upkeep routine

A weekly cloud routine (`.claude/routines/`) updates dependencies and adopts new best practices, opening at most one PR. Apps made from the template can delete it.

## Revisit when

- **TypeScript 7:** once vue-tsc and typescript-eslint support it.
- **Nuxt 5:** runtime config validation with a Standard Schema such as zod. Until then nothing validates env vars at boot.
- **oxlint Vue template support:** the ESLint tier can go.
- **`@nuxt/test-utils` and Vite+:** the direct `vitest` dependency can go once the duplicate-`vi` issue is fixed.
