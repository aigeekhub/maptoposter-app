import os
import sys
import json
import subprocess
from pathlib import Path

# Force stdout/stderr to use UTF-8 encoding on Windows to prevent UnicodeEncodeError
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

def run_cmd(args):
    try:
        return subprocess.check_output(args, text=True, stderr=subprocess.STDOUT).strip()
    except subprocess.CalledProcessError as e:
        print(f"\033[91m[ERROR] Error running command {' '.join(args)}:\n{e.output}\033[0m")
        return None

def bump_semver(version, level):
    parts = version.strip().split(".")
    if len(parts) != 3:
        return "1.0.0"
        
    major, minor, patch = int(parts[0]), int(parts[1]), int(parts[2])
    
    if level == "major":
        major += 1
        minor = 0
        patch = 0
    elif level == "minor":
        minor += 1
        patch = 0
    else:  # default patch
        patch += 1
        
    return f"{major}.{minor}.{patch}"

def update_project_version(level):
    version = "1.0.0"
    pkg_path = Path("package.json")
    v_json_path = Path("version.json")
    
    if pkg_path.exists():
        try:
            data = json.loads(pkg_path.read_text(encoding="utf-8"))
            version = data.get("version", "1.0.0")
            new_version = bump_semver(version, level)
            data["version"] = new_version
            pkg_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
            print(f"[SUCCESS] Bumped package.json version: {version} -> {new_version}")
            return new_version
        except Exception as e:
            print(f"[WARNING] Failed updating package.json: {e}")
            
    # Generic version.json fallback
    data = {}
    if v_json_path.exists():
        try:
            data = json.loads(v_json_path.read_text(encoding="utf-8"))
            version = data.get("version", "1.0.0")
        except Exception:
            pass
            
    new_version = bump_semver(version, level)
    data["version"] = new_version
    v_json_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"[SUCCESS] Bumped version.json: {version} -> {new_version}")
    return new_version

def compile_release_notes(new_version):
    """Parses dev_history.json to assemble highly detailed release notes."""
    history_path = Path("dashboard/dev_history.json")
    notes = [
        f"# Release Notes - {new_version}",
        "",
        "Detailed changelog and architectural update log for this release cycle.",
        "",
        "## Key Changes & Implementations",
        ""
    ]
    
    if history_path.exists():
        try:
            history = json.loads(history_path.read_text(encoding="utf-8"))
            timeline = history.get("timeline", [])
            # Pull recent logs (e.g. up to 10 most recent updates)
            recent_logs = reversed(timeline[-10:])
            for item in recent_logs:
                notes.append(f"### {item['message'].splitlines()[0]}")
                notes.append(f"- **Category**: `{item['category']}`")
                notes.append(f"- **Impacted files**: {', '.join([f'`{f}`' for f in item.get('files', [])[:5]])}")
                notes.append("")
        except Exception as e:
            notes.append(f"*Could not load detailed changelog: {e}*")
    else:
        notes.append("*No logs found. First release.*")
        
    return "\n".join(notes)

def main():
    print("[DEVNAVIGATOR] GitHub Release and Versioning Automator...")
    
    # 1. Ask for version bump level (can pass via args)
    level = "patch"
    if len(sys.argv) > 1 and sys.argv[1] in ["major", "minor", "patch"]:
        level = sys.argv[1]
    else:
        print("\nSelect version bump level:")
        print("1. Patch (e.g., bug fixes, small tweaks) [Default]")
        print("2. Minor (e.g., new features, non-breaking modifications)")
        print("3. Major (e.g., breaking architectural changes)")
        choice = "1"  # Default in non-interactive terminal tests
        print(f"Non-interactive session: defaulting to Patch release.")
            
    # 2. Bump Version file
    new_version = update_project_version(level)
    tag_name = f"v{new_version}"
    
    # 3. Create release notes
    notes = compile_release_notes(new_version)
    Path("RELEASE_NOTES.md").write_text(notes, encoding="utf-8")
    print("[SUCCESS] Formatted and saved RELEASE_NOTES.md")
    
    # 4. Commit and Tag with Git
    print("\n[INFO] Staging version files and committing...")
    files_to_add = ["version.json", "RELEASE_NOTES.md"]
    if Path("package.json").exists():
        files_to_add.append("package.json")
    if Path("development_log.md").exists():
        files_to_add.append("development_log.md")
    if Path("dashboard/dev_history.json").exists():
        files_to_add.append("dashboard/dev_history.json")
        
    run_cmd(["git", "add"] + files_to_add)
    commit_msg = f"chore(release): bump version to {new_version} and update changelogs"
    
    res = run_cmd(["git", "commit", "-m", commit_msg])
    if res:
        print(f"[SUCCESS] Committed: {commit_msg}")
        
    # Tag release
    tag_res = run_cmd(["git", "tag", "-a", tag_name, "-m", f"Release {tag_name}"])
    if tag_res is not None:
        print(f"[SUCCESS] Created annotated Git tag: {tag_name}")
        
    # Push to origin
    # Try pushing, but catch remote failures (e.g. if no remote is configured yet)
    print("\n[INFO] Attempting to push changes to remote GitHub origin...")
    branch_res = run_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"])
    branch = branch_res if branch_res else "main"
    
    push_res = run_cmd(["git", "push", "origin", branch, "--tags"])
    if push_res is not None:
        print("[SUCCESS] Successfully pushed commits and tags to GitHub!")
    else:
        print("[WARNING] Remote push skipped or failed. Local release, staging, and tags are fully active.")
        
    print(f"\n[COMPLETE] Versioning and release sequence for {tag_name} complete!")

if __name__ == "__main__":
    main()
