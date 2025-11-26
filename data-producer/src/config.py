"""Configuration management."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Data producer settings."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Server
    server_url: str = "http://localhost:8000"

    # Device
    device_id: str = "bme280_fake_001"
    interval_seconds: int = 10

    # Sensor mode
    use_real_sensor: bool = False  # Set to True to use real BME280 sensor
    i2c_address: int = 0x76  # BME280 I2C address (0x76 or 0x77)
    i2c_port: int = 1  # I2C port (usually 1 on Raspberry Pi)

    # Data ranges for realistic fake data (used when use_real_sensor=False)
    temp_min: float = 18.0
    temp_max: float = 28.0
    humidity_min: float = 30.0
    humidity_max: float = 70.0
    pressure_min: float = 1000.0
    pressure_max: float = 1025.0


# Global settings instance
settings = Settings()
