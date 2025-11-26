"""Average processor implementation."""

from datetime import datetime
from typing import Any

from .base import BaseProcessor


class AverageProcessor(BaseProcessor):
    """Calculate average of sensor readings over a time range."""

    name = "average"
    version = "1.0.0"
    description = "Calculate average of sensor readings"

    async def process(
        self,
        readings: list[dict[str, Any]],
        start_time: datetime,
        end_time: datetime,
        sensor_type: str,
        device_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Calculate average temperature, humidity, and pressure.

        Args:
            readings: List of raw sensor readings
            start_time: Start of time range
            end_time: End of time range
            sensor_type: Type of sensor
            device_id: Optional specific device ID

        Returns:
            Dictionary with averages and statistics
        """
        if not readings:
            return {
                "avg_temperature_c": None,
                "avg_humidity": None,
                "avg_pressure_hpa": None,
                "count": 0,
            }

        # Extract numeric values, filtering out None
        temps = [r["temperature_c"] for r in readings if r.get("temperature_c") is not None]
        humidities = [r["humidity"] for r in readings if r.get("humidity") is not None]
        pressures = [r["pressure_hpa"] for r in readings if r.get("pressure_hpa") is not None]

        return {
            "avg_temperature_c": round(sum(temps) / len(temps), 2) if temps else None,
            "avg_humidity": round(sum(humidities) / len(humidities), 2) if humidities else None,
            "avg_pressure_hpa": round(sum(pressures) / len(pressures), 2) if pressures else None,
            "count": len(readings),
            "devices": list({r["device_id"] for r in readings}),
        }
