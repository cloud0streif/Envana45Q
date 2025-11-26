"""Sensor data ingestion endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas.sensor import BME280Reading, SensorReadingResponse
from ..services.data_ingestion import create_sensor_reading

router = APIRouter(prefix="/api/v1/sensors", tags=["sensors"])


@router.post("/bme280", response_model=SensorReadingResponse, status_code=status.HTTP_201_CREATED)
async def ingest_bme280_reading(
    reading: BME280Reading,
    db: AsyncSession = Depends(get_db),
) -> SensorReadingResponse:
    """
    Ingest a BME280 sensor reading.

    Stores temperature, humidity, and pressure data from a BME280 sensor.
    """
    try:
        db_reading = await create_sensor_reading(db, reading, sensor_type="bme280")
        return SensorReadingResponse.model_validate(db_reading)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store sensor reading: {str(e)}",
        ) from e
