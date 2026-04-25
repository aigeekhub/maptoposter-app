"""Application configuration."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "MapToPoster API"
    app_version: str = "0.1.0"
    debug: bool = True

    database_url: str = "sqlite:///./maptoposter.db"
    db_echo: bool = False

    secret_key: str = "dev-secret-key-change-in-production-please"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7

    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
    ]
    api_prefix: str = "/api"

    posters_dir: str = "../posters"


settings = Settings()
