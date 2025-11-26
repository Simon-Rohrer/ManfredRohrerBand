# Manfred Rohrer Band Website

Moderne, responsive Website für die Manfred Rohrer Band mit Hero-Slider, Band-Mitgliedern, Audio-Player, Galerie und Booking-Formular.

## 🚀 Projekt Starten

### Entwicklung (Lokal)

1.  Öffne das Projekt in VS Code.
2.  Drücke **F5** (oder starte "Run and Debug").
3.  Der Browser öffnet sich automatisch unter: **http://localhost:8000**

Alternativ über Terminal:
```bash
cd src/frontend
python3 -m http.server 8000
```

### Veröffentlichung (Deployment)

Der Ordner `src/frontend` ist deine fertige Webseite.
Lade den **Inhalt** dieses Ordners auf deinen Webserver oder GitHub Pages hoch.

## 📁 Projektstruktur

Das Projekt ist in Frontend und Backend unterteilt, wobei aktuell der Fokus auf dem Frontend liegt.

```
manfredrohrerband/
├── src/
│   ├── frontend/              # Hauptordner der Webseite
│   │   ├── index.html         # Startseite
│   │   ├── impressum.html     # Impressum
│   │   ├── datenschutz.html   # Datenschutz
│   │   ├── assets/            # Medien (Bilder, Audio, Video)
│   │   │   ├── images/
│   │   │   │   ├── bandPhotos/  # Bandfotos
│   │   │   │   ├── members/     # Mitgliederfotos
│   │   │   │   └── logo/        # Logos
│   │   │   ├── audio/         # MP3 Dateien
│   │   │   └── video/         # Videodateien
│   │   ├── components/        # Wiederverwendbare HTML-Teile
│   │   │   ├── header.html    # Navigation
│   │   │   └── footer.html    # Footer
│   │   ├── styles/            # CSS Stylesheets
│   │   └── scripts/           # JavaScript Logik
│   └── backend/               # Platzhalter für Backend-Logik
└── README.md                  # Diese Datei
```

## ✨ Features

- **Hero Slider** - Automatischer Bildwechsel mit manueller Steuerung
- **Band Members** - 8 Mitglieder mit Fotos und Beschreibungen
- **Audio Player** - Integrierter Player für 3 Songs
- **Galerie** - Lightbox-Galerie
- **Booking Form** - Kontaktformular mit Event-Typen
- **Responsive Design** - Optimiert für Desktop & Mobile

## 🔧 Komponenten-System

Header und Footer werden dynamisch geladen:
- Änderungen in `src/frontend/components/header.html` oder `footer.html` erscheinen automatisch auf allen Seiten.
- Keine Code-Duplikation.

## 📝 Inhalte anpassen

- **Bilder:** Dateien in `src/frontend/assets/images/` austauschen.
- **Audio:** MP3-Dateien in `src/frontend/assets/audio/` ersetzen.
- **Texte:** HTML-Dateien in `src/frontend/` bearbeiten.
- **Styling:** `src/frontend/styles/style.css` anpassen.

---

**Tipp:** Nach Änderungen im Code einfach die Seite im Browser neu laden (F5 / Cmd+R).
