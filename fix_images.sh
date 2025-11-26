#!/bin/bash

echo "🔧 Schritt 1: Git LFS deaktivieren..."
git lfs uninstall

echo "🗑 Schritt 2: LFS-Pointer entfernen..."
git lfs ls-files -n | while read -r file; do
  echo "   Entferne aus LFS: $file"
  git rm --cached "$file"
done

echo "🖼 Schritt 3: Bilder komprimieren..."
find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0 | while IFS= read -r -d '' img; do
  echo "   Komprimiere: $img"
  magick "$img" -quality 80 "$img-compressed"
  mv "$img-compressed" "$img"
done


echo "✅ Fertig! Bilder sind jetzt klein genug und funktionieren auf GitHub Pages."

