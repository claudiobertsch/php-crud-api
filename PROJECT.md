# PROJECT.md — <Projektname>

<!--
  Projektspezifisches Wissen. Gegenstück zur zentral verwalteten CLAUDE.md, die diese Datei
  automatisch mitlädt (@PROJECT.md). Diese Datei wird vom Sync NIE überschrieben.

  Richtwert 200 Zeilen. Nur Dauerhaftes, was Claude nicht aus dem Code ableiten kann:
  Konventionen, Fallstricke, Begründungen, Befehle. Details in docs/ auslagern und von hier
  verlinken. Keine Zwischenstände, Ticket-Nummern oder TODOs.
-->

## Zweck & Kontext

TODO — Was macht das Projekt, für wen, welches fachliche Problem löst es?

## Technologie-Stack

TODO — Sprachen, Frameworks, Datenbank, Laufzeitumgebung, jeweils mit Version.

## Architektur & wichtige Verzeichnisse

TODO — Wie hängen die Teile zusammen? Nur was nicht offensichtlich ist: der grobe Aufbau, wo
welche Art von Code liegt, welche Wege durch das System es gibt. Den Standardaufbau selbst nicht
wiederholen (der steht in `REPO-STRUKTUR.md`) und keine Versionsvorgabe (die steht in
`STACK.md`) — wohl aber jede **Abweichung** davon, mit Grund.

## Befehle

TODO — Der praktisch wichtigste Abschnitt. Wie startet, baut, testet, lintet man das Projekt?

```bash
# Setup
# Start
# Tests
# Lint / Typprüfung
```

## Projektspezifische Konventionen

TODO — Nur Abweichungen von den Defaults des Stacks bzw. von den Regeln in CLAUDE.md:
Benennung, Zeitzonen, Fehlerbehandlung, Styling, Migrations-/Änderungswege.

## Fachliche Regeln

TODO — Geschäftslogik, die man dem Code nicht ansieht: Berechnungen, Status-Übergänge,
Sonderfälle, „warum das so und nicht anders".

## Externe Systeme

TODO — Fremdsysteme, APIs, Importe, Datenquellen. Insbesondere: was ist fremdverwaltet und damit
read-only (CLAUDE.md Regel 7)?

## Fallstricke & Constraints

TODO — Was schon einmal schiefgegangen ist, und was man nicht tun darf. Der wertvollste Abschnitt,
sobald das Projekt ein paar Monate alt ist.

## Tests & Deployment

TODO — Was wird wie getestet, was läuft in CI, wie kommt eine Änderung in Betrieb?

## Projektspezifische Regeln

TODO — Nummerierte Regeln, die die Regeln in CLAUDE.md ergänzen oder verschärfen. Bei Konflikt
gilt diese Datei.
