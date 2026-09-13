# Zentral verwaltet — nicht hier bearbeiten

Diese Dateien stammen aus dem Repo `rw-dev-standards` und werden bei jedem Sync überschrieben:

    CLAUDE.md
    REPO-STRUKTUR.md
    STACK.md
    .claude/agents/**
    .claude/commands/**
    .claude/rules/**
    .claude/tools/**
    .claude/MANAGED.md
    .github/pull_request_template.md
    .github/workflows/standards-*.yml

Änderungen daran gehen beim nächsten Sync verloren. Sie gehören ins zentrale Repo.

**Projekteigenes** gehört in den jeweiligen Unterordner `local/`
(`.claude/agents/local/`, `.claude/commands/local/`, `.claude/rules/local/`,
`.claude/tools/local/`) — der bleibt unangetastet. Alles andere im Repo ebenfalls, insbesondere
`PROJECT.md`, `README.md`, `.claude/skills/` und `.claude/settings.json`.

Projektspezifisches Wissen wird ausschließlich in `PROJECT.md` dokumentiert.
