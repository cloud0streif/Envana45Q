"""Rolling average processor implementation."""

from datetime import datetime
from typing import Any

from .base import BaseProcessor


class RollingAverageProcessor(BaseProcessor):
    """Calculate rolling average of sensor readings over a time window."""

    name = "rolling_average"
    version = "1.0.0"
    description = "Calculate rolling average of sensor readings over a time window"

    async def process(
        self,
        readings: list[dict[str, Any]],
        start_time: datetime,
        end_time: datetime,
        sensor_type: str,
        device_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Calculate rolling average temperature, humidity, and pressure.

        Args:
            readings: List of raw sensor readings
            start_time: Start of time range (window start)
            end_time: End of time range (window end)
            sensor_type: Type of sensor
            device_id: Optional specific device ID

        Returns:
            Dictionary with rolling averages and statistics
        """
        if not readings:
            return {
                "avg_temperature_c": None,
                "avg_humidity": None,
                "avg_pressure_hpa": None,
                "count": 0,
                "window_start": start_time.isoformat(),
                "window_end": end_time.isoformat(),
                "window_duration_minutes": int((end_time - start_time).total_seconds() / 60),
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
            "window_start": start_time.isoformat(),
            "window_end": end_time.isoformat(),
            "window_duration_minutes": int((end_time - start_time).total_seconds() / 60),
        }
