# BME280 Data Producer

Fake BME280 sensor data generator that sends realistic sensor readings to the backend API.

## Features

- Generates realistic temperature, humidity, and pressure values
- Configurable intervals and data ranges
- Sends data via HTTP POST to backend API
- Automatic retry on connection failures

## Setup

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install httpx pydantic-settings python-dotenv
python -m src.main
```

For development dependencies:
```bash
pip install pytest pytest-asyncio ruff
```

## Configuration

Copy `.env.example` to `.env` and adjust settings:
```bash
cp .env.example .env
```

Configuration options:
- `SERVER_URL`: Backend API URL (default: http://localhost:8000)
- `DEVICE_ID`: Unique device identifier
- `INTERVAL_SECONDS`: Time between readings (default: 10)
- `TEMP_MIN`, `TEMP_MAX`: Temperature range in Celsius
- `HUMIDITY_MIN`, `HUMIDITY_MAX`: Humidity range (0-100%)
- `PRESSURE_MIN`, `PRESSURE_MAX`: Pressure range in hPa

## Running

Start the data producer:
```bash
source venv/bin/activate  # If not already activated
python -m src.main
```

The producer will continuously generate and send sensor readings at the configured interval.
Press Ctrl+C to stop.
