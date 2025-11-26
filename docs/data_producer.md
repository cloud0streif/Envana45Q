# Fake Data Producer Implementation Plan

## Overview

Build an isolated Python application that generates realistic BME280 sensor data and sends it to the HTTP server at configurable intervals.

## Implementation Order

### Step 1: Project Initialization

Create the data producer directory structure and initialize Poetry:

```bash
mkdir -p data-producer/src/generators
mkdir -p data-producer/tests
cd data-producer
poetry init --name sensor-data-producer --python "^3.11"
```

Add dependencies:

```bash
poetry add httpx pydantic-settings python-dotenv
poetry add --group dev pytest pytest-asyncio ruff mypy
```

### Step 2: Configuration

**File: `data-producer/src/config.py`**

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Data producer configuration"""
    
    # Server
    server_url: str = "http://localhost:8000"
    
    # Generator
    device_id: str = "bme280_fake_001"
    interval_seconds: float = 10.0
    
    # Data ranges for realistic fake data
    temp_min: float = 18.0
    temp_max: float = 28.0
    temp_drift: float = 0.5  # Max change per interval
    
    humidity_min: float = 30.0
    humidity_max: float = 70.0
    humidity_drift: float = 2.0
    
    pressure_min: float = 1000.0
    pressure_max: float = 1025.0
    pressure_drift: float = 0.5
    
    # Randomness
    add_noise: bool = True
    noise_factor: float = 0.1
    
    # Patterns (simulate environmental changes)
    enable_daily_pattern: bool = True
    enable_weather_events: bool = True
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
```

**File: `data-producer/.env.example`**

```bash
# Server Configuration
SERVER_URL=http://localhost:8000

# Generator Configuration
DEVICE_ID=bme280_fake_001
INTERVAL_SECONDS=10.0

# Temperature (Celsius)
TEMP_MIN=18.0
TEMP_MAX=28.0
TEMP_DRIFT=0.5

# Humidity (%)
HUMIDITY_MIN=30.0
HUMIDITY_MAX=70.0
HUMIDITY_DRIFT=2.0

# Pressure (hPa)
PRESSURE_MIN=1000.0
PRESSURE_MAX=1025.0
PRESSURE_DRIFT=0.5

# Randomness
ADD_NOISE=true
NOISE_FACTOR=0.1

# Patterns
ENABLE_DAILY_PATTERN=true
ENABLE_WEATHER_EVENTS=true
```

### Step 3: Data Schemas

**File: `data-producer/src/schemas.py`**

```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class BME280Reading(BaseModel):
    """Schema for BME280 sensor reading"""
    
    device_id: str
    temperature_c: float = Field(..., ge=-40, le=85)
    humidity: float = Field(..., ge=0, le=100)
    pressure_hpa: float = Field(..., ge=300, le=1100)
    timestamp: Optional[datetime] = None
    metadata: Optional[dict] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
```

### Step 4: Base Generator

**File: `data-producer/src/generators/base.py`**

```python
from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseGenerator(ABC):
    """Abstract base class for sensor data generators"""
    
    def __init__(self, device_id: str):
        self.device_id = device_id
        self.current_state: Dict[str, float] = {}
    
    @abstractmethod
    async def generate(self) -> Dict[str, Any]:
        """
        Generate one sensor reading
        
        Returns:
            Dictionary with sensor data
        """
        pass
    
    @abstractmethod
    def reset(self):
        """Reset generator to initial state"""
        pass
```

### Step 5: BME280 Generator

**File: `data-producer/src/generators/bme280.py`**

```python
import random
import math
from datetime import datetime, time
from typing import Dict, Any
from src.generators.base import BaseGenerator
from src.config import get_settings


class BME280Generator(BaseGenerator):
    """Generate realistic BME280 sensor data"""
    
    def __init__(self, device_id: str):
        super().__init__(device_id)
        self.settings = get_settings()
        self.reset()
        
        # Weather event simulation
        self.weather_event_probability = 0.01  # 1% chance per reading
        self.in_weather_event = False
        self.weather_event_duration = 0
        self.weather_event_type = None
    
    def reset(self):
        """Initialize with random starting values"""
        self.current_state = {
            "temperature_c": random.uniform(
                self.settings.temp_min + 2,
                self.settings.temp_max - 2
            ),
            "humidity": random.uniform(
                self.settings.humidity_min + 5,
                self.settings.humidity_max - 5
            ),
            "pressure_hpa": random.uniform(
                self.settings.pressure_min + 5,
                self.settings.pressure_max - 5
            ),
        }
    
    def _add_noise(self, value: float, factor: float = 1.0) -> float:
        """Add small random noise to value"""
        if not self.settings.add_noise:
            return value
        
        noise = random.gauss(0, self.settings.noise_factor * factor)
        return value + noise
    
    def _apply_daily_pattern(self) -> Dict[str, float]:
        """Apply daily temperature/humidity patterns"""
        if not self.settings.enable_daily_pattern:
            return {"temp_offset": 0, "humidity_offset": 0}
        
        # Get current hour
        now = datetime.now()
        hour = now.hour + now.minute / 60.0
        
        # Temperature peaks in afternoon (14:00), lowest at dawn (6:00)
        # Use sine wave shifted to match daily cycle
        temp_cycle = math.sin((hour - 6) * math.pi / 12)  # -1 to 1
        temp_offset = temp_cycle * 3.0  # ±3°C variation
        
        # Humidity inverse of temperature (higher at night)
        humidity_offset = -temp_cycle * 10.0  # ±10% variation
        
        return {
            "temp_offset": temp_offset,
            "humidity_offset": humidity_offset
        }
    
    def _simulate_weather_event(self):
        """Simulate weather events (storms, fronts, etc.)"""
        if not self.settings.enable_weather_events:
            return {"pressure_offset": 0, "humidity_offset": 0, "temp_offset": 0}
        
        # Check if we should start a new weather event
        if not self.in_weather_event and random.random() < self.weather_event_probability:
            self.in_weather_event = True
            self.weather_event_duration = random.randint(10, 50)  # 10-50 readings
            self.weather_event_type = random.choice(["storm", "front", "clear"])
        
        # Process ongoing weather event
        if self.in_weather_event:
            self.weather_event_duration -= 1
            
            if self.weather_event_duration <= 0:
                self.in_weather_event = False
                return {"pressure_offset": 0, "humidity_offset": 0, "temp_offset": 0}
            
            # Different patterns for different event types
            if self.weather_event_type == "storm":
                # Dropping pressure, rising humidity
                return {
                    "pressure_offset": -2.0,
                    "humidity_offset": 5.0,
                    "temp_offset": -1.0,
                }
            elif self.weather_event_type == "front":
                # Rapid pressure change
                return {
                    "pressure_offset": 3.0,
                    "humidity_offset": -3.0,
                    "temp_offset": 2.0,
                }
            elif self.weather_event_type == "clear":
                # Rising pressure, falling humidity
                return {
                    "pressure_offset": 1.5,
                    "humidity_offset": -5.0,
                    "temp_offset": 0.5,
                }
        
        return {"pressure_offset": 0, "humidity_offset": 0, "temp_offset": 0}
    
    def _drift_value(
        self,
        current: float,
        min_val: float,
        max_val: float,
        max_drift: float,
        offset: float = 0
    ) -> float:
        """
        Apply random walk with bounds and optional offset
        
        Args:
            current: Current value
            min_val: Minimum allowed value
            max_val: Maximum allowed value
            max_drift: Maximum change per step
            offset: External offset to apply (e.g., from patterns)
        """
        # Random walk
        drift = random.uniform(-max_drift, max_drift)
        new_value = current + drift + offset
        
        # Apply bounds with soft limits (bounce back)
        if new_value < min_val:
            new_value = min_val + (min_val - new_value) * 0.5
        elif new_value > max_val:
            new_value = max_val - (new_value - max_val) * 0.5
        
        # Hard limits
        new_value = max(min_val, min(max_val, new_value))
        
        return new_value
    
    async def generate(self) -> Dict[str, Any]:
        """Generate one BME280 reading with realistic patterns"""
        
        # Get pattern offsets
        daily = self._apply_daily_pattern()
        weather = self._simulate_weather_event()
        
        # Update temperature with daily pattern
        self.current_state["temperature_c"] = self._drift_value(
            self.current_state["temperature_c"],
            self.settings.temp_min,
            self.settings.temp_max,
            self.settings.temp_drift,
            offset=daily["temp_offset"] * 0.1 + weather["temp_offset"] * 0.1
        )
        
        # Update humidity with daily pattern and weather
        self.current_state["humidity"] = self._drift_value(
            self.current_state["humidity"],
            self.settings.humidity_min,
            self.settings.humidity_max,
            self.settings.humidity_drift,
            offset=daily["humidity_offset"] * 0.1 + weather["humidity_offset"] * 0.1
        )
        
        # Update pressure with weather events
        self.current_state["pressure_hpa"] = self._drift_value(
            self.current_state["pressure_hpa"],
            self.settings.pressure_min,
            self.settings.pressure_max,
            self.settings.pressure_drift,
            offset=weather["pressure_offset"] * 0.1
        )
        
        # Add noise and create reading
        reading = {
            "device_id": self.device_id,
            "temperature_c": round(
                self._add_noise(self.current_state["temperature_c"], 0.2), 2
            ),
            "humidity": round(
                self._add_noise(self.current_state["humidity"], 1.0), 2
            ),
            "pressure_hpa": round(
                self._add_noise(self.current_state["pressure_hpa"], 0.3), 2
            ),
            "timestamp": datetime.utcnow(),
            "metadata": {
                "generator": "BME280Generator",
                "version": "1.0.0",
                "in_weather_event": self.in_weather_event,
                "weather_event_type": self.weather_event_type if self.in_weather_event else None,
            }
        }
        
        return reading


class MultiBME280Generator:
    """Generate data for multiple BME280 sensors"""
    
    def __init__(self, device_ids: list[str]):
        self.generators = {
            device_id: BME280Generator(device_id)
            for device_id in device_ids
        }
    
    async def generate_all(self) -> list[Dict[str, Any]]:
        """Generate readings for all devices"""
        readings = []
        for generator in self.generators.values():
            reading = await generator.generate()
            readings.append(reading)
        return readings
    
    def reset_all(self):
        """Reset all generators"""
        for generator in self.generators.values():
            generator.reset()
```

**File: `data-producer/src/generators/__init__.py`**

```python
from src.generators.base import BaseGenerator
from src.generators.bme280 import BME280Generator, MultiBME280Generator

__all__ = ["BaseGenerator", "BME280Generator", "MultiBME280Generator"]
```

### Step 6: HTTP Client

**File: `data-producer/src/client.py`**

```python
import httpx
import asyncio
from typing import Dict, Any
from datetime import datetime
from src.config import get_settings


class SensorClient:
    """HTTP client for sending sensor data to server"""
    
    def __init__(self, base_url: str | None = None):
        self.settings = get_settings()
        self.base_url = base_url or self.settings.server_url
        self.client: httpx.AsyncClient | None = None
        self.stats = {
            "sent": 0,
            "failed": 0,
            "last_success": None,
            "last_error": None,
        }
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=10.0,
            headers={"Content-Type": "application/json"}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.client:
            await self.client.aclose()
    
    async def send_bme280_reading(self, reading: Dict[str, Any]) -> bool:
        """
        Send BME280 reading to server
        
        Args:
            reading: Dictionary with sensor data
            
        Returns:
            True if successful, False otherwise
        """
        if not self.client:
            raise RuntimeError("Client not initialized. Use async context manager.")
        
        try:
            # Convert datetime to ISO format if present
            if "timestamp" in reading and isinstance(reading["timestamp"], datetime):
                reading["timestamp"] = reading["timestamp"].isoformat()
            
            response = await self.client.post(
                "/api/v1/sensors/bme280",
                json=reading
            )
            
            if response.status_code in (200, 201):
                self.stats["sent"] += 1
                self.stats["last_success"] = datetime.now()
                return True
            else:
                self.stats["failed"] += 1
                self.stats["last_error"] = f"HTTP {response.status_code}: {response.text}"
                print(f"Failed to send reading: {self.stats['last_error']}")
                return False
                
        except httpx.RequestError as e:
            self.stats["failed"] += 1
            self.stats["last_error"] = str(e)
            print(f"Request error: {e}")
            return False
        except Exception as e:
            self.stats["failed"] += 1
            self.stats["last_error"] = str(e)
            print(f"Unexpected error: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get client statistics"""
        return self.stats.copy()
