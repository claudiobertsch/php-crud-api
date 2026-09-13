---
description: Eine dauerhafte Projekterkenntnis an der richtigen Stelle in PROJECT.md aufnehmen
argument-hint: [Erkenntnis, die dauerhaft festgehalten werden soll]
---

Nimm folgende Erkenntnis dauerhaft in `PROJECT.md` auf:

$ARGUMENTS

Vorgehen:

1. **Prüfe zuerst, ob sie dort hingehört.** Nicht aufnehmen und stattdessen kurz begründen, wenn
   sie temporär ist (Zwischenstand, Ticket, TODO, einmaliger Workaround), aus dem Code unmittelbar
   ablesbar ist, oder bereits durch eine Regel in `CLAUDE.md` abgedeckt wird.
2. **Lies `PROJECT.md`** und finde den passenden bestehenden Abschnitt. Nur wenn wirklich keiner
   passt, einen neuen anlegen.
3. **Keine Doppelung**: Sagt die Datei dasselbe schon woanders, schärfe die bestehende Stelle,
   statt eine zweite anzulegen. Widerspricht die Erkenntnis einer bestehenden Aussage, korrigiere
   diese und weise darauf hin.
4. **Altitude beachten**: Kernwissen kurz in `PROJECT.md`, Details in die Bereichs-Doku und von
   dort verlinken. Ist der Eintrag länger als ein paar Zeilen, gehört der Großteil in die
   Bereichs-Doku.
5. Formuliere im Stil der Datei — knapp, konkret, überprüfbar, in der Sprache der Datei.

Zeige zum Schluss den eingefügten Text und den Abschnitt, in den er gewandert ist. Nicht committen.
