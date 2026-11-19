#!/usr/bin/env bash
# Format, lint-fix and type-check the file Claude just edited. Silent on success;
# exit 2 shows the remaining errors to Claude (the edit itself is kept).
cd "$CLAUDE_PROJECT_DIR" || exit 0
file=$(node -p 'JSON.parse(require("fs").readFileSync(0)).tool_input.file_path')
out=$(vp check --fix "$file" 2>&1) || { echo "$out" | tail -n 30 >&2; exit 2; }