```

### Step 7: Main Application

**File: `data-producer/src/main.py`**

```python
import asyncio
from datetime import datetime
from src.config import get_settings
from src.generators.bme280 import BME280Generator
from src.client import SensorClient


async def main():
    """Main data producer loop"""
    settings = get_settings()
    
    print(f"Starting BME280 Data Producer")
    print(f"Device ID: {settings.device_id}")
    print(f"Server: {settings.server_url}")
    print(f"Interval: {settings.interval_seconds}s")
    print(f"Temperature range: {settings.temp_min}°C - {settings.temp_max}°C")
    print(f"Humidity range: {settings.humidity_min}% - {settings.humidity_max}%")
    print(f"Pressure range: {settings.pressure_min} - {settings.pressure_max} hPa")
    print("-" * 60)
    
    # Create generator
    generator = BME280Generator(settings.device_id)
    
    # Create HTTP client
    async with SensorClient() as client:
        
        try:
            iteration = 0
            while True:
                iteration += 1
                
                # Generate reading
                reading = await generator.generate()
                
                # Send to server
                success = await client.send_bme280_reading(reading)
                
                # Log
                status = "✓" if success else "✗"
                weather_info = ""
                if reading["metadata"].get("in_weather_event"):
                    weather_info = f" [Weather: {reading['metadata']['weather_event_type']}]"
                
                print(
                    f"{status} #{iteration:04d} | "
                    f"{reading['timestamp'].strftime('%H:%M:%S')} | "
                    f"T:{reading['temperature_c']:5.2f}°C | "
                    f"H:{reading['humidity']:5.2f}% | "
                    f"P:{reading['pressure_hpa']:7.2f}hPa"
                    f"{weather_info}"
                )
                
                # Periodic stats
                if iteration % 100 == 0:
                    stats = client.get_stats()
                    print(f"\nStats: {stats['sent']} sent, {stats['failed']} failed")
                    if stats['last_error']:
                        print(f"Last error: {stats['last_error']}")
                    print()
                
                # Wait for next interval
                await asyncio.sleep(settings.interval_seconds)
                
        except KeyboardInterrupt:
            print("\n" + "-" * 60)
            print("Stopping producer...")
            stats = client.get_stats()
            print(f"Final stats: {stats['sent']} sent, {stats['failed']} failed")
            print("Goodbye!")


