#!/usr/bin/env bash
# Format and lint-fix the edited file only. Silent on success; on remaining
# lint errors, exit 2 so Claude sees them (the edit itself is kept).
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).tool_input?.file_path??"")}catch{}})')
case "$file" in
  *.ts | *.mts | *.js | *.mjs | *.vue | *.json | *.css | *.md) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0
case "$file" in */node_modules/* | */.nuxt/* | */.output/*) exit 0 ;; esac

vp fmt "$file" >/dev/null 2>&1
case "$file" in *.ts | *.mts | *.js | *.mjs | *.vue) ;; *) exit 0 ;; esac
if ! out=$(vp lint --fix "$file" 2>&1); then
  echo "$out" | tail -n 30 >&2
  exit 2
fi
