---
title: Über diese App
---

# Über diese App

## Generelles

Ich hatte schon lange das Bedürfnis mal wieder den Client für das [weltbeste Forum](https://www.maniac-forum.de) der Welt zu aktualisieren. Seit der [Version von 2008](https://widmann.maniac-forum.de/) hat sich in der Webtechonologie vieles weiterentwickelt und auch mein Wissen um das Thema Webapps ist deutlich besser geworden.

Der Release von [Remix.run](https://www.remix.run) hat mich dazu animiert, das Projekt jetzt endlich in Angriff zu nehmen. Das Ziel ist es, mit der Webapp die Features, die in den [alternativen Clients](https://maniac-forum.de/apps.html) verfügbar waren auch in der Browser-Version zu unterstützen und den bestmöglichen Client für das [Maniac-Forum](https://www.maniac-forum.de) zu erstellen.

## Features

- Themes: dark, light, neon
- responsive Darstellung zum optimalen Vergnügen in allen Auflösungen
- Authorisierung im Forum für posting, PMs
- Benutzerprofile
- attraktive Darstellung der Meldungen
- Hervorhebung von gelesenen Meldungen
- Darstellung, wenn neue Meldungen in einem Thread vorhanden sind
- Meldungen erstellen, editieren oder neue Threads erstellen
- Alternative Sortierung in Threads, damit Äste mit neuen Antworten oben einsortiert sind

### In Planung

- Suche
- PMs
- Notifications
- Threadansicht wie im [alten Client](https://widmann.maniac-forum.de/)
- Keyboard-Navigation

## Das Projekt

Wie schon beim [alten Client](https://widmann.maniac-forum.de/), den ich nach einer Weile auf [GitHub](https://github.com/mwidmann/iphone_maniac)veröffentlicht habe, ist das Projekt auf [GitHub](https://github.com/mwidmann/m2022_remix) zu finden.

### Versionshistory

- 0.1.0: Initiale Version (17.01.2022)

  - dark/light mode
  - responsve
  - Authorisierung im Forum für Antworten
  - Benutzerprofile
  - attraktive Darstellung der Meldungen
  - History

- 0.2.0: Featureupdate (21.02.2022)

  - Modus für XL Bildschirme nach Feedback
  - Umstellung, dass in der Threadansicht nicht das Erstellungsdatum, sondern das des der letzten Meldung angezeigt wird
  - Bessere Darstellung der Threads
  - Mail-Benachrichtigung kann aktiviert werden
  - Bugfixes

- 0.2.1: Bugfixing (21.02.2022)

  - Fehlerbehebungen bei der Ansicht auf mobile
  - Fehlerbehebungen beim Posten von Nachrichten, weitere Fehlermeldungen vom Server werden nun angezeigt

- 0.3.0: Featureudpate (01.02.2022)

  - neon Theme hinzugefügt
  - Überarbeitung der Einstellungen
  - Editieren von Meldungen
  - Neue Threads erstellen
  - Anzeige von ungelesenen PMs
  - Überarbeitung des Editors
  - Optimierung des dark modes
  - Alternative Sortierung in Threads
  - Switch zwischen altem und neuen Logo möglich
  - Bugfixes

- 0.4.0: Featureupdate (01.02.2022)
  - About-Seite wurde eingefügt
  - Bugfixes

## Benutzte Open Source Projekte

Dieses Projekt verwendet eine Reihe von Open Source Projekten:

- [Remix.run](https://www.remix.run)
  Das Herzstück des Ganzen.
- [Tailwind CSS](https://tailwindcss.com) CSS Framework mit unzähligen Utility-Classen zur schnellen Erstellung schöner Websites.
- [Cheerio](https://cheerio.js.org/) Parser für HTML um aus dem Daten-Wirrwarr vom Forum, brauchbares JSON zu erstellen.
- [date-fns](https://date-fns.org) um Datum und Zeit zu manipulieren.
- [TypeScript](https://www.typescriptlang.org) um die Code-Komplexität zu verringern.
- [VS Code](https://code.visualstudio.com)
- [Git](https://git-scm.com)
- [React](https://reactjs.org)
- [front-matter](https://github.com/dworthen/js-yaml-front-matter) zum parsen der Metadaten aus den Markdown Dateien.
- [marked](https://marked.js.org) zum parsen der Markdown Dateien.
