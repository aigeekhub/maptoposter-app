"""Theme listing route - reads from existing CLI themes folder."""

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException


router = APIRouter(prefix="/themes", tags=["themes"])

THEMES_DIR = Path(__file__).resolve().parents[3] / "themes"


@router.get("")
def list_themes():
    if not THEMES_DIR.exists():
        return {"themes": []}

    themes = []
    for path in sorted(THEMES_DIR.glob("*.json")):
        try:
            with open(path) as f:
                data = json.load(f)
            themes.append({
                "id": path.stem,
                "name": data.get("name", path.stem),
                "description": data.get("description", ""),
                "colors": data.get("colors", {}),
            })
        except (json.JSONDecodeError, OSError):
            continue
    return {"themes": themes}


@router.get("/{theme_id}")
def get_theme(theme_id: str):
    path = THEMES_DIR / f"{theme_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Theme not found")
    with open(path) as f:
        return json.load(f)
