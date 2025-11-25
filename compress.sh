#!/bin/bash


echo "🎬 Schritt 1: Videos komprimieren..."
find . -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.mkv" -o -iname "*.avi" \) -print0 | while IFS= read -r -d '' vid; do
  echo "   Komprimiere: $vid"

  # ffmpeg – CRF 20 = visuell verlustfrei, sehr gute Kompression
  ffmpeg -i "$vid" -vcodec libx264 -crf 20 -preset slow -acodec aac -b:a 192k "${vid%.*}-compressed.mp4"

  # Original ersetzen
  mv "${vid%.*}-compressed.mp4" "$vid"
done

echo "📁 Schritt 2: Dateien normal hinzufügen..."
git add .

echo "💾 Schritt 5: Commit..."
git commit -m "Compressed video"

echo "⬆ Schritt 6: Push..."
git push

echo "✅ Fertig! Alle Videos sind jetzt optimal komprimiert!"
