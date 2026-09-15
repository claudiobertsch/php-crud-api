# STACK.md — verbindliche Technologien und Versionen

> **Diese Datei wird zentral verwaltet** (Repo `rw-dev-standards`) und ist in allen Projekten
> identisch — wie [CLAUDE.md](CLAUDE.md), zu der sie gehört (Regel 15), und wie
> [REPO-STRUKTUR.md](REPO-STRUKTUR.md). Sie beantwortet **womit** gebaut wird; `CLAUDE.md`
> beantwortet **wie** gearbeitet wird und `REPO-STRUKTUR.md`, **wie ein Repo aufgebaut ist**.
> Geändert wird sie ausschließlich im zentralen Repo und nur auf ausdrücklichen Auftrag.
>
> Womit das konkrete Repo davon abweicht, steht in **PROJECT.md** — nicht hier.

---

## Wofür diese Datei da ist

Ohne festgelegte Versionen entscheidet jedes neue Projekt neu — und die Entscheidung fällt
stillschweigend auf das, was beim letzten Mal zufällig zur Hand war. Diese Datei beantwortet zwei
Fragen, die sonst niemand beantwortet:

- **Ein neues Projekt entsteht** — welche Version, welche Variante?
- **Ein neuer Container kommt in ein bestehendes Repo** — worauf setzt er auf?

Sie ist kein Upgrade-Auftrag. Die Spalte *Verbindlich* gilt für **Neues**; die Spalte *Bestand*
nennt, was heute abweicht und wie damit umzugehen ist.

## Wie die Tabelle zu lesen ist

- **Verbindlich** — der Wert für alles, was neu entsteht. Wer davon abweicht, begründet es in
  `PROJECT.md`.
- **Warum** — der Grund. Ohne ihn lässt sich in einem Jahr nicht mehr unterscheiden, ob ein Wert
  eine Entscheidung war oder ein Zufall. Eine Zeile ohne Grund ist unvollständig.
- **Bestand** — bekannte Abweichungen. Ein Eintrag hier ist **kein** Auftrag, sofort umzubauen
  (CLAUDE.md Regel 10) — er macht die Abweichung nur sichtbar, damit sie nicht als Vorbild dient.

---

## Sprachen und Laufzeiten

| Technologie | Verbindlich | Warum | Bestand |
|---|---|---|---|
| PHP | `8.4`, Variante **`fpm`** + eigener nginx-Container | Ein Prozess je Container; `-apache` bündelt den Webserver in den Anwendungscontainer | ein Repo auf `8.3-apache` |
| Laravel | `13` | aktuelle Hauptversion, produktiv im Einsatz | ein Repo auf `12` |
| Python | `3.13`, **volles Image** — nicht `-slim`, nicht `-alpine` | Build-Toolchain immer vorhanden: Pakete ohne manylinux-Wheel kompilieren sonst nicht, und der Fehler fällt erst im Container auf | — |
| Node.js | `22` (LTS) | längere Unterstützung als 20 | ein Repo auf `20` |
| .NET | `net8.0` | — | — |

## Datenbanken

| Technologie | Verbindlich | Warum | Bestand |
|---|---|---|---|
| PostgreSQL | `17` | Standard für alles Neue: `jsonb`, Check Constraints, keine Collation-Fallen | — |
| MariaDB | `12.3` (LTS) | **nur**, wo ein fremdverwaltetes System dieselbe Datenbank belegt | ein Repo (Fremdsystem-Anbindung) |
| MySQL | — | keine dritte Datenbank | — |

Eine Datenbank ist die Regel, zwei sind eine begründete Ausnahme, drei sind ein Versehen. MariaDB
steht hier ausschließlich für den Fall, dass ein anderes System die Datenbank vorgibt.

## Infrastruktur-Images

| Technologie | Verbindlich | Warum |
|---|---|---|
| nginx | `1.27-alpine` | der eine Webserver und Reverse Proxy — eine Konfigurationssprache, ein Satz Betriebswissen |
| Caddy | — | kein zweiter Webserver |
| Redis | `7-alpine` | — |

