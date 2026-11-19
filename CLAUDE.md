# Nuxt app

Nuxt 4 (compatibility version 5) with Nuxt UI, on the Vite+ toolchain (`vp`). Use `vp` for every package and script command; run `vp help` if unsure.

## Commands

- `vp run dev` starts the dev server. `vp run build` builds for production; `vp build` and `vp dev` are Vite+ built-ins that don't run Nuxt.
- `vp check --fix` formats, lints (oxlint) and type-checks `.ts` files. Fast; use it often.
- `vp run lint:vue` runs ESLint for Vue `<template>` rules, which oxlint doesn't cover yet.
- `vp run typecheck` runs `nuxt typecheck` (vue-tsc). This is the only check that type-checks `.vue` files.
- `vp test` runs all tests; `vp test --project unit|nuxt|e2e` runs one project.
- `vp run check:all` runs everything above. The pre-push hook runs it; pre-commit only formats and lints staged files.

## Imports

Project code is imported explicitly. Vue, Nuxt and module APIs (`ref`, `useFetch`, `U*` components) stay auto-imported. If something has no import, it must come from the framework or a module.

- Use `~/` for `app/` and `#shared/` for `shared/`; relative paths only for siblings.
- Server code imports helpers from `nuxt/server`, not `h3`.
- Lazy components: `defineAsyncComponent(() => import("~/components/Foo.vue"))`.
- VueUse: import from `@vueuse/core`.

## Where things go

- Validation schemas shared by client and server live in `shared/`, written with zod. `UForm` and `readValidatedBody` both take the same schema.
- Tests: `test/unit/` (plain functions), `test/nuxt/` (components with `mountSuspended`), `test/e2e/` (`setup()` + `$fetch` / `createPage`). Import test APIs from `vitest`.
- Optional add-ons are Nuxt layers in `layers/`. Each one can be deleted as a folder; its own notes say what else to remove.

## Rules

- Env vars: only the ones in `.env.example`, mapped through `runtimeConfig`. Add new ones there.
- Commits follow Conventional Commits.
- `docs/decisions.md` records what the setup chose and why. When a change adds, alters or removes one of those choices (dependency, config, convention, hook, skill), update the file in the same change. It must never disagree with the code.
