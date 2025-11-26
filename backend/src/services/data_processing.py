"""Data processing service."""

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import ProcessedData, SensorReading
from ..processors import PROCESSORS


async def process_sensor_data(
    db: AsyncSession,
    processor_name: str,
    start_time: datetime,
    end_time: datetime,
    sensor_type: str = "bme280",
    device_id: str | None = None,
) -> ProcessedData:
    """
    Process sensor data using specified processor.

    Args:
        db: Database session
        processor_name: Name of processor to use
        start_time: Start of time range
        end_time: End of time range
        sensor_type: Type of sensor
        device_id: Optional specific device ID

    Returns:
        ProcessedData object with results

    Raises:
        ValueError: If processor not found
    """
    if processor_name not in PROCESSORS:
        raise ValueError(f"Unknown processor: {processor_name}")

    # Get processor instance
    processor_class = PROCESSORS[processor_name]
    processor = processor_class()

    # Query raw data
    query = select(SensorReading).where(
        SensorReading.sensor_type == sensor_type,
        SensorReading.timestamp >= start_time,
        SensorReading.timestamp <= end_time,
    )

    if device_id:
        query = query.where(SensorReading.device_id == device_id)

    result = await db.execute(query)
    readings = result.scalars().all()

    # Convert to dictionaries for processing
    readings_dict = [
        {
            "device_id": r.device_id,
            "timestamp": r.timestamp,
            "temperature_c": r.temperature_c,
            "humidity": r.humidity,
            "pressure_hpa": r.pressure_hpa,
        }
        for r in readings
    ]

    # Process data
    result_data = await processor.process(
        readings_dict, start_time, end_time, sensor_type, device_id
    )

    # Save processed data
    processed = ProcessedData(
        processor_name=processor.name,
        processor_version=processor.version,
        start_time=start_time,
        end_time=end_time,
        sensor_type=sensor_type,
        device_id=device_id,
        result=result_data,
        raw_count=len(readings),
    )

    db.add(processed)
    await db.flush()
    await db.refresh(processed)

    return processed


async def query_processed_data(
    db: AsyncSession,
    processor_name: str | None = None,
    sensor_type: str | None = None,
    start_time: datetime | None = None,
    end_time: datetime | None = None,
    limit: int = 100,
) -> list[ProcessedData]:
    """
    Query processed data with filters.

    Args:
        db: Database session
        processor_name: Filter by processor name
        sensor_type: Filter by sensor type
        start_time: Filter results after this time
        end_time: Filter results before this time
        limit: Maximum number of results

    Returns:
        List of ProcessedData objects
    """
    query = select(ProcessedData)

    if processor_name:
        query = query.where(ProcessedData.processor_name == processor_name)
    if sensor_type:
        query = query.where(ProcessedData.sensor_type == sensor_type)
    if start_time:
        query = query.where(ProcessedData.start_time >= start_time)
    if end_time:
        query = query.where(ProcessedData.end_time <= end_time)

    query = query.order_by(ProcessedData.created_at.desc()).limit(limit)

    result = await db.execute(query)
    return list(result.scalars().all())
