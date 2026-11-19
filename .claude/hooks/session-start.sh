#!/usr/bin/env bash
# Fresh clones and new worktrees have no node_modules yet.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
if [ ! -d node_modules ]; then
  vp install >/dev/null 2>&1 && echo "Installed dependencies (node_modules was missing)." \
    || echo "vp install failed; run it manually before building or testing."
fi
[ -f .env ] || [ ! -f .env.example ] || echo "No .env found; copy .env.example if the task needs env vars."
exit 0
