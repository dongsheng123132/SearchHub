# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

SearchHub is a Chrome extension (Manifest V3) that lets users search across multiple engines simultaneously. It opens results as grouped tabs or windows, with a sidebar for tab management.

- Chrome Web Store ID: `lojjckopababijcnckabcilfkbgajnbo`
- Current version: `1.2.6`
- GitHub: `dongsheng123132/SearchHub` (private)

## Packaging

To build a new zip for Chrome Web Store upload (PowerShell):
```powershell
.\package.ps1
```
Or manually with PowerShell:
```powershell
Compress-Archive -Force -Path manifest.json,background.js,content.js,content.css,index.html,popup.html,popup.js,sidebar.html,settings.html,scripts,styles,icons,_locales -DestinationPath AI-Search-Hub-vX.X.X.zip
```
Always bump `"version"` in `manifest.json` before packaging.

## Architecture

| File | Role |
|------|------|
| `manifest.json` | Extension config, permissions, content_scripts URL list |
| `background.js` | Service worker: handles search, tab grouping, context menus, keyboard shortcuts. Contains a **hardcoded engine URL map** (`findDefaultEngineById`) that must stay in sync with `scripts/config.js` |
| `scripts/config.js` | Source of truth for all engine definitions (`DEFAULT_ENGINES`), default combos, and default settings |
| `scripts/index.js` | Main page logic: engine selection, combo management, search dispatch |
| `scripts/sidebar.js` | Sidebar tab management UI |
| `scripts/settings.js` | Settings page logic |
| `scripts/i18n.js` | Internationalization helper |
| `index.html` | Main search page (opened on icon click) |
| `sidebar.html` | Side panel (opens after search) |
| `_locales/` | i18n strings (en, zh_CN) |

## Critical Sync Rule

`background.js` has a **duplicate hardcoded URL map** (`findDefaultEngineById`) used for right-click / keyboard shortcut searches. Whenever you add or change an engine URL in `scripts/config.js`, you **must** make the same change in `background.js`. This is the most common source of bugs.

## Adding a New Search Engine

1. Add entry to the correct category in `DEFAULT_ENGINES` in `scripts/config.js`
2. Add the same entry to `findDefaultEngineById` in `background.js`
3. If the engine supports AI chat (not just search), add its URL pattern to `content_scripts.matches` in `manifest.json`
4. Bump version in `manifest.json`
5. Repackage zip

## Engine URL Pattern

All engine URLs use `%s` as the query placeholder:
```
https://example.com/search?q=%s
```
Engines without `%s` (like the old Manus invite link) will silently fail to pass the search query.

## Permissions

Key permissions in use: `sidePanel`, `tabGroups`, `scripting`, `contextMenus`, `system.display`. Avoid adding new permissions without good reason — Chrome Web Store reviewers scrutinize permission changes.
