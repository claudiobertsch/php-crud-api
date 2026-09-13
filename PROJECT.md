# PROJECT.md — php-crud-api

<!--
  Projektspezifisches Wissen. Gegenstück zur zentral verwalteten CLAUDE.md, die diese Datei
  automatisch mitlädt (@PROJECT.md). Diese Datei wird vom Sync NIE überschrieben.

  Richtwert 200 Zeilen. Nur Dauerhaftes, was Claude nicht aus dem Code ableiten kann:
  Konventionen, Fallstricke, Begründungen, Befehle. Details in docs/ auslagern und von hier
  verlinken. Keine Zwischenstände, Ticket-Nummern oder TODOs.
-->

## Zweck & Kontext

Single-File-PHP-Script (`api.php`), das einer bestehenden Datenbank automatisch eine REST-API
aufsetzt (List/Create/Read/Update/Delete pro Tabelle) — ohne ORM, ohne Konfigurationsdatei für das
Schema. Unterstützt MySQL (InnoDB), PostgreSQL, SQL Server und SQLite. Zielgruppe: Projekte, die
schnell eine CRUD-API über eine vorhandene Datenbank brauchen, ohne ein Backend-Framework
aufzusetzen. Das Single-File-Prinzip ist bewusstes Design (s. README „Installation": Datei
hochladen, fertig) — keine Altlast, die aufgeräumt werden müsste.

## Technologie-Stack

