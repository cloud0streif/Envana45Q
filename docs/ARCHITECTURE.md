# System Architecture

## Overview

The BME280 Data Collection System is a modular, three-tier architecture designed for scalability and extensibility.

```
┌─────────────────┐
│   Data Producer │
│  (Fake Sensor)  │
└────────┬────────┘
         │ HTTP POST
         │
┌────────▼─────────┐
│     Backend      │
│   (FastAPI)      │
│                  │
│  ┌───────────┐   │
│  │  SQLite   │   │
│  │ Database  │   │
│  └───────────┘   │
└────────┬─────────┘
         │ REST API
         │
┌────────▼─────────┐
│    Frontend      │
│  (React + TS)    │
└──────────────────┘
```

## Components

### 1. Backend (FastAPI)

**Responsibilities:**
- Accept sensor data via HTTP endpoints
- Store raw data in SQLite database
- Process data using pluggable algorithms
- Provide REST API for queries

**Technology Stack:**
- FastAPI (async web framework)
- SQLAlchemy 2.0 (async ORM)
- aiosqlite (async SQLite driver)
- Pydantic (data validation)

**Key Modules:**
- `models/`: Database models (SQLAlchemy)
- `schemas/`: API schemas (Pydantic)
- `routers/`: API endpoint handlers
- `services/`: Business logic
- `processors/`: Data processing algorithms

### 2. Data Producer

**Responsibilities:**
- Generate realistic fake BME280 sensor data
- Send data to backend at configurable intervals
- Handle connection failures gracefully

**Technology Stack:**
- Python 3.11+
- httpx (async HTTP client)

**Features:**
- Realistic gradual value changes
- Configurable data ranges
- Auto-retry on failures

### 3. Frontend (React)

**Responsibilities:**
- Display real-time sensor data
- Visualize trends with charts
- Trigger data processing
- Show processed results

**Technology Stack:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (data visualization)
- React Query (server state)

## Data Flow

### Ingestion Flow
```
Data Producer → POST /api/v1/sensors/bme280 → Backend → SQLite
```

1. Data producer generates sensor reading
2. Sends HTTP POST to backend
3. Backend validates with Pydantic schema
4. Stores in `sensor_readings` table
5. Returns 201 Created

### Query Flow
```
Frontend → GET /api/v1/data/raw → Backend → SQLite → JSON Response
```

1. Frontend requests data (with filters)
2. Backend queries SQLite
3. Converts models to Pydantic schemas
4. Returns JSON response

### Processing Flow
```
Frontend → POST /api/v1/processing/run → Backend → Process → Store → Response
```

1. Frontend triggers processing job
2. Backend queries raw data from time range
3. Runs selected processor algorithm
4. Stores result in `processed_data` table
5. Returns processing results

## Database Schema

### sensor_readings
```sql
CREATE TABLE sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor_type VARCHAR(50) NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    timestamp DATETIME NOT NULL,
    temperature_c REAL,
    humidity REAL,
    pressure_hpa REAL,
    metadata JSON,
    created_at DATETIME NOT NULL
);
```

### processed_data
```sql
CREATE TABLE processed_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    processor_name VARCHAR(100) NOT NULL,
    processor_version VARCHAR(20) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    device_id VARCHAR(100),
    result JSON NOT NULL,
    raw_count INTEGER NOT NULL,
    created_at DATETIME NOT NULL
);
```

## Processor System

Processors are pluggable algorithms that process raw sensor data.

### Base Architecture
```python
class BaseProcessor(ABC):
    @abstractmethod
    async def process(self, readings, start_time, end_time, ...):
        pass
```

### Built-in Processors

**Average Processor**
- Calculates mean of temperature, humidity, and pressure
- Groups by device or aggregates across all devices
- Returns count of readings processed

## API Design Principles

1. **RESTful**: Standard HTTP methods (GET, POST)
2. **Versioned**: All endpoints under `/api/v1/`
3. **Async**: All I/O operations are asynchronous
4. **Validated**: Pydantic schemas for all inputs/outputs
5. **Documented**: Auto-generated OpenAPI/Swagger docs

## Scalability Considerations

### Current Architecture (SQLite)
- Good for: Single server, moderate load
- Limitations: No horizontal scaling, limited concurrent writes

### Future Improvements
1. **Database**: Migrate to PostgreSQL or TimescaleDB
2. **Processing**: Move to async task queue (Celery, RQ)
3. **Caching**: Add Redis for frequently accessed data
4. **WebSockets**: Real-time updates instead of polling
5. **Load Balancing**: Multiple backend instances

## Security Considerations

### Current State
- No authentication (development only)
- CORS enabled for localhost

### Production Requirements
1. **Authentication**: JWT tokens or API keys
2. **HTTPS**: TLS/SSL for all traffic
3. **Rate Limiting**: Prevent abuse
4. **Input Validation**: Already implemented (Pydantic)
5. **SQL Injection**: Protected by ORM

## Monitoring & Observability

### Current
- Health check endpoint: `/api/v1/health`
- Basic error responses

### Future Additions
1. **Logging**: Structured logging (JSON)
2. **Metrics**: Prometheus metrics
3. **Tracing**: OpenTelemetry
4. **Alerts**: Database size, error rates
