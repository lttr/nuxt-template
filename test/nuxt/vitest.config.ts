import { defineVitestProject } from "@nuxt/test-utils/config"

// Kept out of vite.config.ts so `vp lint` and `vp fmt` don't boot Nuxt on every run.
export default defineVitestProject({
  test: {
    name: "nuxt",
    include: ["**/*.test.ts"],
    environment: "nuxt",
  },
})
