# REPO-STRUKTUR.md — verbindlicher Aufbau eines Repositories

> **Diese Datei wird zentral verwaltet** (Repo `rw-dev-standards`) und ist in allen Projekten
> identisch — wie [CLAUDE.md](CLAUDE.md), zu der sie gehört (Regel 14). Sie beschreibt **den
> Aufbau**, nicht den Inhalt eines Repos, und ist deshalb projektneutral: kein Projektname, kein
> Servicename. Geändert wird sie ausschließlich im zentralen Repo und nur auf ausdrücklichen
> Auftrag.
>
> Womit das konkrete Repo davon abweicht, steht in **PROJECT.md** — nicht hier.

---

## Grundsatz: alles läuft als Image

Jeder betriebene Dienst ist ein **eigenes Docker-Image**. Betrieben wird über Compose, und Compose
**zieht** fertige Images aus der Registry, statt sie zu bauen. Daraus folgt:

- Im Compose-File steht `image:`, nie `build:`. Gebaut wird in der CI, je Image einzeln.
- Kein Dienst läuft „aus dem Wurzelverzeichnis heraus". Anwendungscode liegt immer in dem
  Verzeichnis, aus dem sein Image gebaut wird.
- **Die Konfiguration eines Dienstes gehört in sein Image**, nicht als Bind-Mount neben das
  Compose-File. Auch ein Dienst, der nur aus einem Standardimage plus einer Konfigurationsdatei
  besteht, bekommt deshalb ein eigenes Image-Verzeichnis: darin ein `Dockerfile` mit
  `FROM <standardimage>` und die Konfiguration daneben. Sonst hängt das Laufzeitverhalten des
  Containers davon ab, aus welchem Verzeichnis jemand Compose aufgerufen hat — statt am Image zu
  hängen, das in der Registry liegt und einen Stand hat.
- **Bind-Mounts sind für Daten da**, nicht für Konfiguration: Datenverzeichnisse, Ablagen,
  Protokolle. Ein Standardimage ohne eigene Konfiguration kommt weiterhin direkt aus dem Compose-File.
- Ein eigenes Image **friert sein Basis-Image ein**: eine Sicherheitsaktualisierung des
  Basis-Images erreicht den Stack erst mit einem Neubau. Die CI baut deshalb nicht nur bei
  Änderungen, sondern zusätzlich turnusmäßig alle Images neu.
- Was sich nicht containerisieren lässt (native Desktop- oder Mobile-Clients), bekommt trotzdem
  ein eigenes Verzeichnis auf oberster Ebene — es hängt nur nicht am Compose-Stack.

## Wurzelverzeichnis

Dort liegen **Doku, repoweite Konfiguration und Verzeichnisse — kein Anwendungscode**:

| Eintrag | Inhalt |
|---|---|
| `CLAUDE.md` | zentral verwaltet: allgemeine Arbeitsregeln |
| `REPO-STRUKTUR.md` | zentral verwaltet: diese Datei |
| `PROJECT.md` | Projektwissen (Kern), verlinkt die Bereichs-Doku |
| `README.md` | Betriebs- und Setup-Sicht für Menschen |
| `CODEMAP.md` | auto-generierter Funktions-Index (s. CLAUDE.md Regel 2) |
| `.claude/` | zentral verwaltet; `local/` darin gehört dem Projekt |
| `.github/workflows/` | CI: Image-Builds, Prüfungen, Standards-Sync |
| `.github/pull_request_template.md` | zentral verwaltet: Vorlage für die PR-Beschreibung |
| `docker-compose[_<zweck>]/` | je ein Verzeichnis pro Compose-Stack (s.u.) |
| `images/` | je ein Verzeichnis pro Docker-Image (s.u.) |
| `docs/` | Bereichs-Doku, sobald die README nicht mehr reicht |
| `<plattform>_<name>/` | Komponenten ohne Image (s.u.) |
| repoweite Dotfiles | `.gitignore`, `.editorconfig`, `.gitattributes` |

