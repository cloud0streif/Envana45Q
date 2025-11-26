"""Configuration management using pydantic-settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True

    # Database
    database_url: str = "sqlite+aiosqlite:///./sensor_data.db"

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Processing
    default_processing_interval: int = 3600

    # Scheduler
    enable_scheduler: bool = True
    rolling_average_interval_minutes: int = 1  # How often to calculate rolling average
    rolling_average_window_hours: int = 1  # Time window for rolling average
    rolling_average_sensor_type: str = "bme280"  # Default sensor type to process

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Global settings instance
settings = Settings()
