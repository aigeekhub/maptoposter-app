"""Saved map model."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SavedMap(Base):
    __tablename__ = "saved_maps"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    folder_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("folders.id"), nullable=True, index=True)

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    country: Mapped[str | None] = mapped_column(String(120), nullable=True)
    theme: Mapped[str] = mapped_column(String(60), nullable=False)
    distance_meters: Mapped[int] = mapped_column(Integer, default=12000)
    width_inches: Mapped[float] = mapped_column(Float, default=18.0)
    height_inches: Mapped[float] = mapped_column(Float, default=24.0)
    font_family: Mapped[str | None] = mapped_column(String(80), nullable=True)
    export_format: Mapped[str] = mapped_column(String(10), default="png")

    file_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="maps")
    folder = relationship("Folder", back_populates="maps")
