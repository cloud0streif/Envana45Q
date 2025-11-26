"""Tests for BME280 generator."""

import pytest

from src.generators.bme280 import BME280Generator


def test_bme280_generator_creates_valid_reading():
    """Test that generator creates valid readings."""
    generator = BME280Generator(
        device_id="test_001",
        temp_min=18.0,
        temp_max=28.0,
        humidity_min=30.0,
        humidity_max=70.0,
        pressure_min=1000.0,
        pressure_max=1025.0,
    )

    reading = generator.generate()

    assert "device_id" in reading
    assert reading["device_id"] == "test_001"
    assert "temperature_c" in reading
    assert "humidity" in reading
    assert "pressure_hpa" in reading
    assert "timestamp" in reading

    # Check ranges
    assert 18.0 <= reading["temperature_c"] <= 28.0
    assert 30.0 <= reading["humidity"] <= 70.0
    assert 1000.0 <= reading["pressure_hpa"] <= 1025.0


def test_bme280_generator_smooth_transitions():
    """Test that values change gradually between readings."""
    generator = BME280Generator(device_id="test_001")

    reading1 = generator.generate()
    reading2 = generator.generate()

    # Check that changes are gradual (not jumping across entire range)
    temp_diff = abs(reading2["temperature_c"] - reading1["temperature_c"])
    humidity_diff = abs(reading2["humidity"] - reading1["humidity"])
    pressure_diff = abs(reading2["pressure_hpa"] - reading1["pressure_hpa"])

    assert temp_diff <= 1.0  # Max change of 0.5, but allow some buffer
    assert humidity_diff <= 3.0  # Max change of 2.0, but allow some buffer
    assert pressure_diff <= 2.0  # Max change of 1.0, but allow some buffer
