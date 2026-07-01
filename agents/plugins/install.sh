#!/usr/bin/env bash
# Restores the kedhar_plugins snapshot into ~/.claude/plugins/.
# Copies marketplaces/ and the two registry JSON files. Cache is rebuilt
# by Claude Code on next run.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_ROOT="${HOME}/.claude/plugins"

echo "Installing kedhar_plugins -> ${CLAUDE_ROOT}"
mkdir -p "${CLAUDE_ROOT}"

# 1. Marketplaces
SRC_MARKETS="${HERE}/marketplaces"
DST_MARKETS="${CLAUDE_ROOT}/marketplaces"

if [ -d "${DST_MARKETS}" ] && [ "${1:-}" != "--force" ]; then
    echo ""
    read -r -p "  WARNING: ${DST_MARKETS} already exists. Overwrite? (y/N) " answer
    case "${answer}" in
        [yY]|[yY][eE][sS]) ;;
        *) echo "Aborted."; exit 1 ;;
    esac
fi

mkdir -p "${DST_MARKETS}"
for d in "${SRC_MARKETS}"/*/; do
    name="$(basename "${d}")"
    echo "  marketplace: ${name}"
    rm -rf "${DST_MARKETS}/${name}"
    cp -R "${d}" "${DST_MARKETS}/${name}"
done

# 2. Registry JSON files
cp -f "${HERE}/installed_plugins.json"  "${CLAUDE_ROOT}/installed_plugins.json"
cp -f "${HERE}/known_marketplaces.json" "${CLAUDE_ROOT}/known_marketplaces.json"
echo "  copied installed_plugins.json + known_marketplaces.json"

echo ""
echo "Done."
echo "Next step: open Claude Code (or run 'claude plugin update --all') so the cache rebuilds."
