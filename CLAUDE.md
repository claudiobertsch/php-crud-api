@PROJECT.md

# CLAUDE.md — Arbeitsregeln

> **Diese Datei wird zentral verwaltet** (Repo `rw-dev-standards`) und ist in allen Projekten
> identisch. Sie enthält ausschließlich projektneutrale Arbeitsregeln — **kein** Wissen über dieses
> konkrete Repo.
>
> **Alles Projektspezifische steht in [PROJECT.md](PROJECT.md)** — oben automatisch mitgeladen:
> Zweck, Stack, Architektur, Konventionen, Betrieb, fachliche Regeln. **Bei Konflikt zwischen
> beiden Dateien gilt PROJECT.md.**

---

## 0. Einstieg in eine Aufgabe

`PROJECT.md` ist über den Import ganz oben bereits im Kontext — existiert die Datei nicht, bleibt
der Import wirkungslos und Regel 12 gilt trotzdem.

1. **PROJECT.md** lesen: Aufbau, Konventionen, projektspezifische Regeln.
2. Vertiefende Doku nur bei Bedarf nachschlagen (PROJECT.md verlinkt sie).
3. Erst dann Code ansehen — gezielt, nicht flächendeckend (s. Regel 2).

Fehlt eine PROJECT.md oder steht dort nur der Platzhalter, ist das der erste Mangel: beim ersten
größeren Auftrag füllen (Zweck, Stack, Architektur, Befehle, Konventionen) statt das Wissen in
diese Datei zu schreiben.

---

## Regeln

1. **Erst analysieren, dann ändern.** Vor größeren Umbauten den betroffenen Bestand verstehen und
   das Vorgehen skizzieren — nicht mitten in einer halb verstandenen Struktur anfangen. Bei
   mehreren vertretbaren Wegen den Weg nennen, statt stillschweigend einen zu wählen.

2. **Token-sparsam arbeiten.** Vor breitem Greppen erst die vorhandenen Abkürzungen nutzen: den
   Funktions-Index **`CODEMAP.md`** im Repo-Root und die Doku. Der Index beantwortet „wo ist
   Funktion/Klasse X?" ohne Suche; er ist auto-generiert (`node .claude/tools/codemap.mjs`) und
   wird nie von Hand editiert — fehlt er, einmal erzeugen. Nachschlage- und Findefragen gehen an
   den Subagent **`sucher`**, Doku-Nacharbeit samt Neuerzeugung des Index an **`doku`** — beide
   laufen bewusst auf günstigeren Modellen. Suchen gezielt statt flächendeckend, Dateien
   ausschnittsweise statt komplett lesen.

3. **Bestehende Muster fortschreiben.** Neuer Code sieht aus wie der Code daneben — gleiche
   Bibliotheken, gleiche Struktur, gleiche Benennung, gleiche Kommentardichte. Keine neue
   Technologie, kein neues Framework, kein neues Muster ohne Rückfrage.

4. **Keine unnötigen Abstraktionen, keine unnötigen Dependencies.** Die einfachste Lösung, die zum
   Projektstil passt. Kein Service-/Wrapper-Layer „für später", keine Konfigurierbarkeit ohne
   konkreten zweiten Anwendungsfall. Eine neue Abhängigkeit braucht einen Grund, der mit
   Bordmitteln nicht zu erfüllen ist — und wird angekündigt, nicht nebenbei eingezogen.

5. **Single Source of Truth.** Was es einmal gibt, wird nicht ein zweites Mal formuliert — Regeln,
   Bedingungen, Konstanten, Abfragen werden wiederverwendet, nicht nachgebaut. Vor einer neuen
   Funktion prüfen, ob es sie schon gibt. Wenn dieselbe Aussage doch an zwei Stellen stehen muss
   (Code + Konfiguration, Code + Doku), gehören beide Stellen **in denselben Commit**.

6. **Sicherheit vor Bequemlichkeit.** Eingaben von außen sind ungeprüft, bis sie geprüft sind;
   keine Rechteausweitung, keine Abkürzung an Authentifizierung/Autorisierung vorbei, keine
   Umgehung vorhandener Schutzmechanismen. Im Zweifel die sichere Variante und den Hinweis dazu.

7. **Fremdverwaltete Daten sind read-only.** Tabellen, Dateien oder Schemata, die ein anderer
   Service/Import erzeugt, werden nur gelesen — keine Schema-Änderungen, keine Schreibzugriffe.
   Eigene Strukturänderungen laufen über den Migrations-/Änderungsweg des Projekts und betreffen
   nur die projekteigenen Strukturen. Welche das sind: PROJECT.md.

8. **Löschen heißt vollständig löschen.** Wird eine Quelle, Tabelle, Seite, Konfiguration oder ein
   Feature entfernt, gehören alle Spuren **in denselben Commit**: Aufräum-Skripte/Migrationen,
   Statuseinträge, Verweise im Code, Menüpunkte, Doku. Vorher prüfen, wer noch darauf zugreift.
   Umgekehrt gilt: ein „verwaister" Rest ist entweder wirklich verwaist (dann bereinigen) oder
   versehentlich abgeklemmt (dann reparieren) — vor dem Löschen klären, was von beidem zutrifft.

9. **Keine Secrets im Repo.** Konfigurationsdateien enthalten Platzhalter; Produktivwerte
   (Passwörter, Tokens, Schlüssel, interne Hostnamen) werden nie committet und nie in Doku,
   Commit-Messages oder Issues übernommen.

