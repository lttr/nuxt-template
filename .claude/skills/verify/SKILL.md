---
name: verify
description: Confirm a change works by running the app and exercising the changed behaviour, not by reading code or only running tests. Use after a behaviour or UI change, before reporting it done.
---

# Verify a change in the running app

Scale the effort to the change. A copy tweak needs one look; a new flow needs its happy path and its main failure path. Skip verification for changes with no runtime effect (docs, tests, types, config comments) and report SKIP.

1. Run the static gate for the files you touched: `vp check`. Run the full `vp run check:all` only when the change is broad.
2. Start the app with the `run-app` skill.
3. Exercise the change the way a user would:
   - Pages and components: open the page with whatever headless browser tooling you have, interact with it, then take a screenshot and **read it back**. Check a narrow mobile width too if the layout changed.
   - Server routes: call them with `curl` or `$fetch`, including one invalid input.
4. Check the server output and browser console for errors and hydration warnings.
5. Stop what you started.

Report one verdict with evidence (commands run, what you saw, screenshot paths):

- **PASS**: the change behaves as intended.
- **FAIL**: it doesn't; say what happened.
- **BLOCKED**: you couldn't run it (missing env, service down); say what's missing.
- **SKIP**: nothing to verify at runtime.
