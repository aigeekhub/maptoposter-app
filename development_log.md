# DevNavigator - Development Journal

*Last updated: 2026-06-15 03:30:51*

## System Architecture & Components

| Component Name | Path | Classification |
| :--- | :--- | :--- |
| DevNavigator Companion Dashboard | `dashboard` | **UI** |
| Antigravity Custom Skills | `skills` | **Skill Layer** |

---

## Detailed Development Timeline

### Version/Update: chore: fix package.json check in github_version
- **Author**: Ai Geek Hub
- **Date**: June 15, 2026
- **Hash**: `6e18263d`
- **Classification**: `Configuration`

#### Impacted Files
- `skills/dev-navigator/scripts/github_version.py`

### Version/Update: feat(dashboard): implement print-on-demand simulator, visual crop map, and async generation task tracking
- **Author**: Ai Geek Hub
- **Date**: June 15, 2026
- **Hash**: `dfcb0cb0`
- **Classification**: `Feature`

#### Impacted Files
- `dashboard/app.js`
- `dashboard/dev_history.json`
- `dashboard/index.html`
- `dashboard/server.py`
- `dashboard/style.css`
- `development_log.md`
- `skills/dev-navigator/SKILL.md`
- `skills/dev-navigator/scripts/github_version.py`
- `skills/dev-navigator/scripts/linear_sync.py`
- `skills/dev-navigator/scripts/scan_repo.py`
- `skills/dev-navigator/scripts/setup_hooks.py`
- `skills/dev-navigator/templates/development_log.md`
- `start_local_services.py`

### Version/Update: feat(dashboard): implement premium interactive web studio and dynamic theme customizer drawer
- **Author**: Ai Geek Hub
- **Date**: May 30, 2026
- **Hash**: `9428ac0e`
- **Classification**: `Feature`

#### Impacted Files
- `create_map_poster.py`
- `dashboard/app.js`
- `dashboard/dev_history.json`
- `dashboard/index.html`
- `dashboard/server.py`
- `dashboard/style.css`
- `development_log.md`
- `font_management.py`
- `themes/custom_integration_cyberpunk.json`

### Version/Update: Update README.md (#184)
- **Author**: Geert Folkertsma
- **Date**: March 01, 2026
- **Hash**: `6d03069f`
- **Classification**: `Documentation`

#### Impacted Files
- `README.md`

### Version/Update: Updated README.md to include Contributor's Guide/Notes
- **Author**: Ankur Gupta
- **Date**: January 30, 2026
- **Hash**: `fffad0c2`
- **Classification**: `Documentation`

#### Impacted Files
- `README.md`

