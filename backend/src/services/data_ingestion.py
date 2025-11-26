"""Data ingestion service."""

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import SensorReading
from ..schemas.sensor import BME280Reading


async def create_sensor_reading(
    db: AsyncSession, reading: BME280Reading, sensor_type: str = "bme280"
) -> SensorReading:
    """
    Create a new sensor reading in the database.

    Args:
        db: Database session
        reading: Validated BME280 reading data
        sensor_type: Type of sensor (default: bme280)

    Returns:
        Created SensorReading object
    """
    db_reading = SensorReading(
        sensor_type=sensor_type,
        device_id=reading.device_id,
        timestamp=reading.timestamp or datetime.utcnow(),
        temperature_c=reading.temperature_c,
        humidity=reading.humidity,
        pressure_hpa=reading.pressure_hpa,
        extra_metadata=reading.metadata,
    )

    db.add(db_reading)
    await db.flush()
    await db.refresh(db_reading)

    return db_reading


async def query_raw_data(
    db: AsyncSession,
    sensor_type: str | None = None,
    device_id: str | None = None,
    start_time: datetime | None = None,
    end_time: datetime | None = None,
    limit: int = 100,
) -> list[SensorReading]:
    """
    Query raw sensor readings with filters.

    Args:
        db: Database session
        sensor_type: Filter by sensor type
        device_id: Filter by device ID
        start_time: Filter readings after this time
        end_time: Filter readings before this time
        limit: Maximum number of results

    Returns:
        List of SensorReading objects
    """
    query = select(SensorReading)

    if sensor_type:
        query = query.where(SensorReading.sensor_type == sensor_type)
    if device_id:
        query = query.where(SensorReading.device_id == device_id)
    if start_time:
        query = query.where(SensorReading.timestamp >= start_time)
    if end_time:
        query = query.where(SensorReading.timestamp <= end_time)

    query = query.order_by(SensorReading.timestamp.desc()).limit(limit)

    result = await db.execute(query)
    return list(result.scalars().all())
