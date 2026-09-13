#!/usr/bin/env node
// Code-Map-Generator — erzeugt CODEMAP.md, einen durchsuchbaren Funktions-/Klassen-Index
// des gesamten Repos.
//
// Zweck: die Frage „wo ist Funktion X?" beantworten, ohne wiederholt breit zu greppen
// (= Token-Verbrauch), und toten Code sichtbar machen. Regex-Index, KEIN AST — dynamische
// Aufrufe (Framework-Lifecycle, `call_user_func`, magische Methoden) können fehlen.
//
// Aufruf:  node .claude/tools/codemap.mjs   (von überall im Repo)
// Ausgabe: CODEMAP.md im Wurzelverzeichnis des Repos.
//
// Zentral verwaltet (rw-dev-standards) — Änderungen hier gehen beim nächsten Sync verloren.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, extname } from 'node:path';

let ROOT;
try {
  ROOT = execSync('git rev-parse --show-toplevel', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {
  console.error('FEHLER: kein Git-Repository — die Dateiliste kommt aus `git ls-files`.');
  process.exit(1);
}
process.chdir(ROOT);
const REPO = basename(ROOT);

// ---------------------------------------------------------------------------
// Datei-Auswahl: git-getrackt (respektiert .gitignore), Code-Sprachen, ohne
// Fremdcode/Build-Artefakte.
// ---------------------------------------------------------------------------
const EXTS = new Set(['.php', '.py', '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx']);
const EXCLUDE =
  /(^|\/)(vendor|node_modules|dist|build|out|coverage|__pycache__|\.venv|venv|\.expo|\.next|storage|bootstrap\/cache)\//;

const tracked = execSync('git ls-files', { maxBuffer: 1 << 28 })
  .toString()
  .split('\n')
  .filter(Boolean);

const files = tracked.filter((f) => EXTS.has(extname(f)) && !EXCLUDE.test(f)).sort();

// ---------------------------------------------------------------------------
// Gruppierung der Ausgabe: das nächstgelegene Verzeichnis mit einer Projektdatei.
// In einem Monorepo ergibt das einen Abschnitt je Teilprojekt, in einem einfachen
// Repo genau einen — ohne dass hier Verzeichnisnamen fest verdrahtet wären.
// ---------------------------------------------------------------------------
const MANIFEST =
  /^(composer\.json|package\.json|pyproject\.toml|requirements[\w.-]*\.txt|setup\.py|go\.mod|Cargo\.toml|Gemfile|pom\.xml|build\.gradle(\.kts)?|[^/]+\.csproj)$/;

const componentDirs = [
  ...new Set(
    tracked
      .filter((f) => MANIFEST.test(basename(f)) && !EXCLUDE.test(f))
      .map((f) => (f.includes('/') ? f.slice(0, f.lastIndexOf('/')) : ''))
  ),
].sort((a, b) => b.length - a.length); // längster (= spezifischster) Treffer gewinnt

function componentOf(file) {
  for (const dir of componentDirs) {
    if (dir === '') return REPO; // Projektdatei liegt im Wurzelverzeichnis
    if (file.startsWith(dir + '/')) return dir;
  }
  // Kein Manifest darüber: nach oberstem Verzeichnis gruppieren.
  return file.includes('/') ? file.slice(0, file.indexOf('/')) : '(Wurzel)';
}

// ---------------------------------------------------------------------------
// Framework-Hooks / magische Methoden, die per Konvention vom Framework
// aufgerufen werden → nicht als „toter Code" melden.
// ---------------------------------------------------------------------------
const FRAMEWORK_HOOKS = new Set([
  '__construct', '__invoke', '__toString', '__get', '__set', '__call', '__callStatic',
  'boot', 'booted', 'register', 'handle', 'render', 'mount', 'up', 'down',
  'up_', 'schedule', 'rules', 'authorize', 'toArray', 'broadcastOn', 'via',
  'getViewName', 'getPermission', 'getTableColumns', 'getDefaultSort', 'table',
  'getHeaderActions', 'getTableQuery', 'form', 'getPages', 'getRelations',
  'getWidgets', 'getColumns', 'getHeaderWidgets', 'getFooterWidgets',
  'setUp', 'main', '__init__', '__str__', '__repr__', '__enter__', '__exit__',
]);

// ---------------------------------------------------------------------------
// Sprach-Parser. Liefern je Datei { fns: [{sig, name, doc}], types: [{kind,name}] }.
// ---------------------------------------------------------------------------

// Erste sinnvolle Zeile eines vorangehenden Kommentars (Docblock/`//`/`#`).
function leadingDoc(lines, defIdx, commentPrefix) {
  let i = defIdx - 1;
  // Leerzeilen/Attribute (#[...]) überspringen.
  while (i >= 0 && (lines[i].trim() === '' || lines[i].trim().startsWith('#['))) i--;
  if (i < 0) return null;
  const t = lines[i].trim();
  // PHP/JS Docblock-Ende
  if (t.endsWith('*/')) {
    for (let j = i; j >= 0; j--) {
      const s = lines[j].trim();
      const m = s.replace(/^\/\*\*?/, '').replace(/\*\/$/, '').replace(/^\*/, '').trim();
      if (m && m !== '/**' && !m.startsWith('@')) return m;
      if (s.startsWith('/*')) break;
    }
    return null;
  }
  // Einzeiler-Kommentar
  for (const p of commentPrefix) {
    if (t.startsWith(p)) {
      const c = t.slice(p.length).trim();
      if (c) return c;
    }
  }
  return null;
}

function parsePhp(lines) {
  const fns = [];
  const types = [];
  const reType = /^\s*(?:final\s+|abstract\s+|readonly\s+)*(class|interface|trait|enum)\s+([A-Za-z_]\w*)/;
  const reFn = /^\s*(?:(?:final|abstract|public|private|protected|static)\s+)*function\s+([A-Za-z_]\w*)\s*\(/;
  lines.forEach((line, idx) => {
    const mt = reType.exec(line);
    if (mt) types.push({ kind: mt[1], name: mt[2] });
    const mf = reFn.exec(line);
    if (mf) {
      const vis = /\b(private|protected)\b/.test(line) ? (line.includes('private') ? 'private ' : 'protected ') : '';
      fns.push({ name: mf[1], sig: `${vis}${mf[1]}()`, doc: leadingDoc(lines, idx, ['//']) });
    }
  });
  return { fns, types };
}

function parsePy(lines) {
  const fns = [];
  const types = [];
  const reClass = /^(\s*)class\s+([A-Za-z_]\w*)/;
  const reDef = /^(\s*)(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/;
  lines.forEach((line, idx) => {
    const mc = reClass.exec(line);
    if (mc) types.push({ kind: 'class', name: mc[2] });
    const md = reDef.exec(line);
    if (md) {
      const nested = md[1].length > 0;
      let doc = leadingDoc(lines, idx, ['#']);
      // Docstring der Folgezeile als Fallback
      if (!doc) {
        const nx = (lines[idx + 1] || '').trim();
        const ds = /^[rbuf]*("""|''')(.*)/.exec(nx);
        if (ds && ds[2].trim()) doc = ds[2].replace(/("""|''').*$/, '').trim();
      }
      fns.push({ name: md[2], sig: `${nested ? '· ' : ''}${md[2]}()`, doc });
    }
  });
  return { fns, types };
}

function parseJs(lines) {
  const fns = [];
  const types = [];
  const reClass = /^\s*(?:export\s+)?(?:default\s+)?class\s+([A-Za-z_]\w*)/;
  const reFnDecl = /^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_]\w*)\s*\(/;
  const reArrow = /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[A-Za-z_$]\w*)\s*=>/;
  const reMethod = /^\s{2,}(?:async\s+|static\s+|get\s+|set\s+)*([A-Za-z_]\w*)\s*\([^)]*\)\s*\{/;
  const KW = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'else', 'do']);
  lines.forEach((line, idx) => {
    const mc = reClass.exec(line);
    if (mc) types.push({ kind: 'class', name: mc[1] });
    let m = reFnDecl.exec(line) || reArrow.exec(line);
    if (!m && reMethod.test(line)) {
      const mm = reMethod.exec(line);
      if (mm && !KW.has(mm[1])) m = mm;
    }
    if (m && !KW.has(m[1])) {
      fns.push({ name: m[1], sig: `${m[1]}()`, doc: leadingDoc(lines, idx, ['//']) });
    }
  });
  return { fns, types };
}

function parse(file, text) {
  const lines = text.split('\n');
  const ext = extname(file);
  if (ext === '.php') return parsePhp(lines);
  if (ext === '.py') return parsePy(lines);
  return parseJs(lines);
}

function langOf(file) {
  const e = extname(file);
  if (e === '.php') return 'PHP';
  if (e === '.py') return 'Python';
  if (e === '.ts' || e === '.tsx') return 'TS';
  return 'JS';
}

// ---------------------------------------------------------------------------
// Alle Dateien einlesen & parsen; globale Namens-Häufigkeit für Tote-Code.
// ---------------------------------------------------------------------------
const parsed = [];
const usage = new Map(); // Symbolname -> Gesamt-Vorkommen (\bname\b) über alle Dateien
const langCounts = new Map(); // Sprache -> Anzahl Dateien
let totalFns = 0;
let documented = 0;

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  const { fns, types } = parse(file, text);
  const lang = langOf(file);
  parsed.push({ file, lang, comp: componentOf(file), fns, types });
  langCounts.set(lang, (langCounts.get(lang) || 0) + 1);
  totalFns += fns.length;
  documented += fns.filter((f) => f.doc).length;
  for (const name of text.match(/\b[A-Za-z_]\w{2,}\b/g) || []) {
    usage.set(name, (usage.get(name) || 0) + 1);
  }
}

const totalTypes = parsed.reduce((n, p) => n + p.types.length, 0);
const filesWithCode = parsed.filter((p) => p.fns.length || p.types.length).length;

// Tote-Code-Kandidaten: Name kommt genau 1× im Repo vor (nur die Definition),
// kein Framework-Hook, kein Test, keine Magie, ≥4 Zeichen.
const dead = [];
for (const p of parsed) {
  for (const f of p.fns) {
    // Magische Namensmuster (Framework ruft per Konvention/Template auf):
    //  …Property  = computed property   ·  …Attribute = Accessor/Mutator
    //  updatedX/updatingX = Lifecycle-Hooks  ·  …Action = Action-Methoden (oft im Template)
    const magic = /(Property|Attribute|Action)$/.test(f.name) || /^updat(ed|ing)[A-Z]/.test(f.name);
    if (
      usage.get(f.name) === 1 &&
      f.name.length >= 4 &&
      !FRAMEWORK_HOOKS.has(f.name) &&
      !f.name.startsWith('__') &&
      !/^test/i.test(f.name) &&
      !magic
    ) {
      dead.push({ file: p.file, name: f.name });
    }
  }
}

// ---------------------------------------------------------------------------
// Markdown erzeugen.
// ---------------------------------------------------------------------------
// GitHub-Slug: lowercase, Nicht-Wort/Space/Hyphen entfernen (auch `/`), Spaces -> `-`.
const anchor = (s) =>
  s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

const out = [];
out.push(`# ${REPO} — Code-Map (Funktions-Index)`);
out.push('');
out.push('> **AUTO-GENERIERT** von `.claude/tools/codemap.mjs` — NICHT von Hand editieren. Nach');
out.push('> größeren Änderungen neu erzeugen: `node .claude/tools/codemap.mjs`. Zweck: „wo ist');
out.push('> Funktion X?" sofort beantworten + toten Code finden, statt zu greppen (spart Zeit & Tokens).');
out.push('');
const langs = [...langCounts].sort((a, b) => b[1] - a[1]).map(([l, n]) => `${l} ${n}`).join(' · ');
out.push(
  `Stand: ${totalFns} Funktionen/Methoden in ${filesWithCode} Dateien, ${totalTypes} Klassen/Typen. ` +
    `(Dateien je Sprache: ${langs || '—'}. Regex-Index, kein AST — dynamische/magische Aufrufe ` +
    `können fehlen.)`
);
out.push('');
const pct = totalFns ? Math.round((documented / totalFns) * 100) : 0;
out.push(
  `**Doc-Abdeckung:** ${documented}/${totalFns} Funktionen mit vorangehendem Zweck-Kommentar (${pct}%). ` +
    `Undokumentierte sind mit _⟨undok.⟩_ markiert — beim Anfassen bitte einen führenden Einzeiler ergänzen.`
);
out.push('');

// Komponenten in stabiler Reihenfolge.
const comps = [...new Set(parsed.map((p) => p.comp))].sort();
out.push('**Inhalt:** ' + comps.map((c) => `[${c}](#${anchor(c)})`).join(' · ') + ' · [Tote-Code-Kandidaten](#tote-code-kandidaten)');
out.push('');

for (const comp of comps) {
  const group = parsed.filter((p) => p.comp === comp && (p.fns.length || p.types.length));
  if (!group.length) continue;
  out.push(`## ${comp}`);
  out.push('');
  for (const p of group) {
    const rel = p.file.startsWith(comp + '/') ? p.file.slice(comp.length + 1) : p.file;
    const typeStr = p.types.length ? ' — ' + p.types.map((t) => `\`${t.kind} ${t.name}\``).join(', ') : '';
    out.push(`### ${rel} \`[${p.lang}]\`${typeStr}`);
    if (p.fns.length) {
      for (const f of p.fns) {
        out.push(`- \`${f.sig}\`${f.doc ? ' — ' + f.doc : ' — _⟨undok.⟩_'}`);
      }
    }
    out.push('');
  }
}

out.push('## Tote-Code-Kandidaten');
out.push('');
out.push(
  '_Name kommt genau 1× im Repo vor (nur die Definition) → evtl. ungenutzt. Framework-Hooks, ' +
    'Tests und magische Methoden sind ausgenommen. **Regex-Heuristik** — vor dem Löschen prüfen ' +
    '(dynamische Aufrufe, Templates/Views, Reflection werden nicht erfasst)._'
);
out.push('');
if (dead.length) {
  for (const d of dead.sort((a, b) => a.file.localeCompare(b.file))) {
    out.push(`- \`${d.name}()\` — ${d.file}`);
  }
} else {
  out.push('_Keine Kandidaten gefunden._');
}
out.push('');

writeFileSync('CODEMAP.md', out.join('\n'));
console.log(
  `CODEMAP.md geschrieben: ${totalFns} Funktionen, ${totalTypes} Typen, ${filesWithCode} Dateien, ` +
    `${dead.length} Tote-Code-Kandidaten, Doc-Abdeckung ${pct}%.`
);
