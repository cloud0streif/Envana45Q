"""Data query endpoints."""

from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas.sensor import SensorReadingResponse
from ..services.data_ingestion import query_raw_data

router = APIRouter(prefix="/api/v1/data", tags=["query"])


@router.get("/raw", response_model=dict[str, int | list[SensorReadingResponse]])
async def get_raw_data(
    sensor_type: str | None = Query(None, description="Filter by sensor type"),
    device_id: str | None = Query(None, description="Filter by device ID"),
    start: datetime | None = Query(None, description="Start of time range"),
    end: datetime | None = Query(None, description="End of time range"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, int | list[SensorReadingResponse]]:
    """
    Query raw sensor readings with optional filters.

    Returns paginated sensor data matching the specified criteria.
    """
    readings = await query_raw_data(
        db,
        sensor_type=sensor_type,
        device_id=device_id,
        start_time=start,
        end_time=end,
        limit=limit,
    )

    return {
        "count": len(readings),
        "data": [SensorReadingResponse.model_validate(r) for r in readings],
    }


@router.get("/raw/{device_id}", response_model=dict[str, int | list[SensorReadingResponse]])
async def get_device_data(
    device_id: str,
    start: datetime | None = Query(None, description="Start of time range"),
    end: datetime | None = Query(None, description="End of time range"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, int | list[SensorReadingResponse]]:
    """
    Query raw sensor readings for a specific device.

    Returns paginated sensor data for the specified device.
    """
    readings = await query_raw_data(
        db, device_id=device_id, start_time=start, end_time=end, limit=limit
    )

    return {
        "count": len(readings),
        "data": [SensorReadingResponse.model_validate(r) for r in readings],
    }
