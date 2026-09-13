---
description: Den Funktions-Index CODEMAP.md neu erzeugen und das Ergebnis einordnen
---

Erzeuge den Code-Index dieses Repos neu:

```bash
node .claude/tools/codemap.mjs
```

Danach:

1. **Ausgabe des Skripts wiedergeben** (Anzahl Funktionen, Typen, Dateien, Tote-Code-Kandidaten,
   Doc-Abdeckung) und mit dem vorherigen Stand vergleichen, sofern die Datei schon existierte.
2. **`CODEMAP.md` nicht von Hand nachbearbeiten** — sie ist auto-generiert und wird beim nächsten
   Lauf überschrieben.
3. Nur wenn danach gefragt wird: die **Tote-Code-Kandidaten** durchgehen. Das ist eine
   Regex-Heuristik — jeder Kandidat ist vor dem Löschen zu prüfen (dynamische Aufrufe, Templates,
   Views und Reflection erfasst der Index nicht).

Schlägt der Aufruf fehl:

- `node: command not found` → Node.js fehlt auf diesem Rechner; melden, nichts nachinstallieren.
- Datei nicht gefunden → das Repo ist noch nicht an die zentralen Standards angebunden. Melden,
  statt das Skript nachzubauen.

Nicht committen, außer es wird ausdrücklich verlangt.
