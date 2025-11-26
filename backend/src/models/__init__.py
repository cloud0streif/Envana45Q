"""Database models."""

from .processed_data import ProcessedData
from .sensor_data import SensorReading

__all__ = ["SensorReading", "ProcessedData"]
