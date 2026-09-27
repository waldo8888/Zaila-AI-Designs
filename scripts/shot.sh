#!/usr/bin/env bash
# One headless-Chrome screenshot of a URL.
# Usage: bash scripts/shot.sh <url> <out.png> [width] [height]
#
# Chrome captures after SHOT_WAIT_MS of real time (default 8000), long enough
# for the first-visit intro to finish. (--virtual-time-budget never completes
# on this site: a request that stays open stalls the virtual clock.)
# On macOS, headless Chrome writes the screenshot but doesn't always exit,
# so this waits for the file, then stops only the Chrome it started
# (it uses a throwaway profile, never your own).
set -euo pipefail

URL="$1"
OUT="$2"
W="${3:-1440}"
H="${4:-900}"
WAIT_MS="${SHOT_WAIT_MS:-8000}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFILE="$(mktemp -d -t zaila-shot)"

mkdir -p "$(dirname "$OUT")"
rm -f "$OUT"

"$CHROME" --headless=new --hide-scrollbars --no-first-run --no-default-browser-check \
  --user-data-dir="$PROFILE" --window-size="$W,$H" --timeout="$WAIT_MS" \
  --screenshot="$OUT" "$URL" >/dev/null 2>&1 &
PID=$!

for _ in $(seq 1 60); do
  sleep 0.5
  [ -s "$OUT" ] && break
done
sleep 0.5

kill "$PID" 2>/dev/null || true
pkill -f "$PROFILE" 2>/dev/null || true
rm -rf "$PROFILE"

if [ -s "$OUT" ]; then
  echo "$OUT"
else
  echo "capture failed: $URL" >&2
  exit 1
fi
