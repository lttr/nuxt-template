// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/image", "@nuxt/eslint", "@nuxt/test-utils/module"],

  // Own code is imported explicitly; Vue, Nuxt and module APIs stay auto-imported.
  // Rule of thumb: no import means it comes from the framework or a module.
  imports: { scan: false },
  components: { dirs: [] },

  css: ["~/assets/css/main.css"],

  future: { compatibilityVersion: 5 },
  compatibilityDate: "2026-11-19",

  typescript: {
    // test/nuxt is covered by the app tsconfig; the other test folders need adding.
    sharedTsConfig: { include: ["../test/unit/**/*", "../test/e2e/**/*"] },
  },

  // Nitro's default esbuild target (es2019) warns about BigInt literals in Nuxt UI.
  nitro: { esbuild: { options: { target: "esnext" } } },

  experimental: {
    strictRouteTypes: true,
    typescriptPlugin: true,
  },
})
