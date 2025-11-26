<!-- TODO ENTFERNE -->
# Manfred Rohrer Band Website

Moderne, responsive Website für die Manfred Rohrer Band mit Hero-Slider, Band-Mitgliedern, Audio-Player, Galerie und Booking-Formular.

## 🚀 Lokalen Server starten

```bash
cd /Users/simonrohrer/gemini
python3 -m http.server 8000
```

Dann im Browser öffnen: **http://localhost:8000**

## 🛑 Server beenden

**Einfachste Methode:** Drücke `control+C` im Terminal

**Alternative:**
```bash
# Prozess finden
lsof -i :8000

test neue Version
# Prozess beenden (ersetze 27671 mit der angezeigten PID)
kill -9 27671
```

## 📁 Projektstruktur

```
gemini/
├── index.html              # Hauptseite
├── impressum.html          # Impressum
├── datenschutz.html        # Datenschutzerklärung
├── style.css               # Styling
├── main.js                 # JavaScript Funktionalität
├── components/             # Wiederverwendbare Komponenten
│   ├── header.html         # Navigation
│   ├── footer.html         # Footer
│   └── loader.js           # Komponenten-Loader
└── assets/                 # Bilder & Audio
    ├── Band_gesamt/
    ├── Bandmitglieder/
    └── audio/
```

## ✨ Features

- **Hero Slider** - Automatischer Bildwechsel mit manueller Steuerung
- **Band Members** - 8 Mitglieder mit Fotos und Beschreibungen
- **Audio Player** - Integrierter Player für 3 Songs
- **Galerie** - Lightbox-Galerie mit 6 Bildern
- **Booking Form** - Kontaktformular mit Event-Typen
- **Responsive Design** - Optimiert für Desktop & Mobile

## 🔧 Komponenten-System

Header und Footer werden dynamisch geladen:
- Änderungen in `components/header.html` oder `components/footer.html` erscheinen automatisch auf allen Seiten
- Keine Code-Duplikation mehr

## 📝 Inhalte anpassen

- **Bilder:** Ersetze Dateien in `assets/`
- **Audio:** Ersetze MP3-Dateien in `assets/audio/`
- **Texte:** Bearbeite die HTML-Dateien direkt
- **Styling:** Passe `style.css` an

## 🌐 Seiten

- **Hauptseite:** http://localhost:8000
- **Impressum:** http://localhost:8000/impressum.html
- **Datenschutz:** http://localhost:8000/datenschutz.html

---

**Tipp:** Nach Änderungen im Code einfach die Seite im Browser neu laden (F5 / Cmd+R)
