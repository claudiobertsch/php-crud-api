# php-crud-api — Code-Map (Funktions-Index)

> **AUTO-GENERIERT** von `.claude/tools/codemap.mjs` — NICHT von Hand editieren. Nach
> größeren Änderungen neu erzeugen: `node .claude/tools/codemap.mjs`. Zweck: „wo ist
> Funktion X?" sofort beantworten + toten Code finden, statt zu greppen (spart Zeit & Tokens).

Stand: 192 Funktionen/Methoden in 6 Dateien, 9 Klassen/Typen. (Dateien je Sprache: PHP 7 · JS 2. Regex-Index, kein AST — dynamische/magische Aufrufe können fehlen.)

**Doc-Abdeckung:** 2/192 Funktionen mit vorangehendem Zweck-Kommentar (1%). Undokumentierte sind mit _⟨undok.⟩_ markiert — beim Anfassen bitte einen führenden Einzeiler ergänzen.

**Inhalt:** [(Wurzel)](#wurzel) · [.claude](#claude) · [examples](#examples) · [extras](#extras) · [lib](#lib) · [tests](#tests) · [Tote-Code-Kandidaten](#tote-code-kandidaten)

## (Wurzel)

### api.php `[PHP]` — `interface DatabaseInterface`, `class MySQL`, `class PostgreSQL`, `class SQLServer`, `class SQLite`, `class PHP_CRUD_API`, `class PHP_API_AUTH`
- `getSql()` — _⟨undok.⟩_
- `connect()` — _⟨undok.⟩_
- `query()` — _⟨undok.⟩_
- `fetchAssoc()` — _⟨undok.⟩_
- `fetchRow()` — _⟨undok.⟩_
- `insertId()` — _⟨undok.⟩_
- `affectedRows()` — _⟨undok.⟩_
- `close()` — _⟨undok.⟩_
- `fetchFields()` — _⟨undok.⟩_
- `addLimitToSql()` — _⟨undok.⟩_
- `likeEscape()` — _⟨undok.⟩_
- `isBinaryType()` — _⟨undok.⟩_
- `base64Encode()` — _⟨undok.⟩_
- `getDefaultCharset()` — _⟨undok.⟩_
- `__construct()` — _⟨undok.⟩_
- `getSql()` — _⟨undok.⟩_
- `connect()` — _⟨undok.⟩_
- `query()` — _⟨undok.⟩_
- `fetchAssoc()` — _⟨undok.⟩_
- `fetchRow()` — _⟨undok.⟩_
- `insertId()` — _⟨undok.⟩_
- `affectedRows()` — _⟨undok.⟩_
- `close()` — _⟨undok.⟩_
- `fetchFields()` — _⟨undok.⟩_
- `addLimitToSql()` — _⟨undok.⟩_
- `likeEscape()` — _⟨undok.⟩_
- `isBinaryType()` — _⟨undok.⟩_
- `base64Encode()` — _⟨undok.⟩_
- `getDefaultCharset()` — _⟨undok.⟩_
- `__construct()` — _⟨undok.⟩_
- `getSql()` — _⟨undok.⟩_
- `connect()` — _⟨undok.⟩_
- `query()` — _⟨undok.⟩_
- `fetchAssoc()` — _⟨undok.⟩_
- `fetchRow()` — _⟨undok.⟩_
- `insertId()` — _⟨undok.⟩_
- `affectedRows()` — _⟨undok.⟩_
- `close()` — _⟨undok.⟩_
- `fetchFields()` — _⟨undok.⟩_
- `addLimitToSql()` — _⟨undok.⟩_
- `likeEscape()` — _⟨undok.⟩_
- `isBinaryType()` — _⟨undok.⟩_
- `base64Encode()` — _⟨undok.⟩_
- `getDefaultCharset()` — _⟨undok.⟩_
- `__construct()` — _⟨undok.⟩_
- `getSql()` — _⟨undok.⟩_
- `connect()` — _⟨undok.⟩_
- `query()` — _⟨undok.⟩_
- `fetchAssoc()` — _⟨undok.⟩_
- `fetchRow()` — _⟨undok.⟩_
- `insertId()` — _⟨undok.⟩_
- `affectedRows()` — _⟨undok.⟩_
- `close()` — _⟨undok.⟩_
- `fetchFields()` — _⟨undok.⟩_
- `addLimitToSql()` — _⟨undok.⟩_
- `likeEscape()` — _⟨undok.⟩_
- `isBinaryType()` — _⟨undok.⟩_
- `base64Encode()` — _⟨undok.⟩_
- `getDefaultCharset()` — _⟨undok.⟩_
- `__construct()` — _⟨undok.⟩_
- `getSql()` — _⟨undok.⟩_
- `connect()` — _⟨undok.⟩_
- `query()` — _⟨undok.⟩_
- `fetchAssoc()` — _⟨undok.⟩_
- `fetchRow()` — _⟨undok.⟩_
- `insertId()` — _⟨undok.⟩_
- `affectedRows()` — _⟨undok.⟩_
- `close()` — _⟨undok.⟩_
- `fetchFields()` — _⟨undok.⟩_
- `addLimitToSql()` — _⟨undok.⟩_
- `likeEscape()` — _⟨undok.⟩_
- `isBinaryType()` — _⟨undok.⟩_
- `base64Encode()` — _⟨undok.⟩_
- `getDefaultCharset()` — _⟨undok.⟩_
- `protected mapMethodToAction()` — _⟨undok.⟩_
- `protected parseRequestParameter()` — _⟨undok.⟩_
- `protected parseGetParameter()` — _⟨undok.⟩_
- `protected parseGetParameterArray()` — _⟨undok.⟩_
- `protected applyTableAuthorizer()` — _⟨undok.⟩_
- `protected applyRecordFilter()` — _⟨undok.⟩_
- `protected applyTenancyFunction()` — _⟨undok.⟩_
- `protected applyColumnAuthorizer()` — _⟨undok.⟩_
- `protected applyInputTenancy()` — _⟨undok.⟩_
- `protected applyInputSanitizer()` — _⟨undok.⟩_
- `protected applyInputValidator()` — _⟨undok.⟩_
- `protected processTableAndIncludeParameters()` — _⟨undok.⟩_
- `protected exitWith404()` — _⟨undok.⟩_
- `protected exitWith422()` — _⟨undok.⟩_
- `protected headersCommand()` — _⟨undok.⟩_
- `protected startOutput()` — _⟨undok.⟩_
- `protected endOutput()` — _⟨undok.⟩_
- `protected findPrimaryKeys()` — _⟨undok.⟩_
- `protected processKeyParameter()` — _⟨undok.⟩_
- `protected processOrderParameter()` — _⟨undok.⟩_
- `protected convertFilter()` — _⟨undok.⟩_
- `protected convertFilters()` — _⟨undok.⟩_
- `protected processFiltersParameter()` — _⟨undok.⟩_
- `protected processPageParameter()` — _⟨undok.⟩_
- `protected retrieveObject()` — _⟨undok.⟩_
- `protected createObject()` — _⟨undok.⟩_
- `protected updateObject()` — _⟨undok.⟩_
- `protected deleteObject()` — _⟨undok.⟩_
- `protected findRelations()` — _⟨undok.⟩_
- `protected retrieveInput()` — _⟨undok.⟩_
- `protected addRelationColumns()` — _⟨undok.⟩_
- `protected findFields()` — _⟨undok.⟩_
- `protected filterFieldsByColumns()` — _⟨undok.⟩_
- `protected findTableFields()` — _⟨undok.⟩_
- `protected filterInputByFields()` — _⟨undok.⟩_
- `protected convertBinary()` — _⟨undok.⟩_
- `protected getParameters()` — _⟨undok.⟩_
- `protected addWhereFromFilters()` — _⟨undok.⟩_
- `protected listCommandInternal()` — _⟨undok.⟩_
- `protected readCommand()` — _⟨undok.⟩_
- `protected createCommand()` — _⟨undok.⟩_
- `protected updateCommand()` — _⟨undok.⟩_
- `protected deleteCommand()` — _⟨undok.⟩_
- `protected listCommand()` — _⟨undok.⟩_
- `__construct()` — _⟨undok.⟩_
- `php_crud_api_transform()` — _⟨undok.⟩_
- `protected swagger()` — _⟨undok.⟩_
- `executeCommand()` — _⟨undok.⟩_
- `__construct()` — _⟨undok.⟩_
- `protected retrieveInput()` — _⟨undok.⟩_
- `protected generateToken()` — _⟨undok.⟩_
- `protected getVerifiedClaims()` — _⟨undok.⟩_
- `executeCommand()` — _⟨undok.⟩_

## .claude

### tools/codemap.mjs `[JS]`
- `componentOf()` — _⟨undok.⟩_
- `leadingDoc()` — Erste sinnvolle Zeile eines vorangehenden Kommentars (Docblock/`//`/`#`).
- `parsePhp()` — _⟨undok.⟩_
- `parsePy()` — _⟨undok.⟩_
- `parseJs()` — _⟨undok.⟩_
- `parse()` — _⟨undok.⟩_
- `langOf()` — _⟨undok.⟩_
- `anchor()` — GitHub-Slug: lowercase, Nicht-Wort/Space/Hyphen entfernen (auch `/`), Spaces -> `-`.

## examples

### client.php `[PHP]`
- `call()` — _⟨undok.⟩_

## lib

### php_crud_api_transform.js `[JS]`
- `php_crud_api_transform()` — _⟨undok.⟩_

### php_crud_api_transform.php `[PHP]`
- `php_crud_api_transform()` — _⟨undok.⟩_

## tests

### tests.php `[PHP]` — `class API`, `class PHP_CRUD_API_Test`
- `__construct()` — _⟨undok.⟩_
- `private action()` — _⟨undok.⟩_
- `get()` — _⟨undok.⟩_
- `post()` — _⟨undok.⟩_
- `put()` — _⟨undok.⟩_
- `delete()` — _⟨undok.⟩_
- `options()` — _⟨undok.⟩_
- `expect()` — _⟨undok.⟩_
- `setUpBeforeClass()` — _⟨undok.⟩_
- `testListPosts()` — _⟨undok.⟩_
- `testListPostColumns()` — _⟨undok.⟩_
- `testListPostsWithTransform()` — _⟨undok.⟩_
- `testReadPost()` — _⟨undok.⟩_
- `testReadPostColumns()` — _⟨undok.⟩_
- `testAddPost()` — _⟨undok.⟩_
- `testEditPost()` — _⟨undok.⟩_
- `testEditPostColumnsMissingField()` — _⟨undok.⟩_
- `testEditPostColumnsExtraField()` — _⟨undok.⟩_
- `testEditPostWithUtf8Content()` — _⟨undok.⟩_
- `testEditPostWithUtf8ContentWithPost()` — _⟨undok.⟩_
- `testDeletePost()` — _⟨undok.⟩_
- `testAddPostWithPost()` — _⟨undok.⟩_
- `testEditPostWithPost()` — _⟨undok.⟩_
- `testDeletePostWithPost()` — _⟨undok.⟩_
- `testListWithPaginate()` — _⟨undok.⟩_
- `testListWithPaginateLastPage()` — _⟨undok.⟩_
- `testListExampleFromReadme()` — _⟨undok.⟩_
- `testListExampleFromReadmeWithTransform()` — _⟨undok.⟩_
- `testEditCategoryWithBinaryContent()` — _⟨undok.⟩_
- `testEditCategoryWithNull()` — _⟨undok.⟩_
- `testEditCategoryWithBinaryContentWithPost()` — _⟨undok.⟩_
- `testEditCategoryWithNullWithPost()` — _⟨undok.⟩_
- `testAddPostFailure()` — _⟨undok.⟩_
- `testOptionsRequest()` — _⟨undok.⟩_
- `testHidingPasswordColumn()` — _⟨undok.⟩_
- `testValidatorErrorMessage()` — _⟨undok.⟩_
- `testSanitizerToStripTags()` — _⟨undok.⟩_
- `testErrorOnInvalidJson()` — _⟨undok.⟩_
- `testErrorOnDuplicatePrimaryKey()` — _⟨undok.⟩_
- `testErrorOnFailingForeignKeyConstraint()` — _⟨undok.⟩_
- `testForJsonpCallbackOnList()` — _⟨undok.⟩_
- `testMissingIntermediateTable()` — _⟨undok.⟩_
- `testEditUser()` — _⟨undok.⟩_
- `testEditUserWithId()` — _⟨undok.⟩_
- `testReadOtherUser()` — _⟨undok.⟩_
- `testEditOtherUser()` — _⟨undok.⟩_
- `testFilterCategoryOnNullIcon()` — _⟨undok.⟩_
- `testFilterCategoryOnNotNullIcon()` — _⟨undok.⟩_
- `testFilterPostsNotIn()` — _⟨undok.⟩_
- `testColumnsWithTable()` — _⟨undok.⟩_
- `testColumnsWithTableWildcard()` — _⟨undok.⟩_
- `testColumnsOnInclude()` — _⟨undok.⟩_
- `testColumnsOnWrongInclude()` — _⟨undok.⟩_
- `testColumnsOnImplicitJoin()` — _⟨undok.⟩_

## Tote-Code-Kandidaten

_Name kommt genau 1× im Repo vor (nur die Definition) → evtl. ungenutzt. Framework-Hooks, Tests und magische Methoden sind ausgenommen. **Regex-Heuristik** — vor dem Löschen prüfen (dynamische Aufrufe, Templates/Views, Reflection werden nicht erfasst)._

- `setUpBeforeClass()` — tests/tests.php