10. **Nichts Fremdes ungefragt umbauen.** Keine Reformatierungen, Umbenennungen, Dependency-Updates
    oder Refactorings außerhalb des Auftrags. Fällt unterwegs ein echtes Problem auf: benennen,
    nicht heimlich mitfixen.

11. **Nachvollziehbar arbeiten und tatsächlich prüfen.** Änderungen klein und thematisch geschnitten
    halten, aussagekräftige Commit-Messages. Die im Projekt vorhandenen Tests, Linter und
    Typprüfungen **ausführen**, nicht nur erwähnen (welche das sind: PROJECT.md). Keine
    unverifizierten Erfolgsmeldungen: Was nicht getestet oder nicht ausgeführt wurde, wird als
    solches benannt — ebenso fehlgeschlagene Prüfungen. Das Ausführen selbst geht an den Subagent
    **`pruefer`**: er lässt die Prüfungen in seinem eigenen Kontext laufen und meldet Urteil und
    Fehlerstellen statt der Protokolle. Im Pull Request wird die zentrale
    Vorlage ausgefüllt, nicht gelöscht: sie fragt genau diese Punkte ab.

12. **Dokumentation aktuell halten.** Jede Änderung (Feature, Konfiguration, Service, Löschung) wird
    in derselben Änderung dokumentiert — an der richtigen Altitude: Kernwissen in **PROJECT.md**,
    Details in der jeweiligen Bereichs-Doku, Betriebs-/Setup-Sicht in der **README**.
    Den Funktions-Index nach Struktur-/Funktionsänderungen neu erzeugen (s. Regel 2). Zielort ist
    dabei **nie** diese Datei, sondern PROJECT.md bzw. die Bereichs-Doku (s. Regel 13).

13. **Sprache.** Kommentare, UI-Texte und Doku in der Projektsprache (s. PROJECT.md); Code-, API-
    und Framework-Konventionen bleiben in ihrer üblichen Sprache (i.d.R. englisch).

14. **Repo-Struktur.** Wie ein Repository aufgebaut ist — Wurzelverzeichnis, Compose-Stacks, je ein
    Verzeichnis pro Docker-Image, Bereichs-Doku —, legt der zentrale Standard
    [REPO-STRUKTUR.md](REPO-STRUKTUR.md) fest. Vor dem Anlegen, Verschieben oder Umbenennen von
    Verzeichnissen der obersten Ebene dort nachsehen. Wovon der Bestand abweicht, steht in
    PROJECT.md und wird nicht nebenbei umgebaut (s. Regel 10).

15. **Technologien und Versionen.** Womit gebaut wird — Sprachversionen, Laufzeiten, Datenbanken,
    Basis-Images, Abhängigkeits-Pinning —, legt der zentrale Standard [STACK.md](STACK.md) fest.
    Vor dem Anlegen eines Projekts, eines Images oder eines Containers dort nachsehen, statt den
    Wert aus einem anderen Projekt zu übernehmen. Die Vorgaben gelten für **Neues**; Bestand zieht
    nur auf ausdrücklichen Auftrag nach (s. Regel 10). Eine begründete Abweichung gehört in
    PROJECT.md — eine unbegründete ist Drift.

---

## Zentral verwaltete Dateien

Diese Dateien kommen aus `rw-dev-standards` und werden bei jedem Sync überschrieben. **Änderungen
daran gehen verloren** und sind deshalb hier verboten:

```
CLAUDE.md   REPO-STRUKTUR.md   STACK.md   .github/pull_request_template.md
.claude/agents/   .claude/commands/   .claude/rules/   .claude/tools/
.github/workflows/standards-*.yml
```

Die PR-Vorlage ist die Checklistenform dieser Regeln und deshalb überall dieselbe. Unter
`.github/workflows/` gehört der Zentrale ausschließlich der Namensraum `standards-*.yml`; jeder
andere Workflow gehört dem Projekt und wird nie angefasst.

Ausgenommen ist jeweils der Unterordner **`local/`** (`.claude/agents/local/` usw.) — er bleibt
unangetastet und ist der Platz für projekteigene Agents, Commands und Regeln.

Daraus folgt:

- **Projektwissen gehört ausschließlich in `PROJECT.md`** (Kernwissen) oder in die Bereichs-Doku
  (Details). Verboten sind in den zentralen Dateien: Verzeichnis-/Dateipfade, Klassen-, Tabellen-,
  Spalten- und Feldnamen, Framework-, Bibliotheks- und Servicenamen, Hosts, Ports,
  Umgebungsvariablen, Beschreibungen von Seiten, Modulen oder Abläufen — kurz alles, was in einem
  anderen Repo falsch oder sinnlos wäre.
- **Neue dauerhafte Projektregeln** kommen nach `PROJECT.md`, nicht hierher.
- **Temporäres gehört nirgendwo hin**: Zwischenstände, Ticket-Nummern, „TODO nächste Woche",
  Debug-Notizen und einmalige Workarounds sind kein Doku-Inhalt.
- **Änderungen an dieser Datei oder an den zentralen `.claude`-Dateien** sind ausschließlich
  Änderungen an allgemeinen Arbeitsregeln, werden im Repo `rw-dev-standards` vorgenommen und
  **explizit beauftragt** — nie nebenbei im Zuge einer Feature-Änderung.
