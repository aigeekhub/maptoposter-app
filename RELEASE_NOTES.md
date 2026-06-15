# Release Notes - 1.2.0

Detailed changelog and architectural update log for this release cycle.

## Key Changes & Implementations

### chore: fix package.json check in github_version
- **Category**: `Configuration`
- **Impacted files**: `skills/dev-navigator/scripts/github_version.py`

### feat(dashboard): implement print-on-demand simulator, visual crop map, and async generation task tracking
- **Category**: `Feature`
- **Impacted files**: `dashboard/app.js`, `dashboard/dev_history.json`, `dashboard/index.html`, `dashboard/server.py`, `dashboard/style.css`

### feat(dashboard): implement premium interactive web studio and dynamic theme customizer drawer
- **Category**: `Feature`
- **Impacted files**: `create_map_poster.py`, `dashboard/app.js`, `dashboard/dev_history.json`, `dashboard/index.html`, `dashboard/server.py`

### Update README.md (#184)
- **Category**: `Documentation`
- **Impacted files**: `README.md`

### Updated README.md to include Contributor's Guide/Notes
- **Category**: `Documentation`
- **Impacted files**: `README.md`

### Add bays and straits as water features (#142)
- **Category**: `Development Update`
- **Impacted files**: `create_map_poster.py`

### GHA: Fix types check and scan all files + fix some warnings (#149)
- **Category**: `Development Update`
- **Impacted files**: `.github/workflows/pr-checks.yml`, `README.md`, `create_map_poster.py`, `font_management.py`, `requirements.txt`

### feat: add uv package manager support and fix rendering bugs (#135)
- **Category**: `Feature`
- **Impacted files**: `.gitignore`, `CHANGELOG.md`, `README.md`, `create_map_poster.py`, `pyproject.toml`

### Flake8 added for git hook and also ran it against the code
- **Category**: `Development Update`
- **Impacted files**: `.flake8`, `create_map_poster.py`, `requirements.txt`

### Fixed merge conflict issues and add test/all_variations.sh to create posters testing all variations of cli arguments
- **Category**: `Bug Fix`
- **Impacted files**: `README.md`, `create_map_poster.py`, `test/all_variations.sh`
