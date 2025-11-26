"""HTTP client for sending data to backend."""

import asyncio
from typing import Any

import httpx


class SensorClient:
    """HTTP client for sending sensor data to the backend API."""

    def __init__(self, base_url: str, timeout: float = 10.0):
        """
        Initialize sensor client.

        Args:
            base_url: Base URL of the backend API
            timeout: Request timeout in seconds
        """
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.client = httpx.AsyncClient(timeout=timeout)

    async def send_bme280_reading(self, reading: dict[str, Any]) -> bool:
        """
        Send BME280 reading to the backend.

        Args:
            reading: Sensor reading data

        Returns:
            True if successful, False otherwise
        """
        url = f"{self.base_url}/api/v1/sensors/bme280"

        try:
            response = await self.client.post(url, json=reading)
            response.raise_for_status()
            return True
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
            return False
        except httpx.RequestError as e:
            print(f"Request error occurred: {e}")
            return False
        except Exception as e:
            print(f"Unexpected error: {e}")
            return False

    async def check_health(self) -> bool:
        """
        Check if the backend server is healthy.

        Returns:
            True if server is healthy, False otherwise
        """
        url = f"{self.base_url}/api/v1/health"

        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json()
            return data.get("status") == "healthy"
        except Exception as e:
            print(f"Health check failed: {e}")
            return False

    async def close(self) -> None:
        """Close the HTTP client."""
        await self.client.aclose()
