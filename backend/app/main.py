"""FastAPI application entry point."""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine
from app.models import Folder, SavedMap, User  # noqa: F401
from app.routes import auth, me, themes


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(me.router, prefix=settings.api_prefix)
app.include_router(themes.router, prefix=settings.api_prefix)


@app.get("/api/health")
def health():
    return {"status": "ok", "version": settings.app_version}


posters_path = os.path.join(os.path.dirname(__file__), "..", "..", "posters")
if os.path.exists(posters_path):
    app.mount("/posters", StaticFiles(directory=posters_path), name="posters")
