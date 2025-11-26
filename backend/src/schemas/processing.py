"""Processing schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ProcessingJobRequest(BaseModel):
    """Schema for processing job request."""

    processor: str = Field(..., description="Processor name (e.g., 'average')")
    start_time: datetime = Field(..., description="Start of time range to process")
    end_time: datetime = Field(..., description="End of time range to process")
    sensor_type: str = Field(default="bme280", description="Sensor type to process")
    device_id: str | None = Field(None, description="Specific device ID (null for all devices)")

    model_config = {"json_schema_extra": {
        "example": {
            "processor": "average",
            "start_time": "2025-11-14T00:00:00Z",
            "end_time": "2025-11-14T23:59:59Z",
            "sensor_type": "bme280",
            "device_id": None,
        }
    }}


class ProcessingJobResponse(BaseModel):
    """Schema for processing job response."""

    job_id: int
    status: str
    result: dict[str, Any]
    raw_count: int
    created_at: datetime


class ProcessedDataResponse(BaseModel):
    """Schema for processed data response."""

    id: int
    processor_name: str
    processor_version: str
    start_time: datetime
    end_time: datetime
    sensor_type: str
    device_id: str | None
    result: dict[str, Any]
    raw_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ProcessorInfo(BaseModel):
    """Schema for processor information."""

    name: str
    version: str
    description: str

    model_config = {"json_schema_extra": {
        "example": {
            "name": "average",
            "version": "1.0.0",
            "description": "Calculate average of sensor readings",
        }
    }}
