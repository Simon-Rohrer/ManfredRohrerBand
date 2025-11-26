#!/bin/bash

echo "🎬 Schritt 1: Videos komprimieren..."

compress_video() {
  local input=$1
  local tmp="${input%.*}-tmp.mp4"

  for crf in 23 26 30; do
    echo "   ➤ Versuche CRF $crf für: $input"
    ffmpeg -i "$input" -vcodec libx264 -crf $crf -preset medium \
      -acodec aac -b:a 128k "$tmp" -y >/dev/null 2>&1

    size=$(du -m "$tmp" | cut -f1)
    echo "      -> Ergebnisgröße: $size MB"

    if [ "$size" -le 45 ]; then
      mv "$tmp" "$input"
      echo "      ✔ Final akzeptiert (<45 MB)"
      return 0
    fi
  done

  # Falls selbst CRF 30 nicht unter 45 MB kommt
  echo "      ⚠ CRF 30 war noch zu groß – nehme letzte Version!"
  mv "$tmp" "$input"
}

export -f compress_video

find . -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.mkv" -o -iname "*.m4v" \) | while read -r vid; do
  compress_video "$vid"
done

echo "✅ Fertig! Alle Videos unter 45MB."
