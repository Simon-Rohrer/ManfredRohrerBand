#!/bin/bash

# =================================================================
# GLOBAL KONFIGURATION
# =================================================================
MAX_VIDEO_SIZE_MB=45 # Zielgröße für Videos
VIDEO_EXTENSIONS=(mp4 mov mkv m4v)
IMAGE_EXTENSIONS=(jpg jpeg png)

# =================================================================
# FUNKTIONEN
# =================================================================

compress_video() {
  local input=$1
  local tmp="${input%.*}-tmp.mp4"

  echo "   ➤ Video: Versuche zu komprimieren: $input"

  # Starte mit CRF 23 und erhöhe bis zu CRF 30
  for crf in 23 26 30; do
    echo "      - Versuche CRF $crf..."
    # FFMPEG-Kommando: Video-Codec libx264, Audio-Codec aac 128k
    ffmpeg -i "$input" -vcodec libx264 -crf $crf -preset medium \
      -acodec aac -b:a 128k "$tmp" -y >/dev/null 2>&1

    # Dateigröße in MB ermitteln
    # Wichtig: Prüfen, ob die temporäre Datei existiert, bevor du du -m ausführst
    if [ -f "$tmp" ]; then
        size=$(du -m "$tmp" | cut -f1)
        echo "         -> Ergebnisgröße: $size MB"
    else
        echo "         -> FEHLER: Temporäre Datei $tmp konnte nicht erstellt werden."
        return 1
    fi


    if [ "$size" -le $MAX_VIDEO_SIZE_MB ]; then
      mv "$tmp" "$input"
      echo "      ✔ Final akzeptiert (<${MAX_VIDEO_SIZE_MB} MB)"
      return 0
    fi
  done

  # Falls selbst CRF 30 nicht unter die Zielgröße kommt
  echo "      ⚠ CRF 30 war noch zu groß – nehme letzte Version ($size MB)!"
  mv "$tmp" "$input"
}

compress_image() {
  local img=$1
  echo "   ➤ Bild: Komprimiere: $img"

  # ImageMagick-Kommando: Qualität 80
  magick "$img" -quality 80 "$img-compressed"
  mv "$img-compressed" "$img"

  echo "      ✔ Bildkomprimierung abgeschlossen (Qualität 80)"
}


# =================================================================
# HAUPT-LOGIK: Dateien finden und Typ bestimmen
# =================================================================

echo "🚀 Media Optimizer gestartet!"

# 1. Video-Verarbeitung
echo -e "\n🎬 Schritt 1: Videos komprimieren..."
# Erstellt eine Regex-Liste der Video-Endungen (z.B. \( -iname "*.mp4" -o -iname "*.mov" \))
VIDEO_FIND_COMMAND=$(printf -- '-iname "*.%s" -o ' "${VIDEO_EXTENSIONS[@]}")
# Entfernt das letzte ' -o '
VIDEO_FIND_COMMAND=${VIDEO_FIND_COMMAND% -o }

# Führt den Find-Befehl aus und leitet jedes Ergebnis an die Funktion
find . -type f \( ${VIDEO_FIND_COMMAND} \) | while read -r file; do
    compress_video "$file"
done
echo "✅ Video-Verarbeitung abgeschlossen."


# 2. Bilder-Verarbeitung
echo -e "\n🖼 Schritt 2: Bilder komprimieren..."
# Erstellt eine Regex-Liste der Bild-Endungen (z.B. \( -iname "*.jpg" -o -iname "*.png" \))
IMAGE_FIND_COMMAND=$(printf -- '-iname "*.%s" -o ' "${IMAGE_EXTENSIONS[@]}")
IMAGE_FIND_COMMAND=${IMAGE_FIND_COMMAND% -o }

# Führt den Find-Befehl aus und leitet jedes Ergebnis an die Funktion
find . -type f \( ${IMAGE_FIND_COMMAND} \) | while read -r file; do
    compress_image "$file"
done
echo "✅ Bilder-Verarbeitung abgeschlossen."

echo -e "\n🎉 Alle Medien optimiert und fertig!"