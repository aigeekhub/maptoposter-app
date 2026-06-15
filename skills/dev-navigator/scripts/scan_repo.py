import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime

# Force stdout/stderr to use UTF-8 encoding on Windows to prevent UnicodeEncodeError
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

# Define file paths relative to repository root
CACHE_FILE = ".dev_navigator_cache.json"
HISTORY_JSON = "dashboard/dev_history.json"
DEV_LOG_MD = "development_log.md"

def run_git_command(args, cwd=None):
    try:
        return subprocess.check_output(["git"] + args, text=True, cwd=cwd).strip()
    except subprocess.CalledProcessError:
        # Handle cases where git command fails (e.g., brand-new repo with no commits)
        return ""

def parse_commit_category(message):
    msg = message.lower().strip()
    if msg.startswith("feat"):
        return "Feature"
    elif msg.startswith("fix"):
        return "Bug Fix"
    elif msg.startswith("refactor"):
        return "Refactor"
    elif msg.startswith("docs") or "document" in msg or "readme" in msg:
        return "Documentation"
    elif msg.startswith("test"):
        return "Testing"
    elif msg.startswith("style") or "css" in msg or "ui" in msg or "theme" in msg:
        return "UI/Styling"
    elif msg.startswith("chore") or "config" in msg or "setup" in msg:
        return "Configuration"
    else:
        return "Development Update"

def scan_codebase_architecture():
    """Scans the repository folder structure to understand the components currently present."""
    components = []
    root = Path(".")
    
    # Simple heuristic scan
    if (root / "package.json").exists():
        components.append({"name": "Frontend/Node Project Config", "path": "package.json", "type": "Config"})
    if (root / "dashboard").exists():
        components.append({"name": "DevNavigator Companion Dashboard", "path": "dashboard", "type": "UI"})
    if (root / "skills").exists():
        components.append({"name": "Antigravity Custom Skills", "path": "skills", "type": "Skill Layer"})
    if (root / "src").exists():
        components.append({"name": "Source Modules", "path": "src", "type": "Source Code"})
        
    return components

def generate_markdown_log(history):
    """Generates a highly structured, beautiful development_log.md from parsed history."""
    lines = [
        "# DevNavigator - Development Journal",
        "",
        f"*Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*",
        "",
        "## System Architecture & Components",
        "",
        "| Component Name | Path | Classification |",
        "| :--- | :--- | :--- |"
    ]
    
    for comp in history.get("architecture", []):
        lines.append(f"| {comp['name']} | `{comp['path']}` | **{comp['type']}** |")
        
    if not history.get("architecture"):
        lines.append("| No components mapped yet | - | - |")
        
    lines.extend([
        "",
        "---",
        "",
        "## Detailed Development Timeline",
        ""
    ])
    
    for commit in reversed(history.get("timeline", [])):
        date_str = commit["date"]
        # Format date for readability
        try:
            dt = datetime.strptime(date_str.split()[0], "%Y-%m-%d")
            formatted_date = dt.strftime("%B %d, %Y")
        except Exception:
            formatted_date = date_str
            
        lines.extend([
            f"### Version/Update: {commit['message'].splitlines()[0]}",
            f"- **Author**: {commit['author']}",
            f"- **Date**: {formatted_date}",
            f"- **Hash**: `{commit['hash'][:8]}`",
            f"- **Classification**: `{commit['category']}`",
            "",
            "#### Impacted Files",
        ])
        
        for file in commit.get("files", []):
            lines.append(f"- `{file}`")
            
        if not commit.get("files"):
            lines.append("- *No files modified in this commit (meta update)*")
            
        lines.append("")
        
    return "\n".join(lines)

def main():
    # Detect repository root
    try:
        repo_root_str = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
        repo_root = Path(repo_root_str)
        os.chdir(repo_root)
    except subprocess.CalledProcessError:
        print("[ERROR] DevNavigator Scan: Not in a Git repository or Git is not installed.")
        return

    print("[INFO] DevNavigator: Initiating codebase scan...")

    # Load cache
    cache = {}
    if Path(CACHE_FILE).exists():
        try:
            cache = json.loads(Path(CACHE_FILE).read_text(encoding="utf-8"))
        except Exception:
            pass

    last_commit = cache.get("last_processed_commit", "")
    
    # Load existing history JSON
    history = {"architecture": [], "timeline": []}
    if Path(HISTORY_JSON).exists():
        try:
            history = json.loads(Path(HISTORY_JSON).read_text(encoding="utf-8"))
        except Exception:
            pass

    # Get commits
    if last_commit:
        commit_range = f"{last_commit}..HEAD"
        commits_raw = run_git_command(["log", commit_range, "--pretty=format:%H|%an|%ad|%s", "--date=short"])
    else:
        # Full scan (retroactive mode)
        commits_raw = run_git_command(["log", "--pretty=format:%H|%an|%ad|%s", "--date=short"])

    new_commits = []
    if commits_raw:
        for line in commits_raw.splitlines():
            if not line.strip() or "|" not in line:
                continue
            parts = line.split("|", 3)
            if len(parts) == 4:
                commit_hash, author, date, message = parts
                
                # Fetch changed files for this commit
                files_raw = run_git_command(["show", "--pretty=format:", "--name-only", commit_hash])
                files = [f.strip() for f in files_raw.splitlines() if f.strip()]
                
                category = parse_commit_category(message)
                
                new_commits.append({
                    "hash": commit_hash,
                    "author": author,
                    "date": date,
                    "message": message,
                    "category": category,
                    "files": files
                })

    # Prepend new commits to history timeline (chronological order)
    if new_commits:
        # Commit log lists commits latest first. We reverse new_commits to maintain ascending chronological timeline
        history["timeline"] = history.get("timeline", []) + list(reversed(new_commits))
        # Update latest commit in cache
        cache["last_processed_commit"] = new_commits[0]["hash"]
    else:
        print("[INFO] No new commits found since last scan.")

    # Always scan architecture to keep it updated in real-time
    history["architecture"] = scan_codebase_architecture()

    # Ensure output directories exist
    Path("dashboard").mkdir(exist_ok=True)

    # Save outputs
    Path(HISTORY_JSON).write_text(json.dumps(history, indent=2), encoding="utf-8")
    Path(CACHE_FILE).write_text(json.dumps(cache, indent=2), encoding="utf-8")
    
    # Write Markdown Log
    md_content = generate_markdown_log(history)
    Path(DEV_LOG_MD).write_text(md_content, encoding="utf-8")

    print(f"[SUCCESS] Successfully updated {DEV_LOG_MD} and {HISTORY_JSON}")

if __name__ == "__main__":
    main()
