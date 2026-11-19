// @ts-check
// Slow lint tier: ESLint only covers what oxlint (`vp lint`) can't yet, i.e. Vue <template> rules.
import oxlint from "eslint-plugin-oxlint"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({ ignores: ["**/*.{js,mjs,cjs,ts,mts,cts}"] })
  // Last, so it turns off every rule oxlint already enforces (read from vite.config.ts).
  .append(oxlint.buildFromConfigFile("./vite.config.ts"))
