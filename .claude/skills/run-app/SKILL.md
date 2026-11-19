---
name: run-app
description: Start, check and stop this Nuxt app's dev or production server. Use before driving the app in a browser, or when /verify needs the app running.
---

# Run the app

Pick a free port first; other apps or worktrees may be running. 3000 is the default, so try from there upward:

```bash
PORT=3000; while curl -s -o /dev/null "localhost:$PORT"; do PORT=$((PORT+1)); done; echo $PORT
```

## Dev server

Start it in the background (Monitor or `run_in_background`), not in the foreground:

```bash
PORT=$PORT vp run dev
```

It's ready when `curl -sf localhost:$PORT/api/health` returns `{"status":"ok"}`. This usually takes a few seconds; read the server output if it doesn't.

## Production build

Hydration and server-only bugs only show up here:

```bash
vp run build && PORT=$PORT node .output/server/index.mjs
```

## Stop

Stop by port, so other node processes survive: `fuser -k $PORT/tcp`.

## Rules

- Drive the app headless. Don't open the user's browser.
- Stop the servers you started when you're done.