- PHP **5.3+** (siehe README „Requirements") — historischer, sehr niedriger Mindeststand,
  bewusste Abweichung von STACK.md (dort verbindlich: PHP 8.4-fpm). Das Projekt ist eine
  Bibliothek/ein Distributions-Artefakt, kein eigener Betriebs-Stack, und muss auf PHP-Versionen
  laufen, die seine Nutzer einsetzen — nicht auf einer selbst gewählten Version. Kein Upgrade ohne
  ausdrücklichen Auftrag (CLAUDE.md Regel 10/15).
- Kein Composer, keine Abhängigkeiten — das Single-File-Prinzip ist der Zweck des Projekts, nicht
  fehlende Modernisierung.
- Datenbanktreiber: MySQLi, `pdo_pgsql`/`libpq`, SQLSRV, SQLite3 — je nach `dbengine`-Option zur
  Laufzeit gewählt (`api.php`, Klassen `MySQL`, `PostgreSQL`, `SQLServer`, `SQLite`, alle
  implementieren `DatabaseInterface`).
- Tests: PHPUnit (Version nicht gepinnt, siehe `tests/`).

## Architektur & wichtige Verzeichnisse

Das Repo entspricht **nicht** `REPO-STRUKTUR.md` (kein Compose-Stack, kein `images/`-Layout,
Anwendungscode im Wurzelverzeichnis) — historisch gewachsenes Single-File-Projekt ohne
Container-Betrieb. Kein Umbau ohne ausdrücklichen Auftrag (CLAUDE.md Regel 10/14).

- `api.php` — die gesamte Anwendung: DB-Abstraktion (`DatabaseInterface` +
  `MySQL`/`PostgreSQL`/`SQLServer`/`SQLite`), Kernklasse `PHP_CRUD_API` (Request-Routing, Filter,
  Berechtigungen, Transforms) und optional `PHP_API_AUTH`. Konfiguration erfolgt über ein Array
  am Dateiende (siehe README „Configuration"), nicht über eine separate Config-Datei.
- `lib/` — Client-seitige Transform-Helfer für die condensed JSON-Ausgabe
  (`php_crud_api_transform.php`, `.js`).
- `examples/` — Beispiel-Clients (Angular, React, Knockout, Handlebars, Mustache, Zepto) und
  `auth.php` als Beispiel für `PHP_API_AUTH`.
- `extras/core.php` — Zusatzcode außerhalb der Kernbibliothek.
- `tests/` — PHPUnit-Tests (`tests.php`) gegen alle vier DB-Engines, SQL-Dumps je Engine
  (`blog_<engine>.sql`), Konfigurationsvorlage `config.php.dist` → wird beim ersten Testlauf
  automatisch nach `config.php` kopiert (git-ignored, enthält lokale DB-Zugangsdaten).
- `data/blog.db` — Beispiel-SQLite-Datenbank für die Doku-Beispiele.
- `CODEMAP.md` — auto-generierter Funktions-Index; bei größeren Änderungen an `api.php` neu
  erzeugen (`node .claude/tools/codemap.mjs`).

## Befehle

```bash
# Setup (Tests): einmalig anlegen und mit echten Zugangsdaten füllen
cp tests/config.php.dist tests/config.php   # wird bei Bedarf auch automatisch erzeugt

# Tests (benötigt eine leere Datenbank je Engine — Daten werden ÜBERSCHRIEBEN/GELÖSCHT)
phpunit tests/tests.php

# Lint / Typprüfung: kein Linter/Static-Analyzer im Repo konfiguriert
php -l api.php
```

## Projektspezifische Konventionen

- Tabs zur Einrückung in PHP (`.editorconfig`: `indent_style=space`/`indent_size=4` gilt nicht
  einheitlich für `api.php` — dort historisch Tabs; neuer Code im Zweifel dem direkt umgebenden
  Code folgen, s. CLAUDE.md Regel 3).
- Ein-Datei-Prinzip: neue Kernfunktionalität kommt in `api.php`, nicht in neue Module — das ist
  der Zweck des Projekts, keine beliebige Konvention.
- DB-Engine-Erweiterungen (neue Engine) implementieren `DatabaseInterface` vollständig, analog zu
  `MySQL`/`PostgreSQL`/`SQLServer`/`SQLite`.

## Fachliche Regeln

- Callbacks (`table_authorizer`, `record_filter`, `column_authorizer`, `tenancy_function`,
  `input_sanitizer`, `input_validator`) sind der einzige Erweiterungspunkt für Berechtigungen,
  Mandantentrennung und Validierung — sie werden bei jedem Request aufgerufen, nicht optional
  gecacht. Siehe README „Configuration" für Signaturen und Defaults.
- Bekannte, bewusste Limitierungen (README „Limitations"): keine zusammengesetzten Primär-/
  Fremdschlüssel, keine kombinierten UND/ODER-Filter, keine Transaktionen, keine Funktionsaufrufe
  in Queries (`concat`, `sum`, …), keine Batch-Operationen. Das sind keine Bugs, sondern Grenzen
  des Designs.

## Externe Systeme

- Verwandte, separate Projekte (nicht Teil dieses Repos): `PHP-API-AUTH` (JWT/Username-Auth),
  `PHP-SP-API`, `PHP-CRUD-UI`.
- Die Zieldatenbank ist **fremdverwaltet aus Sicht der API selbst**: `PHP_CRUD_API` liest das
  Schema zur Laufzeit (Introspection) und führt keine eigenen Migrationen aus. Schema-Änderungen
  laufen außerhalb dieses Projekts.

## Fallstricke & Constraints

- `tests/tests.php` führt echte Schreiboperationen gegen die konfigurierte Datenbank aus — nur
  gegen eine leere, dedizierte Test-Datenbank laufen lassen (siehe Kommentar in
  `config.php.dist`: „Use an empty database, data will be LOST!").
- `tests/config.php` ist git-ignored und enthält echte Zugangsdaten — nie committen (CLAUDE.md
  Regel 9).
- Der PHP-Mindeststand (5.3+) begrenzt nutzbare Sprachfeatures in `api.php`; neuer Code darf keine
  Syntax voraussetzen, die auf 5.3 nicht läuft, ohne das vorher zu klären.

## Tests & Deployment

- Tests laufen über PHPUnit gegen `tests/tests.php`, das pro Engine (`config.php` →
  `$dbengine`) dieselbe Testsuite ausführt. Keine CI im Repo konfiguriert (`.github/` enthält nur
  die zentrale PR-Vorlage, keine Workflows) — Tests müssen lokal ausgeführt werden.
- Deployment ist Kopieren von `api.php` (und bei Bedarf `lib/`) auf einen PHP-fähigen Webserver;
  kein Build-Schritt, kein Container-Image.

## Projektspezifische Regeln

TODO — bislang keine projektspezifischen Regeln über CLAUDE.md hinaus bekannt; bei Bedarf hier
ergänzen (s. Regel 0).
