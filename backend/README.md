# BME280 Backend Server

FastAPI-based backend for sensor data collection and processing.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi[all] sqlalchemy[asyncio] aiosqlite pydantic-settings python-dotenv apscheduler
uvicorn src.main:app --reload --port 8000
```

For development dependencies:
```bash
pip install pytest pytest-asyncio httpx ruff mypy
```

## Configuration

Copy `.env.example` to `.env` and adjust settings:
```bash
cp .env.example .env
```

## API Documentation

When running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
pytest
ruff check .
mypy .
```

## Database

SQLite database will be created automatically on first run.
Location: `./sensor_data.db`
