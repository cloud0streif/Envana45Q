"""Base processor abstract class."""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any


class BaseProcessor(ABC):
    """Abstract base class for data processors."""

    name: str = "base"
    version: str = "1.0.0"
    description: str = "Base processor"

    @abstractmethod
    async def process(
        self,
        readings: list[dict[str, Any]],
        start_time: datetime,
        end_time: datetime,
        sensor_type: str,
        device_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Process raw sensor readings.

        Args:
            readings: List of raw sensor readings as dictionaries
            start_time: Start of time range
            end_time: End of time range
            sensor_type: Type of sensor
            device_id: Optional specific device ID

        Returns:
            Dictionary containing processing results
        """
        pass

    @classmethod
    def get_info(cls) -> dict[str, str]:
        """Get processor information."""
        return {
            "name": cls.name,
            "version": cls.version,
            "description": cls.description,
        }
