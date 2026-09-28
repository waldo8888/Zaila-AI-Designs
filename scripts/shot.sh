#!/usr/bin/env bash
# One screenshot of a URL, taken with scripts/cdp.mjs.
# Usage: bash scripts/shot.sh <url> <out.png> [width] [height]
#
# Waits SHOT_WAIT_MS (default 6000) after the load event, long enough for the
# first-visit intro to finish. Widths under 768 are captured as a real phone
# (touch + device pixel ratio 2), because desktop Chrome can't lay out a window
# that narrow. (Chrome's own --screenshot flag was dropped: it could fire at the
# load event, before the page's JavaScript had started.)
set -euo pipefail

URL="$1"
OUT="$2"
W="${3:-1440}"
H="${4:-900}"
WAIT_MS="${SHOT_WAIT_MS:-6000}"
HERE="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$(dirname "$OUT")"
rm -f "$OUT"

if [ "$W" -lt 768 ]; then export MOBILE=1; fi
node "$HERE/cdp.mjs" "$URL" "$WAIT_MS" "true" "$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")" "$W" "$H" >/dev/null

if [ -s "$OUT" ]; then
  echo "$OUT"
else
  echo "capture failed: $URL" >&2
  exit 1
fi
