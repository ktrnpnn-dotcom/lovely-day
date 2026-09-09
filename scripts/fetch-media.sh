#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUDIO="$ROOT/public/audio"
mkdir -p "$AUDIO" "$ROOT/public/covers" "$ROOT/public/video"

need() {
  local path="$1"
  [[ -s "$path" ]]
}

echo "Скачиваю CC0-треки с archive.org (если их ещё нет)..."

if ! need "$AUDIO/star-walk-meditation.mp3"; then
  TMP="$AUDIO/_meditation-full.mp3"
  curl -L --fail --retry 3 -o "$TMP" \
    "https://archive.org/download/holizna-cc-0-20-minute-meditation-1/HoliznaCC0%20-%2020%20Minute%20Meditation%201.mp3"
  if command -v ffmpeg >/dev/null 2>&1; then
    ffmpeg -y -i "$TMP" -t 300 -c:a libmp3lame -b:a 128k "$AUDIO/star-walk-meditation.mp3"
    rm -f "$TMP"
  else
    mv "$TMP" "$AUDIO/star-walk-meditation.mp3"
  fi
fi

if ! need "$AUDIO/ease-into-night.mp3"; then
  curl -L --fail --retry 3 -o "$AUDIO/ease-into-night.mp3" \
    "https://archive.org/download/06-holizna-cc-0-break-from-reality-lo-fi-peaceful-.mp-3/13%20HoliznaCC0%20-%20Ease%20into%20Night%20%28%20Lofi%20%2C%20Relax%20%2C%20Chill%20%29.mp3"
fi

if ! need "$AUDIO/space-traveler.mp3"; then
  curl -L --fail --retry 3 -o "$AUDIO/space-traveler.mp3" \
    "https://archive.org/download/HypnotronicMan-SpaceTraveler-Amplified/HypnotronicMan-SpaceTraveler.mp3"
fi

echo "Готово. Треки лежат в public/audio/"
ls -lh "$AUDIO"
