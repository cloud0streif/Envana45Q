"""BME280 fake data generator."""

import random
from datetime import datetime, timezone
from typing import Any

from .base import BaseGenerator


class BME280Generator(BaseGenerator):
    """Generate realistic BME280 sensor readings."""

    def __init__(
        self,
        device_id: str,
        temp_min: float = 18.0,
        temp_max: float = 28.0,
        humidity_min: float = 30.0,
        humidity_max: float = 70.0,
        pressure_min: float = 1000.0,
        pressure_max: float = 1025.0,
    ):
        """
        Initialize BME280 generator.

        Args:
            device_id: Unique device identifier
            temp_min: Minimum temperature in Celsius
            temp_max: Maximum temperature in Celsius
            humidity_min: Minimum humidity percentage
            humidity_max: Maximum humidity percentage
            pressure_min: Minimum pressure in hPa
            pressure_max: Maximum pressure in hPa
        """
        self.device_id = device_id
        self.temp_min = temp_min
        self.temp_max = temp_max
        self.humidity_min = humidity_min
        self.humidity_max = humidity_max
        self.pressure_min = pressure_min
        self.pressure_max = pressure_max

        # Initialize with random base values for smoother transitions
        self._last_temp = random.uniform(temp_min, temp_max)
        self._last_humidity = random.uniform(humidity_min, humidity_max)
        self._last_pressure = random.uniform(pressure_min, pressure_max)

    def generate(self) -> dict[str, Any]:
        """
        Generate a realistic BME280 reading.

        Uses gradual changes from previous values to simulate real sensor behavior.

        Returns:
            Dictionary with temperature_c, humidity, pressure_hpa, device_id, and timestamp
        """
        # Generate values with small random changes from previous reading
        # This creates more realistic, gradually changing data
        self._last_temp = self._clamp(
            self._last_temp + random.uniform(-0.5, 0.5), self.temp_min, self.temp_max
        )
        self._last_humidity = self._clamp(
            self._last_humidity + random.uniform(-2.0, 2.0), self.humidity_min, self.humidity_max
        )
        self._last_pressure = self._clamp(
            self._last_pressure + random.uniform(-1.0, 1.0), self.pressure_min, self.pressure_max
        )

        return {
            "device_id": self.device_id,
            "temperature_c": round(self._last_temp, 2),
            "humidity": round(self._last_humidity, 2),
            "pressure_hpa": round(self._last_pressure, 2),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    @staticmethod
    def _clamp(value: float, min_val: float, max_val: float) -> float:
        """Clamp value between min and max."""
        return max(min_val, min(max_val, value))