### Version/Update: Add bays and straits as water features (#142)
- **Author**: Zachary Kornbluth
- **Date**: January 30, 2026
- **Hash**: `6bf8bf32`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: GHA: Fix types check and scan all files + fix some warnings (#149)
- **Author**: Adam Stachowicz
- **Date**: January 30, 2026
- **Hash**: `1cf53560`
- **Classification**: `Development Update`

#### Impacted Files
- `.github/workflows/pr-checks.yml`
- `README.md`
- `create_map_poster.py`
- `font_management.py`
- `requirements.txt`

### Version/Update: feat: add uv package manager support and fix rendering bugs (#135)
- **Author**: Mudit Bhargava
- **Date**: January 27, 2026
- **Hash**: `ef7b2645`
- **Classification**: `Feature`

#### Impacted Files
- `.gitignore`
- `CHANGELOG.md`
- `README.md`
- `create_map_poster.py`
- `pyproject.toml`
- `test/all_variations.sh`
- `uv.lock`

### Version/Update: Flake8 added for git hook and also ran it against the code
- **Author**: originalankur
- **Date**: January 27, 2026
- **Hash**: `28527d12`
- **Classification**: `Development Update`

#### Impacted Files
- `.flake8`
- `create_map_poster.py`
- `requirements.txt`

### Version/Update: Fixed merge conflict issues and add test/all_variations.sh to create posters testing all variations of cli arguments
- **Author**: originalankur
- **Date**: January 27, 2026
- **Hash**: `60b79885`
- **Classification**: `Bug Fix`

#### Impacted Files
- `README.md`
- `create_map_poster.py`
- `test/all_variations.sh`

### Version/Update: manual merge
- **Author**: originalankur
- **Date**: January 27, 2026
- **Hash**: `0767b749`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: GH Actions: PR check (#98)
- **Author**: Adam Stachowicz
- **Date**: January 27, 2026
- **Hash**: `56a9dcd1`
- **Classification**: `Development Update`

#### Impacted Files
- `.github/workflows/pr-checks.yml`
- `create_map_poster.py`

### Version/Update: refactor: address PR review feedback
- **Author**: Antoine Glacet
- **Date**: January 27, 2026
- **Hash**: `3758729d`
- **Classification**: `Refactor`

#### Impacted Files
- `create_map_poster.py`
- `font_management.py`
- `pr_examples/bangkok_thai.png`
- `pr_examples/dubai_arabic.png`
- `pr_examples/seoul_korean.png`
- `pr_examples/tokyo_japanese.png`

### Version/Update: docs: address maintainer review feedback on README
- **Author**: Antoine Glacet
- **Date**: January 26, 2026
- **Hash**: `f6763993`
- **Classification**: `Documentation`

#### Impacted Files
- `README.md`

### Version/Update: feat: add i18n support with Google Fonts integration (rebased)
- **Author**: Antoine Glacet
- **Date**: January 26, 2026
- **Hash**: `e428fe0f`
- **Classification**: `Feature`

#### Impacted Files
- `create_map_poster.py`
- `font_management.py`
- `pr_examples/bangkok_thai.png`
- `pr_examples/dubai_arabic.png`
- `pr_examples/seoul_korean.png`
- `pr_examples/tokyo_japanese.png`

### Version/Update: Remove the feature_based theme and defaulted to terracotta (#131)
- **Author**: Ankur Gupta
- **Date**: January 26, 2026
- **Hash**: `bb326177`
- **Classification**: `UI/Styling`

#### Impacted Files
- `README.md`
- `create_map_poster.py`
- `themes/feature_based.json`

### Version/Update: Allow specifying custom coordinates (#106)
- **Author**: Nate Stoddart
- **Date**: January 26, 2026
- **Hash**: `6c4bb6b3`
- **Classification**: `Development Update`

#### Impacted Files
- `README.md`
- `create_map_poster.py`
- `requirements.txt`

### Version/Update: Max limits on w h in inches (#129)
- **Author**: Ankur Gupta
- **Date**: January 26, 2026
- **Hash**: `ec6c0ffa`
- **Classification**: `Development Update`

#### Impacted Files
- `README.md`
- `create_map_poster.py`

### Version/Update: Enforced max limit of width and height to 20. Enough to get 4k resolution posters. Also default distance to 18000 from 12000 (#128)
- **Author**: Ankur Gupta
- **Date**: January 26, 2026
- **Hash**: `548820d6`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Fix cache dir after 855bc561e760c214e1733c3df1f069e66765dbea (#109)
- **Author**: Adam Stachowicz
- **Date**: January 26, 2026
- **Hash**: `a0aaa6cc`
- **Classification**: `Bug Fix`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Two more new theme that should really look good! (#114)
- **Author**: Tirtharaj Karmakar
- **Date**: January 24, 2026
- **Hash**: `35dc9789`
- **Classification**: `UI/Styling`

#### Impacted Files
- `.gitignore`
- `README.md`
- `posters/seattle_emerald_20260124_162244.png`
- `themes/emerald.json`

### Version/Update: font size scales dynamically based on poster's width
- **Author**: originalankur
- **Date**: January 22, 2026
- **Hash**: `4beae007`
- **Classification**: `Development Update`

#### Impacted Files
- `README.md`
- `create_map_poster.py`

### Version/Update: fixed map warping and allow variable poster dimensions (#59)
- **Author**: Kevin Joshua
- **Date**: January 22, 2026
- **Hash**: `92dacd2f`
- **Classification**: `Bug Fix`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Retain edge nodes (#27)
- **Author**: Nate Stoddart
- **Date**: January 22, 2026
- **Hash**: `cb40cfed`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Update README to remove latitude and longitude options
- **Author**: Ankur Gupta
- **Date**: January 21, 2026
- **Hash**: `ac4784b8`
- **Classification**: `Documentation`

#### Impacted Files
- `README.md`

### Version/Update: resolved conflicts to merge
- **Author**: originalankur
- **Date**: January 21, 2026
- **Hash**: `855bc561`
- **Classification**: `Development Update`

#### Impacted Files
- `README.md`
- `create_map_poster.py`
- `posters/amsterdam_ocean_20260121_120007.png`
- `posters/venice_blueprint_20260120_224440.png`

### Version/Update: GH Actions: Add actions-label-merge-conflict
- **Author**: Adam Stachowicz
- **Date**: January 20, 2026
- **Hash**: `a9f386e7`
- **Classification**: `Development Update`

#### Impacted Files
- `.github/workflows/conflicts.yml`

### Version/Update: Merge branch 'lorenzofratus-feat/crop-to-aspect-ratio'
- **Author**: originalankur
- **Date**: January 20, 2026
- **Hash**: `f62be0ef`
- **Classification**: `Development Update`

#### Impacted Files
- *No files modified in this commit (meta update)*

### Version/Update: Merge remote-tracking branch 'origin/main' into feat/crop-to-aspect-ratio
- **Author**: lorenzofratus
- **Date**: January 20, 2026
- **Hash**: `f81c5757`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Merge pull request #1 from originalankur/main
- **Author**: Lorenzo Fratus
- **Date**: January 20, 2026
- **Hash**: `e3439cdb`
- **Classification**: `Development Update`

#### Impacted Files
- *No files modified in this commit (meta update)*

### Version/Update: Add files via upload
- **Author**: Mirano
- **Date**: January 20, 2026
- **Hash**: `d004944e`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Increase Nominatim timeout to 10 seconds
- **Author**: Rory-Lee
- **Date**: January 20, 2026
- **Hash**: `83e3e6be`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Dynamically adjust font size based on city name length to prevent truncation
- **Author**: Harold ThÃ©tiot
- **Date**: January 19, 2026
- **Hash**: `be6d2b6b`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Moved rate limiting out of the cache path
- **Author**: khannurien
- **Date**: January 18, 2026
- **Hash**: `adea49c8`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Strengthened cache handling: added hashing to filenames, improved error handling
- **Author**: khannurien
- **Date**: January 18, 2026
- **Hash**: `d786bb6f`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Cache downloaded data
- **Author**: khannurien
- **Date**: January 17, 2026
- **Hash**: `20802e1f`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Add files via upload
- **Author**: Mirano
- **Date**: January 20, 2026
- **Hash**: `849cf27a`
- **Classification**: `Development Update`

#### Impacted Files
- `README.md`
- `create_map_poster.py`

### Version/Update: Increase Nominatim timeout to 10 seconds
- **Author**: Rory-Lee
- **Date**: January 20, 2026
- **Hash**: `76dceb06`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: Dynamically adjust font size based on city name length to prevent truncation
- **Author**: Harold ThÃ©tiot
- **Date**: January 19, 2026
- **Hash**: `651a1fbb`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: fix: filter point geometries to prevent dots on rendered maps
- **Author**: cstoked
- **Date**: January 17, 2026
- **Hash**: `33e3beca`
- **Classification**: `Bug Fix`

#### Impacted Files
- `create_map_poster.py`
- `posters/san_francisco_sunset_20260117_224834.png`

### Version/Update: Merge pull request #57 from poo-ke/feature/svg-pdf-export
- **Author**: Ankur Gupta
- **Date**: January 20, 2026
- **Hash**: `f83ab2e8`
- **Classification**: `Development Update`

#### Impacted Files
- *No files modified in this commit (meta update)*

### Version/Update: Add SVG/PDF export support via --format flag
- **Author**: poo-ke
- **Date**: January 19, 2026
- **Hash**: `34b62051`
- **Classification**: `Development Update`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: feat: update poster images and update README
- **Author**: lorenzofratus
- **Date**: January 18, 2026
- **Hash**: `9721d9cb`
- **Classification**: `Feature`

#### Impacted Files
- `README.md`
- `posters/amsterdam_ocean_20260118_140624.png`
- `posters/barcelona_warm_beige_20260118_140048.png`
- `posters/budapest_copper_patina_20260118_151213.png`
- `posters/dubai_midnight_blue_20260118_140807.png`
- `posters/london_noir_20260118_150259.png`
- `posters/marrakech_terracotta_20260118_143253.png`
- `posters/melbourne_forest_20260118_153446.png`
- `posters/moscow_noir_20260118_141923.png`
- `posters/mumbai_contrast_zones_20260118_145843.png`
- `posters/new_york_noir_20260118_135113.png`
- `posters/old/barcelona_warm_beige_20260108_172924.png`
- `posters/old/chicago_noir_20260108_173313.png`
- `posters/old/dubai_midnight_blue_20260108_174920.png`
- `posters/old/marrakech_terracotta_20260108_180821.png`
- `posters/old/melbourne_forest_20260108_181459.png`
- `posters/old/mumbai_contrast_zones_20260108_170325.png`
- `posters/old/mumbai_contrast_zones_20260108_172010.png`
- `posters/old/new_york_noir_20260108_164217.png`
- `posters/old/new_york_noir_20260108_172453.png`
- `posters/old/san_francisco_sunset_20260108_184122.png`
- `posters/old/singapore_neon_cyberpunk_20260108_184503.png`
- `posters/old/tokyo_japanese_ink_20260108_165830.png`
- `posters/old/venice_blueprint_20260108_165527.png`
- `posters/old/washington_blueprint_20260108_184314.png`
- `posters/paris_pastel_dream_20260118_141126.png`
- `posters/rome_warm_beige_20260118_143425.png`
- `posters/san_francisco_sunset_20260118_144726.png`
- `posters/singapore_neon_cyberpunk_20260118_153328.png`
- `posters/sydney_ocean_20260118_145507.png`
- `posters/tokyo_japanese_ink_20260118_142446.png`
- `posters/venice_blueprint_20260118_140505.png`

### Version/Update: feat: project graph to linear coordinates and crop it to fill the poster without distortion
- **Author**: lorenzofratus
- **Date**: January 18, 2026
- **Hash**: `083a0cd7`
- **Classification**: `Feature`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: fix: update ax.set_position to use tuple for consistency
- **Author**: lorenzofratus
- **Date**: January 18, 2026
- **Hash**: `56e3c7a7`
- **Classification**: `Bug Fix`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: fix: handle coroutine returned by geocoder in get_coordinates function
- **Author**: lorenzofratus
- **Date**: January 18, 2026
- **Hash**: `9e135f4d`
- **Classification**: `Bug Fix`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: fix: initialize THEME as an empty dictionary rather than None to avoid type errors
- **Author**: lorenzofratus
- **Date**: January 18, 2026
- **Hash**: `4cba06fe`
- **Classification**: `Bug Fix`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: fix: replace os.sys with sys in imports
- **Author**: lorenzofratus
- **Date**: January 18, 2026
- **Hash**: `8c6da9d8`
- **Classification**: `Bug Fix`

#### Impacted Files
- `create_map_poster.py`

### Version/Update: chore: update .gitignore to include .venv and .DS_Store
- **Author**: lorenzofratus
- **Date**: January 18, 2026
- **Hash**: `b2ddb199`
- **Classification**: `Configuration`

#### Impacted Files
- `.gitignore`

### Version/Update: Add example images to README
- **Author**: Ankur Gupta
- **Date**: January 17, 2026
- **Hash**: `a215ca38`
- **Classification**: `Documentation`

#### Impacted Files
- `README.md`

### Version/Update: poster images
- **Author**: originalankur
- **Date**: January 08, 2026
- **Hash**: `904dac94`
- **Classification**: `Development Update`

#### Impacted Files
- `posters/marrakech_terracotta_20260108_180821.png`
- `posters/melbourne_forest_20260108_181459.png`
- `posters/san_francisco_sunset_20260108_184122.png`
- `posters/singapore_neon_cyberpunk_20260108_184503.png`
- `posters/washington_blueprint_20260108_184314.png`

### Version/Update: updated maps in readme.md
- **Author**: originalankur
- **Date**: January 08, 2026
- **Hash**: `54a139c5`
- **Classification**: `Documentation`

#### Impacted Files
- `README.md`

### Version/Update: Version 0.1 - Add maptoposter source, data, and readme
- **Author**: originalankur
- **Date**: January 08, 2026
- **Hash**: `9652ba6d`
- **Classification**: `Documentation`

#### Impacted Files
- `.gitignore`
- `README.md`
- `create_map_poster.py`
- `fonts/Roboto-Bold.ttf`
- `fonts/Roboto-Light.ttf`
- `fonts/Roboto-Regular.ttf`
- `posters/barcelona_warm_beige_20260108_172924.png`
- `posters/chicago_noir_20260108_173313.png`
- `posters/dubai_midnight_blue_20260108_174920.png`
- `posters/mumbai_contrast_zones_20260108_170325.png`
- `posters/mumbai_contrast_zones_20260108_172010.png`
- `posters/new_york_noir_20260108_164217.png`
- `posters/new_york_noir_20260108_172453.png`
- `posters/tokyo_japanese_ink_20260108_165830.png`
- `posters/venice_blueprint_20260108_165527.png`
- `requirements.txt`
- `themes/autumn.json`
- `themes/blueprint.json`
- `themes/contrast_zones.json`
- `themes/copper_patina.json`
- `themes/feature_based.json`
- `themes/forest.json`
- `themes/gradient_roads.json`
- `themes/japanese_ink.json`
- `themes/midnight_blue.json`
- `themes/monochrome_blue.json`
- `themes/neon_cyberpunk.json`
- `themes/noir.json`
- `themes/ocean.json`
- `themes/pastel_dream.json`
- `themes/sunset.json`
- `themes/terracotta.json`
- `themes/warm_beige.json`

### Version/Update: Initial commit
- **Author**: Ankur Gupta
- **Date**: January 08, 2026
- **Hash**: `1993da40`
- **Classification**: `Development Update`

#### Impacted Files
- `LICENSE`