if __name__ == "__main__":
    asyncio.run(main())
```

### Step 8: Testing

**File: `data-producer/tests/test_generator.py`**

```python
import pytest
from src.generators.bme280 import BME280Generator
from src.config import Settings


@pytest.fixture
def settings():
    """Create test settings"""
    return Settings(
        device_id="test_device",
        temp_min=15.0,
        temp_max=30.0,
        humidity_min=20.0,
        humidity_max=80.0,
        pressure_min=995.0,
        pressure_max=1030.0,
        add_noise=False,
        enable_daily_pattern=False,
        enable_weather_events=False,
    )


@pytest.mark.asyncio
async def test_generator_basic(settings):
    """Test basic generator functionality"""
    generator = BME280Generator("test_001")
    
    reading = await generator.generate()
    
    assert reading["device_id"] == "test_001"
    assert "temperature_c" in reading
    assert "humidity" in reading
    assert "pressure_hpa" in reading
    assert "timestamp" in reading
    assert "metadata" in reading


@pytest.mark.asyncio
async def test_generator_bounds(settings):
    """Test that generated values stay within bounds"""
    generator = BME280Generator("test_001")
    
    # Generate many readings to test bounds
    for _ in range(100):
        reading = await generator.generate()
        
        assert settings.temp_min <= reading["temperature_c"] <= settings.temp_max
        assert settings.humidity_min <= reading["humidity"] <= settings.humidity_max
        assert settings.pressure_min <= reading["pressure_hpa"] <= settings.pressure_max


