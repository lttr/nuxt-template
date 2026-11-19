---
paths:
  - "**/*.vue"
---

# Vue conventions

- `<script setup lang="ts">` only. Type props and emits with `defineProps<...>()` and `defineEmits<...>()`.
- Use Nuxt UI components (`U*`) before writing custom markup; check the existing ones in `app/components/` first.
- Data fetching in pages goes through `useFetch` / `useAsyncData`; `$fetch` only in event handlers.
- Derive state with `computed` instead of syncing it with `watch`.
- `vp lint` doesn't see `<template>`. Run `vp run lint:vue` after template changes.
