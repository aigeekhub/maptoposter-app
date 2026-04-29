"""Map generation and management routes."""

import os
import subprocess
import sys
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models import SavedMap, User
from app.schemas.map import MapGenerateRequest, SavedMapResponse


router = APIRouter(prefix="/maps", tags=["maps"])

CLI_SCRIPT = Path(__file__).resolve().parents[3] / "create_map_poster.py"
POSTERS_DIR = Path(__file__).resolve().parents[3] / "posters"


@router.post("/generate")
def generate_map(payload: MapGenerateRequest, db: Session = Depends(get_db),
                 user: User = Depends(get_current_user)):
    POSTERS_DIR.mkdir(exist_ok=True)

    cmd = [
        sys.executable, str(CLI_SCRIPT),
        payload.city,
        "--theme", payload.theme,
        "--distance", str(payload.distance_meters),
        "--width", str(payload.width_inches),
        "--height", str(payload.height_inches),
        "--output-dir", str(POSTERS_DIR),
    ]
    if payload.font_family:
        cmd += ["--font", payload.font_family]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300, cwd=str(CLI_SCRIPT.parent))
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Map generation timed out (max 5 min)")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    if result.returncode != 0:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=f"Generation failed: {result.stderr[:500]}")

    city_slug = payload.city.lower().replace(" ", "_").replace(",", "")
    matches = sorted(POSTERS_DIR.glob(f"{city_slug}_*.png"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not matches:
        matches = sorted(POSTERS_DIR.glob("*.png"), key=lambda p: p.stat().st_mtime, reverse=True)

    file_path = None
    file_size = None
    if matches:
        latest = matches[0]
        file_path = f"/posters/{latest.name}"
        file_size = latest.stat().st_size

    title = payload.title or f"{payload.city} — {payload.theme.replace('_', ' ').title()}"
    saved = SavedMap(
        user_id=user.id,
        title=title,
        city=payload.city,
        theme=payload.theme,
        distance_meters=payload.distance_meters,
        width_inches=payload.width_inches,
        height_inches=payload.height_inches,
        font_family=payload.font_family,
        export_format=payload.export_format,
        file_path=file_path,
        file_size=file_size,
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)

    return {"map_id": saved.id, "file_path": file_path, "title": title}


@router.get("")
def list_maps(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    maps = db.query(SavedMap).filter(SavedMap.user_id == user.id).order_by(SavedMap.created_at.desc()).all()
    return {"maps": [SavedMapResponse.model_validate(m) for m in maps]}


@router.delete("/{map_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_map(map_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    m = db.query(SavedMap).filter(SavedMap.id == map_id, SavedMap.user_id == user.id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Map not found")
    if m.file_path:
        path = POSTERS_DIR / Path(m.file_path).name
        if path.exists():
            os.remove(path)
    db.delete(m)
    db.commit()
