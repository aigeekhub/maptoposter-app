---
name: dev-navigator
description: Keeps detailed, incremental development logs, automates Linear syncing, and manages GitHub commit, push, and semantic versioning via Git hooks.
---
# DevNavigator

DevNavigator is a high-performance, automated development tracking, project sync, and version management skill. It operates transparently through Git commit hooks, ensuring that every design decision, feature implementation, and release milestone is recorded without manual overhead.

## Core Pillars

1. **Incremental History Reconstruction**: Real-time or retroactively scanned Git-to-Log parsing.
2. **Linear Real-Time Sync**: Automated creation and updating of milestones/tasks in Linear via Linear MCP.
3. **GitHub Automation & Versioning**: Conventional Commits, semantic tagging (`vX.Y.Z`), auto-PR formatting, and detailed changelog publication.
4. **Interactive Dashboard**: A gorgeous, glassmorphic dark-theme Single-Page App visualizing progress.

---

## Skill Operations

### 1. Onboarding a Repository (Zero-Touch Setup)
Whenever an agent begins working on a repository, or when a user wants to set up DevNavigator, run:
```bash
python skills/dev-navigator/scripts/setup_hooks.py
```
This script will:
- Install a lightweight `.git/hooks/post-commit` hook.
- Configure global Git templates so future projects inherit the tracking automatically.
- Initialize the `.dev_navigator_cache.json` cache file.

### 2. Scanning the Repository (Incremental & Retroactive)
To build or update the development log from the Git log:
```bash
python skills/dev-navigator/scripts/scan_repo.py
```
- **Incremental Mode (Standard)**: Parses only commits made since the last recorded commit in `.dev_navigator_cache.json`.
- **Retroactive/Fill-Gap Mode**: If run in a mature repo without prior logs, it performs a complete retrospective scan, using commit content, diffs, and file structure analysis to synthesize a highly detailed timeline (`dev_history.json`) and Markdown log (`development_log.md`).

### 3. Linear Synchronization
To sync development logs and features to Linear:
```bash
python skills/dev-navigator/scripts/linear_sync.py
```
- This interacts with the Linear MCP server to provision projects and sync tasks based on the features logged in `dev_history.json`.

### 4. GitHub Semantic Releases & Auto-Pushing
To commit, push, tag, and publish changelogs:
```bash
python skills/dev-navigator/scripts/github_version.py
```
- Prompts for a release level (patch, minor, major).
- Auto-updates `package.json` or config versions.
- Pushes to GitHub and creates detailed release notes.

---

## Folder Structure

```
skills/dev-navigator/
├── SKILL.md                 # Main instructions (this file)
├── scripts/
│   ├── setup_hooks.py       # Git hooks installer
│   ├── scan_repo.py         # Git log incremental analyzer
│   ├── linear_sync.py       # Linear project & ticket syncer
│   └── github_version.py    # Commit, push & tagging automator
└── templates/
    └── development_log.md   # Markdown development journal template
```
