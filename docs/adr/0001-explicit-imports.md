# 1. Explicit imports for project code

Status: accepted

## Context

Nuxt auto-imports components, composables and utils from the project directories. That hides where code comes from, both for readers and for coding agents, which tend to invent auto-imports that don't exist.

## Decision

Set `imports: { scan: false }` and `components: { dirs: [] }`. Vue, Nuxt and module APIs stay auto-imported; project code is imported explicitly. Don't use `imports.autoImport: false`, which also removes the Vue and Nuxt presets.

## Consequences

- No import means the code comes from the framework or a module.
- `Lazy*` component prefixes disappear; use `defineAsyncComponent`.
- `nuxt typecheck` catches wrong imports, so it runs in the pre-push gate.
