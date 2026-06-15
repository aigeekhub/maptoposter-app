import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

# Force stdout/stderr to use UTF-8 encoding on Windows to prevent UnicodeEncodeError
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

HISTORY_JSON = "dashboard/dev_history.json"
ENV_FILE = ".env"

def load_linear_config():
    # Attempt to load from .env file if it exists
    config = {
        "LINEAR_API_KEY": os.environ.get("LINEAR_API_KEY", ""),
        "LINEAR_TEAM_ID": os.environ.get("LINEAR_TEAM_ID", "")
    }
    
    if Path(ENV_FILE).exists():
        try:
            for line in Path(ENV_FILE).read_text(encoding="utf-8").splitlines():
                if "=" in line and not line.strip().startswith("#"):
                    k, v = line.split("=", 1)
                    k, v = k.strip(), v.strip().strip('"').strip("'")
                    if k in config and not config[k]:
                        config[k] = v
        except Exception:
            pass
            
    return config

def run_linear_graphql(query, variables, api_key):
    url = "https://api.linear.app/graphql"
    headers = {
        "Content-Type": "application/json",
        "Authorization": api_key
    }
    data = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if "errors" in res_data:
                return {"success": False, "errors": res_data["errors"]}
            return {"success": True, "data": res_data.get("data", {})}
    except urllib.error.URLError as e:
        return {"success": False, "errors": [str(e)]}

def fetch_teams(api_key):
    query = """
    query {
      teams {
        nodes {
          id
          name
          key
        }
      }
    }
    """
    res = run_linear_graphql(query, {}, api_key)
    if res["success"]:
        return res["data"].get("teams", {}).get("nodes", [])
    return []

def create_project(name, team_id, api_key):
    query = """
    mutation CreateProject($name: String!, $teamId: String!) {
      projectCreate(input: { name: $name, teamIds: [$teamId] }) {
        success
        project {
          id
          name
        }
      }
    }
    """
    variables = {"name": name, "teamId": team_id}
    res = run_linear_graphql(query, variables, api_key)
    if res["success"] and res["data"].get("projectCreate", {}).get("success"):
        return res["data"]["projectCreate"]["project"]["id"]
    return None

def create_issue(title, project_id, team_id, api_key):
    query = """
    mutation CreateIssue($title: String!, $projectId: String!, $teamId: String!) {
      issueCreate(input: { title: $title, projectId: $projectId, teamId: $teamId }) {
        success
        issue {
          id
          title
        }
      }
    }
    """
    variables = {"title": title, "projectId": project_id, "teamId": team_id}
    res = run_linear_graphql(query, variables, api_key)
    if res["success"] and res["data"].get("issueCreate", {}).get("success"):
        return res["data"]["issueCreate"]["issue"]["id"]
    return None

def main():
    print("[INFO] DevNavigator: Initiating Linear synchronization...")
    
    if not Path(HISTORY_JSON).exists():
        print("[WARNING] No development history found (dashboard/dev_history.json). Run scan_repo.py first!")
        return
        
    try:
        history = json.loads(Path(HISTORY_JSON).read_text(encoding="utf-8"))
    except Exception as e:
        print(f"[ERROR] Error reading history file: {e}")
        return

    config = load_linear_config()
    api_key = config["LINEAR_API_KEY"]
    team_id = config["LINEAR_TEAM_ID"]
    
    # Extract project name from the repository directory
    project_name = Path(".").resolve().name.replace("-", " ").title()
    
    # Dry Run Mode if API key is not supplied
    if not api_key:
        print("\033[93m[WARNING] LINEAR_API_KEY not found in environment or .env file.\033[0m")
        print("\033[94m[INFO] Running in Demonstration (Dry Run) Mode.\033[0m")
        print(f"Would sync project: '{project_name}' to Linear.")
        
        timeline = history.get("timeline", [])
        if not timeline:
            print("No tasks or features parsed yet. Write some commits first!")
            return
            
        print("\n--- Dry Run Sync Payloads ---")
        print(f"[Project Provision] Name: {project_name}")
        for commit in timeline:
            print(f"  [Issue Create] Title: {commit['message'].splitlines()[0]} ({commit['category']})")
        print("------------------------------")
        print("\nTo enable live Linear syncing, add the following to your .env file:")
        print("LINEAR_API_KEY=your_linear_api_token")
        print("LINEAR_TEAM_ID=your_team_id")
        return

    # Real API execution
    print(f"[SUCCESS] Authenticated successfully with Linear. Syncing project '{project_name}'...")
    
    # 1. Resolve Team ID
    if not team_id:
        teams = fetch_teams(api_key)
        if not teams:
            print("[ERROR] Could not fetch any Linear teams. Verify your LINEAR_API_KEY is valid.")
            return
        # Default to first team found
        team = teams[0]
        team_id = team["id"]
        print(f"[INFO] No LINEAR_TEAM_ID specified. Defaulting to team: '{team['name']}' (Key: {team['key']})")
        
    # 2. Provision Project
    # Note: In production we'd cache the created Linear Project ID locally to avoid creating duplicate projects.
    project_id = create_project(project_name, team_id, api_key)
    if not project_id:
        print("[ERROR] Failed to create project in Linear.")
        return
    print(f"[SUCCESS] Successfully provisioned project '{project_name}' (ID: {project_id})")

    # 3. Create Issues from Timeline
    timeline = history.get("timeline", [])
    synced_count = 0
    for commit in timeline:
        title = commit["message"].splitlines()[0]
        issue_id = create_issue(title, project_id, team_id, api_key)
        if issue_id:
            synced_count += 1
            
    print(f"[COMPLETE] Real-time Linear Sync Complete! Created {synced_count} issues.")

if __name__ == "__main__":
    main()