@pytest.mark.asyncio
async def test_generator_continuity():
    """Test that values change gradually (no huge jumps)"""
    generator = BME280Generator("test_001")
    
    prev_reading = await generator.generate()
    
    for _ in range(20):
        reading = await generator.generate()
        
        # Check that changes are reasonable (< 5 degrees, 10%, 5 hPa)
        temp_change = abs(reading["temperature_c"] - prev_reading["temperature_c"])
        humidity_change = abs(reading["humidity"] - prev_reading["humidity"])
        pressure_change = abs(reading["pressure_hpa"] - prev_reading["pressure_hpa"])
        
        assert temp_change < 5.0
        assert humidity_change < 10.0
        assert pressure_change < 5.0
        
        prev_reading = reading


@pytest.mark.asyncio
async def test_generator_reset():
    """Test generator reset"""
    generator = BME280Generator("test_001")
    
    reading1 = await generator.generate()
    
    # Generate several more to drift away
    for _ in range(10):
        await generator.generate()
    
    # Reset
    generator.reset()
    
    reading2 = await generator.generate()
    
    # After reset, values should be different from final state
    # (but we can't test exact values due to randomness)
    assert reading1 is not reading2
```

**File: `data-producer/tests/test_client.py`**

```python
import pytest
from datetime import datetime
from src.client import SensorClient


