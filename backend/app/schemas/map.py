"""Map schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MapGenerateRequest(BaseModel):
    city: str = Field(min_length=1, max_length=120)
    theme: str = Field(default="terracotta")
    distance_meters: int = Field(default=12000, ge=1000, le=50000)
    width_inches: float = Field(default=18.0, gt=0, le=40)
    height_inches: float = Field(default=24.0, gt=0, le=40)
    font_family: str | None = None
    export_format: str = Field(default="png", pattern="^(png|svg|pdf)$")
    title: str | None = None


class SavedMapResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    city: str
    country: str | None
    theme: str
    distance_meters: int
    width_inches: float
    height_inches: float
    export_format: str
    file_path: str | None
    is_favorite: bool
    is_public: bool
    folder_id: str | None
    created_at: datetime
