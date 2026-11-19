# Nuxt template

A starter for small Nuxt apps: Nuxt 4 in compatibility-5 mode, Nuxt UI, Vite+ (`vp`) as the single toolchain, explicit imports for project code, and Claude Code setup included.

## Getting started

You need [Vite+](https://viteplus.dev/guide/) installed globally. It downloads the pinned Node and pnpm versions from `devEngines` in `package.json`.

```bash
vp install
cp .env.example .env   # only if you need to override something
vp run db:migrate      # only if you keep layers/db
vp run dev
```

## What's inside

| Area            | Choice                                                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| UI              | `@nuxt/ui` (Tailwind v4; brings `@nuxt/icon`, `@nuxt/fonts` and color mode), `@nuxt/image`, Lucide icons                           |
| Validation      | zod, one schema in `shared/` used by `UForm` and `readValidatedBody`                                                               |
| Utilities       | `@vueuse/core`, imported explicitly                                                                                                |
| Types           | `nuxt typecheck` (vue-tsc), typed routes and `$fetch`, `@total-typescript/ts-reset`                                                |
| Lint and format | oxfmt and type-aware oxlint through `vp check`; ESLint (`@nuxt/eslint`) only for Vue templates                                     |
| Tests           | Vitest with `@nuxt/test-utils`: `test/unit`, `test/nuxt` (happy-dom), `test/e2e` (Playwright via `playwright-core`, system Chrome) |

The example page has a contact form that covers the form, validation, API route and tests end to end. Replace it once you have your own.

## Checks

| When                       | What runs                                                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| On edit (Claude Code hook) | `vp fmt` and `vp lint --fix` on the edited file                                                                                                |
| Pre-commit                 | `vp staged`: format and lint the staged files                                                                                                  |
| Pre-push                   | `vp run check:all`: check, template lint, typecheck, all tests. The e2e tests build the app for production, so this also catches build errors. |

E2E browser tests run in the installed Google Chrome (`channel: "chrome"`), so Playwright downloads no browsers.

### CI

There is no CI config, because every host differs. A minimal pipeline installs Vite+ (on GitHub Actions: `voidzero-dev/setup-vp`), then runs `vp install` and `vp run check:all`. See the [Vite+ CI guide](https://viteplus.dev/guide/ci).

## Optional add-ons

### Included as a layer: `layers/db`

SQLite through Drizzle and libsql. The DB file lives in `.data/`. To drop it, delete `layers/db/`, the `db:*` scripts, the `drizzle-orm`, `@libsql/client` and `drizzle-kit` dependencies, and the `NUXT_DB_URL` line in `.env.example`.

### Add when needed

- **`@nuxt/content`**: Markdown or docs-style content.
- **`@nuxtjs/i18n`**: translations.
- **`@nuxtjs/seo`**: sitemap, robots and OG images for public sites. For an internal app, set `site.indexable: false` to disallow all robots.
- **`@nuxt/scripts`**: third-party scripts such as analytics.
- **MSW**: mock external APIs, so you can develop without the real service.
- **Blob or file storage**: Nitro's `useStorage()` (from `nitropack/runtime`) with the fs driver pointed at `.data/`, swappable for S3 later.
- **Runtime config validation**: Nuxt 5 validates runtime config with a Standard Schema such as zod ([nuxt/nuxt#36905](https://github.com/nuxt/nuxt/pull/36905)). Until then, nothing validates env vars at boot.

## Claude Code

- `CLAUDE.md` holds the commands and conventions; `.claude/rules/` holds path-scoped notes for Vue files and the DB layer.
- `.claude/skills/run-app` starts and stops the app. `.claude/skills/verify` replaces the built-in `/verify`. Claude Code also runs a project `verify` skill before each commit, and the skill scales itself down for small changes.
- Hooks in `.claude/settings.json` fix up edited files and install dependencies in fresh worktrees.
- Personal overrides go in `CLAUDE.local.md` and `.claude/settings.local.json`; both are gitignored. `.worktreeinclude` copies `.env` and `.data/` into new Claude Code worktrees.
- Architecture decisions go in `docs/adr/`.