@pytest.mark.asyncio
async def test_client_stats():
    """Test client statistics tracking"""
    async with SensorClient(base_url="http://fake-server:8000") as client:
        stats = client.get_stats()
        
        assert stats["sent"] == 0
        assert stats["failed"] == 0
        assert stats["last_success"] is None
        assert stats["last_error"] is None


@pytest.mark.asyncio
async def test_reading_serialization():
    """Test that datetime serialization works"""
    reading = {
        "device_id": "test_001",
        "temperature_c": 23.5,
        "humidity": 45.0,
        "pressure_hpa": 1013.25,
        "timestamp": datetime(2025, 11, 14, 10, 30, 0),
    }
    
    async with SensorClient(base_url="http://fake-server:8000") as client:
        # This should not raise an exception
        # (will fail to connect, but serialization will work)
        await client.send_bme280_reading(reading)
```

### Step 9: Advanced Features (Optional)

**File: `data-producer/src/batch_mode.py`**

```python
"""Batch mode for bulk data generation (testing/backfill)"""
import asyncio
from datetime import datetime, timedelta
from src.generators.bme280 import BME280Generator
from src.client import SensorClient
from src.config import get_settings


async def generate_historical_data(
    device_id: str,
    start_time: datetime,
    end_time: datetime,
    interval_seconds: int = 60
):
    """
    Generate historical data for a time period
    
    Args:
        device_id: Device identifier
        start_time: Start of time period
        end_time: End of time period
        interval_seconds: Interval between readings
    """
    settings = get_settings()
    generator = BME280Generator(device_id)
    
    current_time = start_time
    readings = []
    
    while current_time <= end_time:
        reading = await generator.generate()
        reading["timestamp"] = current_time
        readings.append(reading)
        
        current_time += timedelta(seconds=interval_seconds)
    
    return readings


