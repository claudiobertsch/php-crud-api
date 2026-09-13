<!--
  Zentral verwaltet (Repo `rw-dev-standards`) und in allen Projekten identisch — hier geändert,
  ist die Änderung beim nächsten Sync weg. Sie liegt dort im Original.

  Diese Kommentare sind im fertigen Pull Request unsichtbar. Was nicht zutrifft: Zeile löschen.
-->

## Was und warum

<!-- Zwei, drei Sätze: was ändert sich fachlich, und was war der Anlass. Kein Commit-Log —
     den zeigt GitHub bereits. -->

## Auswirkung beim Einspielen

<!-- Migration, neue Konfiguration, Redeploy, manueller Schritt, Reihenfolge? Auch der Hinweis,
     dass nichts davon nötig ist, gehört hierher. -->

## Geprüft

<!-- Was wurde tatsächlich ausgeführt — mit Ergebnis, nicht als Absicht. Was nicht geprüft werden
     konnte, wird hier ausdrücklich benannt (CLAUDE.md Regel 11). -->

- [ ] Tests, Linter und Typprüfung des Projekts gelaufen (welche das sind: `PROJECT.md`)
- [ ] Doku nachgezogen: `PROJECT.md`, Bereichs-Doku, `README.md` (Regel 12)
- [ ] `CODEMAP.md` neu erzeugt, falls sich Funktionen oder Struktur geändert haben (Regel 2)
- [ ] Keine Secrets, keine Produktivwerte im Diff (Regel 9)
- [ ] Bei einer Entfernung: alle Spuren im selben Commit (Regel 8)