Vor php-fpm, vor einer Anwendung, als Reverse Proxy: **immer nginx**. Automatisches TLS ist der
übliche Grund, es anders zu machen, und er trägt nicht: Zertifikate holt ein ACME-Client daneben,
nicht der Webserver selbst. Wo viele oder wechselnde Hostnamen im Spiel sind, ist das Mittel ein
Wildcard-Zertifikat — nicht eine zweite Webserver-Technologie, die jeder, der den Stack anfasst,
zusätzlich beherrschen muss.

## Abhängigkeiten und Tags

| Gegenstand | Verbindlich | Warum |
|---|---|---|
| Basis-Images im Dockerfile | konkreter Tag, **nie** `latest` | ein Rebuild muss dasselbe ergeben |
| Eigene Images im Compose | `latest` | die CI baut, der Stack zieht — das Pinning sitzt im Build, nicht im Stack |
| Python-Abhängigkeiten | exakt gepinnt (`paket==1.2.3`) | ohne Pin zieht jeder Rebuild still eine neue Hauptversion |
| PHP-/Node-Abhängigkeiten | Caret-Constraint **plus committete Lock-Datei** | die Lock-Datei ist das eigentliche Pinning |
| `composer.json` → `"php"` | dieselbe Version wie das Basis-Image | eine laxere Constraint beschreibt nicht, worauf tatsächlich läuft |

Die ersten beiden Zeilen widersprechen sich nur scheinbar: **Basis**-Images kommen von außen und
müssen reproduzierbar sein; **eigene** Images entstehen in der CI, die ihren Stand bereits über
den Commit festhält.

## GitHub Actions

| Action | Verbindlich |
|---|---|
| `actions/checkout` | `v7` |
| `actions/create-github-app-token` | `v3` |
| `actions/setup-node` | `v7` |
| `actions/setup-dotnet` | `v6` |
| `docker/setup-buildx-action` · `docker/login-action` | `v4` |
| `docker/build-push-action` | `v7` |

---

## Eine Version anheben

1. Den Wert **hier** ändern — samt Grund, falls er sich mitändert.
2. Bestehende Repos ziehen **nicht** automatisch nach. Jedes Upgrade ist ein eigener, ausdrücklich
   beauftragter Vorgang im jeweiligen Repo (CLAUDE.md Regel 10) — bis dahin steht die Abweichung
   in der Spalte *Bestand*.

Ein Haupt­versionssprung ist damit immer eine Entscheidung, nie ein Nebeneffekt. Automatische
Abhängigkeits-Updates bleiben deshalb auf Patch- und Nebenversionen innerhalb der hier gepinnten
Hauptversionen beschränkt.

## Wie eine Abweichung sichtbar wird

Diese Datei durchzusetzen ist nicht Aufgabe eines Menschen mit gutem Gedächtnis. Der nächtliche
Standards-Lauf hält den Bestand des Repos gegen die Tabellen oben — Basis-Images, Images im
Compose-File, Action-Pins, Python-Pins, Laravel- und .NET-Version — und hängt das Ergebnis an den
Text des Sync-Pull-Requests. Dort steht je Fund die Stelle, der gefundene und der verbindliche
Wert.

Der Bericht **blockiert nichts**: ob eine Abweichung zulässig ist, entscheidet die Begründung in
`PROJECT.md`, und das kann kein Skript beurteilen. Er erscheint nur, wenn der Lauf ohnehin einen
Pull Request anlegt oder aktualisiert; findet er nichts zu synchronisieren, steht er allein im
Protokoll des Laufs.

Nicht geprüft wird, was sich nicht eindeutig ablesen lässt — etwa ob `composer.json` dieselbe
PHP-Version führt wie das Basis-Image. Ein leerer Bericht heißt also „nichts Auffälliges", nicht
„alles geprüft".

## Abweichen

Eine Abweichung ist zulässig, wenn ein äußerer Zwang sie erfordert — ein fremdverwaltetes System,
eine Plattformvorgabe, eine Bibliothek ohne Unterstützung für die verbindliche Version. Sie gehört
dann mit **einem Satz Begründung** in die `PROJECT.md` des Repos. Eine Abweichung ohne Begründung
ist keine Abweichung, sondern Drift.