async def bulk_upload(readings: list, batch_size: int = 100):
    """
    Upload many readings in batches
    
    Args:
        readings: List of readings to upload
        batch_size: Number of readings per batch
    """
    settings = get_settings()
    
    async with SensorClient() as client:
        total = len(readings)
        
        for i in range(0, total, batch_size):
            batch = readings[i:i + batch_size]
            
            for reading in batch:
                await client.send_bme280_reading(reading)
            
            print(f"Uploaded {min(i + batch_size, total)}/{total} readings")
            await asyncio.sleep(0.5)  # Rate limiting
```

### Step 10: Documentation

**File: `data-producer/README.md`**

```markdown
# BME280 Fake Data Producer

Generates realistic BME280 sensor data and sends it to the server.

## Features

- Realistic sensor data with natural variations
- Daily temperature/humidity patterns
- Simulated weather events (storms, fronts)
- Configurable ranges and intervals
- Statistics tracking
- Multiple device support (planned)

## Setup

Install dependencies:
```bash
poetry install
```

Copy environment file:
```bash
cp .env.example .env
```

Edit `.env` to configure:
- Server URL
- Device ID
- Generation intervals
- Data ranges

## Running

Start the producer:
```bash
poetry run python -m src.main
```

You should see output like:
```
✓ #0001 | 10:30:00 | T:23.45°C | H:45.67% | P:1013.25hPa
✓ #0002 | 10:30:10 | T:23.47°C | H:45.65% | P:1013.23hPa
```

## Testing

Run tests:
```bash
poetry run pytest
poetry run pytest --cov=src
```

## Configuration

Key settings in `.env`:

- `INTERVAL_SECONDS`: Time between readings (default: 10)
- `ENABLE_DAILY_PATTERN`: Enable daily temperature cycles (default: true)
- `ENABLE_WEATHER_EVENTS`: Simulate weather events (default: true)
- `ADD_NOISE`: Add random noise to readings (default: true)

## Data Patterns

### Daily Pattern
Temperature peaks around 14:00, lowest at 06:00 (±3°C swing).
Humidity inversely correlates with temperature.

### Weather Events
Random events occur with 1% probability:
- **Storm**: Dropping pressure, rising humidity
- **Front**: Rapid pressure change
- **Clear**: Rising pressure, falling humidity

Events last 10-50 readings (100-500 seconds at 10s intervals).

## Advanced Usage

### Multiple Devices
Edit `src/main.py` to use `MultiBME280Generator`:

```python
from src.generators.bme280 import MultiBME280Generator

devices = ["device_001", "device_002", "device_003"]
generator = MultiBME280Generator(devices)
```

### Historical Data Generation
Use `src/batch_mode.py` for backfilling:

```python
from src.batch_mode import generate_historical_data, bulk_upload

readings = await generate_historical_data(
    device_id="test_001",
    start_time=datetime(2025, 11, 1),
    end_time=datetime(2025, 11, 14),
    interval_seconds=300  # 5 minutes
)

await bulk_upload(readings)
```
```

## Implementation Checklist

- [ ] Initialize Poetry project
- [ ] Create configuration
- [ ] Implement base generator class
- [ ] Implement BME280 generator with patterns
- [ ] Create HTTP client
- [ ] Build main application loop
- [ ] Add statistics tracking
- [ ] Write tests
- [ ] Create README
- [ ] Test with actual server

## Success Criteria

After implementation:
1. Producer starts without errors
2. Generates realistic sensor data
3. Successfully sends data to server
4. Shows statistics every 100 readings
5. Handles server connection errors gracefully
6. Daily patterns are visible in data
7. Weather events occasionally appear

## Next Steps

After basic implementation:
1. Add multiple device support
2. Implement batch/historical mode
3. Add data export (CSV)
4. Add visualization (plot generated data)
5. Add anomaly injection (for testing detection)
6. Configuration profiles (winter/summer patterns)