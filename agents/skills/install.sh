#!/usr/bin/env bash
set -e
dest="$HOME/.claude/skills"; mkdir -p "$dest"
here="$(cd "$(dirname "$0")" && pwd)"
for cat in "$here"/*/; do
  [ -d "$cat" ] || continue
  for sk in "$cat"*/; do [ -d "$sk" ] && cp -rf "$sk" "$dest/"; done
done
echo "Installed agent skills to $dest"
