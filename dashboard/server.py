#!/usr/bin/env python3
"""
MapPoster Local API & Static Web Server
Exposes static dashboard routes and API endpoints for poster generation.
Written using Python's standard library to ensure zero dependencies.
"""

import json
import os
import subprocess
import sys
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path

# Force stdout/stderr to UTF-8 on Windows to prevent UnicodeEncodeErrors in logging
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

CURRENT_DIR = Path(__file__).resolve().parent
REPO_ROOT = CURRENT_DIR.parent if CURRENT_DIR.name == "dashboard" else CURRENT_DIR

THEMES_DIR = REPO_ROOT / "themes"
POSTERS_DIR = REPO_ROOT / "posters"
DASHBOARD_DIR = REPO_ROOT / "dashboard"


class MapPosterHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        """
        Maps URL paths to filesystem locations across themes, posters, and dashboard folders.
        """
        parsed_url = urllib.parse.urlparse(path)
        clean_path = urllib.parse.unquote(parsed_url.path)

        # Poster asset routing
        if clean_path.startswith("/posters/"):
            relative_path = clean_path[len("/posters/"):]
            return str((POSTERS_DIR / relative_path).resolve())

        # Theme file routing
        if clean_path.startswith("/themes/"):
            relative_path = clean_path[len("/themes/"):]
            return str((THEMES_DIR / relative_path).resolve())

        # Dashboard UI static routing
        relative_path = clean_path.lstrip("/")
        if not relative_path or relative_path == "index.html":
            return str((DASHBOARD_DIR / "index.html").resolve())

        return str((DASHBOARD_DIR / relative_path).resolve())

    def do_OPTIONS(self):
        """
        Supports CORS preflight requests for API testing.
        """
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def send_error_response(self, code, message):
        """
        Sends structured JSON error response.
        """
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({"success": False, "error": message}).encode("utf-8"))

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)

        # API: Get Themes list
        if parsed_url.path == "/api/themes":
            try:
                themes = []
                if THEMES_DIR.exists():
                    for file in sorted(THEMES_DIR.iterdir()):
                        if file.suffix == ".json":
                            try:
                                with open(file, "r", encoding="utf-8") as f:
                                    data = json.load(f)
                                    theme_id = file.stem
                                    themes.append({
                                        "id": theme_id,
                                        "name": data.get("name", theme_id),
                                        "description": data.get("description", ""),
                                        "bg": data.get("bg", "#ffffff"),
                                        "text": data.get("text", "#000000"),
                                        "water": data.get("water", "#a8c4c4"),
                                        "parks": data.get("parks", "#e8e0d0"),
                                        "road_primary": data.get("road_primary", "#1a1a1a"),
                                    })
                            except Exception as e:
                                print(f"[WARN] Failed to read theme {file.name}: {e}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(themes).encode("utf-8"))
            except Exception as e:
                self.send_error_response(500, f"Failed to list themes: {e}")

        # API: Get Recent generated posters
        elif parsed_url.path == "/api/recent":
            try:
                posters = []
                if POSTERS_DIR.exists():
                    for file in sorted(
                        POSTERS_DIR.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True
                    ):
                        if file.suffix in [".png", ".svg", ".pdf"]:
                            posters.append({
                                "name": file.name,
                                "path": f"/posters/{file.name}",
                                "format": file.suffix[1:].upper(),
                                "mtime": file.stat().st_mtime,
                            })

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(posters[:12]).encode("utf-8"))
            except Exception as e:
                self.send_error_response(500, f"Failed to retrieve recent posters: {e}")

        # Serve static asset
        else:
            super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)

        # API: Generate Map Poster
        if parsed_url.path == "/api/generate":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                post_data = self.rfile.read(content_length)
                params = json.loads(post_data.decode("utf-8"))

                city = params.get("city")
                country = params.get("country")
                if not city or not country:
                    self.send_error_response(400, "Both 'city' and 'country' parameters are required.")
                    return

                # Build CLI arguments to run create_map_poster.py via subprocess
                cmd = ["uv", "run", "python", str(REPO_ROOT / "create_map_poster.py"), "-c", city, "-C", country]

                # Optional arguments
                if params.get("theme"):
                    cmd += ["-t", params["theme"]]
                if params.get("distance"):
                    cmd += ["-d", str(params["distance"])]
                if params.get("width"):
                    cmd += ["-W", str(params["width"])]
                if params.get("height"):
                    cmd += ["-H", str(params["height"])]
                if params.get("latitude"):
                    cmd += ["-lat", str(params["latitude"])]
                if params.get("longitude"):
                    cmd += ["-long", str(params["longitude"])]
                if params.get("country_label"):
                    cmd += ["--country-label", params["country_label"]]
                if params.get("display_city"):
                    cmd += ["-dc", params["display_city"]]
                if params.get("display_country"):
                    cmd += ["-dC", params["display_country"]]
                if params.get("font_family"):
                    cmd += ["--font-family", params["font_family"]]
                if params.get("format"):
                    cmd += ["-f", params["format"]]

                print(f"[SERVER] Spawning poster subprocess: {' '.join(cmd)}")

                # Execute Python CLI
                process = subprocess.run(
                    cmd,
                    cwd=str(REPO_ROOT),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                )

                if process.returncode == 0:
                    city_slug = city.lower().replace(" ", "_")
                    ext = params.get("format", "png").lower()

                    # Find the newly created poster in the posters directory
                    newest_file = None
                    newest_time = 0
                    if POSTERS_DIR.exists():
                        for f in POSTERS_DIR.iterdir():
                            if f.name.startswith(city_slug) and f.suffix == f".{ext}":
                                mtime = f.stat().st_mtime
                                if mtime > newest_time:
                                    newest_time = mtime
                                    newest_file = f.name

                    if newest_file:
                        self.send_response(200)
                        self.send_header("Content-Type", "application/json")
                        self.send_header("Access-Control-Allow-Origin", "*")
                        self.end_headers()
                        self.wfile.write(
                            json.dumps({
                                "success": True,
                                "filename": newest_file,
                                "url": f"/posters/{newest_file}",
                                "log": process.stdout,
                            }).encode("utf-8")
                        )
                    else:
                        self.send_error_response(
                            500,
                            f"Poster generated but file could not be retrieved.\nStdout:\n{process.stdout}",
                        )
                else:
                    self.send_error_response(
                        500,
                        f"Subprocess terminated with code {process.returncode}.\n\n--- STDERR ---\n{process.stderr}\n\n--- STDOUT ---\n{process.stdout}",
                    )
            except Exception as e:
                self.send_error_response(500, f"Server Error during generation: {e}")

        # API: Save Custom Theme
        elif parsed_url.path == "/api/themes/save":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                post_data = self.rfile.read(content_length)
                params = json.loads(post_data.decode("utf-8"))

                name = params.get("name")
                bg = params.get("bg", "#ffffff")
                text = params.get("text", "#000000")
                water = params.get("water", "#a8c4c4")
                parks = params.get("parks", "#e8e0d0")
                road_primary = params.get("road_primary", "#1a1a1a")
                description = params.get("description", "Custom user style")

                if not name:
                    self.send_error_response(400, "Theme name is required.")
                    return

                # Create ID from name (alphanumeric and underscores)
                theme_id = "".join(c if c.isalnum() else "_" for c in name.lower()).strip("_")
                theme_id = f"custom_{theme_id}"

                # Construct theme data
                theme_data = {
                    "name": name,
                    "description": description,
                    "bg": bg,
                    "text": text,
                    "gradient_color": bg,
                    "water": water,
                    "parks": parks,
                    "road_motorway": road_primary,
                    "road_primary": road_primary,
                    "road_secondary": road_primary,
                    "road_tertiary": road_primary,
                    "road_residential": road_primary,
                    "road_default": road_primary,
                }

                # Save file
                if not THEMES_DIR.exists():
                    THEMES_DIR.mkdir(parents=True, exist_ok=True)
                theme_file = THEMES_DIR / f"{theme_id}.json"
                with open(theme_file, "w", encoding="utf-8") as f:
                    json.dump(theme_data, f, indent=2)

                print(f"[SERVER] Successfully saved custom theme: {theme_id}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(
                    json.dumps({
                        "success": True,
                        "theme_id": theme_id,
                        "theme": theme_data,
                    }).encode("utf-8")
                )
            except Exception as e:
                self.send_error_response(500, f"Server Error during saving theme: {e}")
        else:
            self.send_error_response(404, "Endpoint not found.")


def run_server(port=8080):
    while port < 8100:
        try:
            server_address = ("", port)
            httpd = HTTPServer(server_address, MapPosterHandler)
            print(f"\n==================================================")
            print(f"🚀 MapPoster Premium Web Dashboard is live!")
            print(f"👉 Open in your browser: http://localhost:{port}/")
            print(f"==================================================\n")
            httpd.serve_forever()
            break
        except OSError as e:
            # Address already in use error numbers for Linux/macOS (98) and Windows (10048)
            if e.errno in [98, 10048]:
                print(f"[INFO] Port {port} is busy, trying port {port + 1}...")
                port += 1
            else:
                raise e


if __name__ == "__main__":
    run_server()
