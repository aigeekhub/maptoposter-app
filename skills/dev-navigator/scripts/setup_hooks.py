import os
import sys
import subprocess
from pathlib import Path

# Force stdout/stderr to use UTF-8 encoding on Windows to prevent UnicodeEncodeError
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

def print_success(message):
    print(f"\033[92m[SUCCESS] {message}\033[0m")

def print_warning(message):
    print(f"\033[93m[WARNING] {message}\033[0m")

def print_error(message):
    print(f"\033[91m[ERROR] {message}\033[0m")

def setup_local_hook(repo_root: Path):
    git_dir = repo_root / ".git"
    if not git_dir.exists():
        print_error(f"Not a git repository: {repo_root}")
        return False
    
    hooks_dir = git_dir / "hooks"
    hooks_dir.mkdir(exist_ok=True)
    
    post_commit_path = hooks_dir / "post-commit"
    
    # Standard shell script hook that runs on Git Bash (Windows), macOS, and Linux
    hook_content = """#!/bin/sh
# DevNavigator Automated Hook
echo "[DEVNAVIGATOR] Analyzing commit and syncing project boards..."
python3 skills/dev-navigator/scripts/scan_repo.py --incremental > /dev/null 2>&1 || python skills/dev-navigator/scripts/scan_repo.py --incremental > /dev/null 2>&1
"""
    
    post_commit_path.write_text(hook_content, encoding="utf-8")
    
    # Set executable permissions (Unix/macOS)
    try:
        post_commit_path.chmod(post_commit_path.stat().st_mode | 0o111)
    except Exception:
        pass
        
    print_success(f"Installed local git hook: {post_commit_path}")
    return True

def setup_global_templates():
    home_dir = Path.home()
    templates_dir = home_dir / ".git-templates"
    global_hooks_dir = templates_dir / "hooks"
    
    try:
        global_hooks_dir.mkdir(parents=True, exist_ok=True)
        
        post_commit_path = global_hooks_dir / "post-commit"
        hook_content = """#!/bin/sh
# DevNavigator Automated Global Hook
# Checks if DevNavigator is configured for this project before running
if [ -d "skills/dev-navigator" ]; then
    echo "[DEVNAVIGATOR] Syncing change logs and boards..."
    python3 skills/dev-navigator/scripts/scan_repo.py --incremental > /dev/null 2>&1 || python skills/dev-navigator/scripts/scan_repo.py --incremental > /dev/null 2>&1
fi
"""
        post_commit_path.write_text(hook_content, encoding="utf-8")
        
        # Set executable permissions (Unix/macOS)
        try:
            post_commit_path.chmod(post_commit_path.stat().st_mode | 0o111)
        except Exception:
            pass
            
        # Configure git global templateDir
        # Convert path to forward slashes to prevent Windows path escaping issues in Git config
        escaped_templates_dir = str(templates_dir).replace('\\', '/')
        subprocess.run(["git", "config", "--global", "init.templateDir", escaped_templates_dir], check=True)
        
        print_success(f"Successfully configured global Git templates at {escaped_templates_dir}")
        print_success("All future 'git init' or 'git clone' operations will automatically include the tracking hook!")
    except Exception as e:
        print_warning(f"Could not configure global templates (permissions or git missing): {e}")

def main():
    print("[DEVNAVIGATOR] Initializing DevNavigator Git Hook setup...")
    
    # 1. Detect repository root
    try:
        repo_root_str = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
        repo_root = Path(repo_root_str)
        local_success = setup_local_hook(repo_root)
    except subprocess.CalledProcessError:
        print_warning("No local Git repository detected. Skipping local hook installation.")
        local_success = False
        
    # 2. Setup global template directory
    setup_global_templates()
    
    print("\n[COMPLETE] DevNavigator hook setup complete!")

if __name__ == "__main__":
    main()
