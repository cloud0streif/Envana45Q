"""Sensor data schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class BME280Reading(BaseModel):
    """Schema for BME280 sensor reading input."""

    device_id: str = Field(..., description="Unique device identifier", min_length=1, max_length=100)
    temperature_c: float = Field(..., description="Temperature in Celsius", ge=-40, le=85)
    humidity: float = Field(..., description="Relative humidity percentage", ge=0, le=100)
    pressure_hpa: float = Field(..., description="Atmospheric pressure in hPa", ge=300, le=1100)
    timestamp: datetime | None = Field(None, description="Reading timestamp (defaults to server time)")
    metadata: dict[str, Any] | None = Field(None, description="Additional metadata")

    model_config = {"json_schema_extra": {
        "example": {
            "device_id": "bme280_001",
            "temperature_c": 23.45,
            "humidity": 45.67,
            "pressure_hpa": 1013.25,
            "timestamp": "2025-11-14T10:30:00Z",
            "metadata": {"location": "office"},
        }
    }}


class SensorReadingResponse(BaseModel):
    """Schema for sensor reading response."""

    id: int
    sensor_type: str
    device_id: str
    timestamp: datetime
    temperature_c: float | None
    humidity: float | None
    pressure_hpa: float | None
    metadata: dict[str, Any] | None = Field(None, validation_alias="extra_metadata", serialization_alias="metadata")
    created_at: datetime

    model_config = {"from_attributes": True, "populate_by_name": True}