**Nicht** ins Wurzelverzeichnis gehören `Dockerfile`, `docker-compose.yml`, `src/`, `app/`,
`tests/`, Abhängigkeitsdateien (`package.json`, `composer.json`, `requirements.txt`, Lockfiles)
und deren Installationsverzeichnisse. Das alles gehört zu genau einer Komponente und liegt in
deren Verzeichnis.

## Compose-Stacks

- **Ein** Stack: Verzeichnis `docker-compose/`.
- **Mehrere** Stacks (verschiedene Standorte, Netze oder Betriebsumgebungen): je ein Verzeichnis
  `docker-compose_<zweck>/`. Der Suffix benennt den Zweck, nie eine laufende Nummer.
- Jedes Stack-Verzeichnis enthält das Compose-File **und die zugehörige Env-Datei** — beides
  beieinander, damit der Startbefehl eindeutig ist und kein Stack die Werte eines anderen zieht.
- **Mehr nicht.** Konfigurationsdateien einzelner Dienste liegen in deren Image-Verzeichnis
  (s. Grundsatz oben); ein Stack-Verzeichnis, in dem ein Konfigurationsbaum steht, ist ein Befund.
- Die Env-Datei enthält ausschließlich Platzhalter; Produktivwerte werden nie committet
  (CLAUDE.md Regel 9).
- Der Startbefehl je Stack steht in der README.

## `images/`

- Ein Unterverzeichnis je Image. **Der Verzeichnisname ist der Image-Name** in der Registry und
  taucht genauso im Compose-File wieder auf — eine Umbenennung ist deshalb nie nur kosmetisch.
- Benennung `<rolle>_<name>`, durchgehend klein: die Rolle ordnet grob ein (etwa Web-Anwendung,
  Datenverarbeitung, Medien), danach folgt der sprechende Name. Der **Unterstrich** trennt Rolle
  und Name, **Bindestriche** gliedern den Namen.
- Jedes Image-Verzeichnis ist für sich vollständig: `Dockerfile`, Quellcode, Konfiguration,
  Abhängigkeitsdateien und — sobald es nicht trivial ist — eine eigene `README.md`.
- Ein Verzeichnis, das nur ein `Dockerfile` mit `FROM <standardimage>` und eine Konfigurationsdatei
  enthält, ist **kein Zeichen von Überbau**, sondern der Normalfall für Infrastrukturdienste.
- Die CI baut je Verzeichnis einzeln und nur, wenn sich darin etwas geändert hat — plus den
  turnusmäßigen Lauf über alle Images (s. Grundsatz oben).

## Komponenten ohne Image

Native Clients, Mobile-Apps und Agents, die nicht im Container laufen, liegen auf oberster Ebene
als `<plattform>_<name>/` — gleiche Schreibweise wie bei den Images, mit eigener `README.md` und
dem Auslieferungsweg ihrer Plattform statt Compose.

## `docs/`

Flach, eine Datei je Thema, Dateinamen klein und mit Bindestrich. **Jede Datei ist aus
`PROJECT.md` verlinkt** — was nirgends verlinkt ist, findet niemand. Kernwissen bleibt in
`PROJECT.md`, Details kommen hierher (CLAUDE.md Regel 12).

## Bestand: Abweichungen

Ältere Repos entsprechen dem noch nicht. Das wird **nicht nebenbei** umgebaut (CLAUDE.md Regel 10):

1. Die Abweichung wird in `PROJECT.md` benannt — mit einem Satz, warum der Aufbau so ist.
2. Der Umbau ist ein eigener, ausdrücklich beauftragter Vorgang in einem eigenen Commit; er
   berührt Compose-Files, CI und Doku gleichzeitig und gehört deshalb nicht in eine Feature-Änderung.
3. **Neue** Bestandteile eines Altrepos folgen trotzdem diesem Standard, soweit das ohne Umbau des
   Bestands geht.
