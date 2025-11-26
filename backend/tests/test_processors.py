"""Tests for data processors."""

from datetime import datetime

import pytest

from src.processors import AverageProcessor


@pytest.mark.asyncio
async def test_average_processor_with_data():
    """Test average processor with valid data."""
    processor = AverageProcessor()

    readings = [
        {"device_id": "test_001", "temperature_c": 20.0, "humidity": 50.0, "pressure_hpa": 1000.0},
        {"device_id": "test_001", "temperature_c": 22.0, "humidity": 52.0, "pressure_hpa": 1002.0},
        {"device_id": "test_002", "temperature_c": 24.0, "humidity": 54.0, "pressure_hpa": 1004.0},
    ]

    start_time = datetime(2025, 1, 1)
    end_time = datetime(2025, 1, 2)

    result = await processor.process(readings, start_time, end_time, "bme280")

    assert result["count"] == 3
    assert result["avg_temperature_c"] == 22.0
    assert result["avg_humidity"] == 52.0
    assert result["avg_pressure_hpa"] == 1002.0
    assert len(result["devices"]) == 2


@pytest.mark.asyncio
async def test_average_processor_empty_data():
    """Test average processor with no data."""
    processor = AverageProcessor()

    result = await processor.process([], datetime.now(), datetime.now(), "bme280")

    assert result["count"] == 0
    assert result["avg_temperature_c"] is None
    assert result["avg_humidity"] is None
    assert result["avg_pressure_hpa"] is None
