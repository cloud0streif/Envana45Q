# BME280 Data Collection System - Bootstrap Plan

## Project Overview

A modular sensor data collection system designed to:
- Accept sensor data via HTTP endpoints (starting with BME280)
- Store raw data in SQLite database
- Process data using pluggable algorithms
- Provide a web interface for monitoring and control

## Technology Stack

### Backend
- **Language**: Python 3.11+
- **Web Framework**: FastAPI (async, high performance, auto-docs)
- **Database**: SQLite with async support (aiosqlite)
- **ORM**: SQLAlchemy 2.0 (async mode)
- **Validation**: Pydantic v2
- **Task Queue**: APScheduler for processing triggers

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Recharts for data visualization
- **State Management**: React Query for server state

### Development Tools
- **Package Management**: Poetry (Python), npm (JavaScript)
- **Testing**: pytest (backend), Vitest (frontend)
- **Code Quality**: ruff (Python linting/formatting), ESLint + Prettier (JS)
- **Type Checking**: mypy (Python), TypeScript (JS)

## Project Structure

```
bme280-data-system/
├── README.md
├── .gitignore
├── docker-compose.yml          # Optional: for full system deployment
│
├── backend/
│   ├── pyproject.toml          # Poetry dependencies
│   ├── README.md
│   ├── .env.example
│   ├── src/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application entry
│   │   ├── config.py           # Configuration management
│   │   ├── database.py         # Database setup and session management
│   │   │
│   │   ├── models/             # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── sensor_data.py
│   │   │   └── processed_data.py
│   │   │
│   │   ├── schemas/            # Pydantic models for API
│   │   │   ├── __init__.py
│   │   │   ├── sensor.py
│   │   │   └── processing.py
│   │   │
│   │   ├── routers/            # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── sensors.py      # Sensor data ingestion
│   │   │   ├── processing.py   # Data processing triggers
│   │   │   └── query.py        # Data query endpoints
│   │   │
│   │   ├── services/           # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── data_ingestion.py
│   │   │   └── data_processing.py
│   │   │
│   │   └── processors/         # Algorithm implementations
│   │       ├── __init__.py
│   │       ├── base.py         # Abstract base processor
│   │       └── average.py      # Simple averaging algorithm
│   │
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py
│       ├── test_api.py
│       └── test_processors.py
│
├── data-producer/
│   ├── pyproject.toml
│   ├── README.md
│   ├── .env.example
│   ├── src/
│   │   ├── __init__.py
│   │   ├── main.py             # Entry point
│   │   ├── config.py
│   │   ├── generators/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   └── bme280.py       # BME280 fake data generator
│   │   └── client.py           # HTTP client to send data
│   └── tests/
│       └── test_generator.py
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   ├── .env.example
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   │   └── client.ts       # API client configuration
│   │   ├── components/
│   │   │   ├── RawDataView.tsx
│   │   │   ├── ProcessingControl.tsx
│   │   │   ├── ProcessedDataView.tsx
│   │   │   └── Chart.tsx
│   │   ├── hooks/
│   │   │   └── useQuery.ts
│   │   └── types/
│   │       └── sensor.ts
│   └── tests/
│       └── App.test.tsx
│
└── docs/
    ├── API.md                  # API documentation
    ├── ARCHITECTURE.md         # System architecture
    └── DEPLOYMENT.md           # Deployment guide
```

## Database Schema

### Raw Sensor Data Table
```sql
CREATE TABLE sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor_type VARCHAR(50) NOT NULL,      -- 'bme280', future: 'bme680', etc.
    device_id VARCHAR(100) NOT NULL,        -- Unique device identifier
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temperature_c REAL,
    humidity REAL,
    pressure_hpa REAL,
    metadata JSON,                          -- Flexible field for additional data
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_device_id (device_id),
    INDEX idx_timestamp (timestamp)
);
```

### Processed Data Table
```sql
CREATE TABLE processed_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    processor_name VARCHAR(100) NOT NULL,   -- 'average', 'min_max', etc.
    processor_version VARCHAR(20) NOT NULL, -- Algorithm versioning
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    device_id VARCHAR(100),                 -- NULL for aggregate across devices
    result JSON NOT NULL,                   -- Flexible results storage
    raw_count INTEGER NOT NULL,             -- Number of raw readings processed
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_processor (processor_name),
    INDEX idx_time_range (start_time, end_time),
    INDEX idx_sensor_type (sensor_type)
);
```

### Processing Jobs Table (Optional for async processing)
```sql
CREATE TABLE processing_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    processor_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,            -- 'pending', 'running', 'completed', 'failed'
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    sensor_type VARCHAR(50),
    device_id VARCHAR(100),
    error_message TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
```

## API Endpoints

### Sensor Data Ingestion
```
POST /api/v1/sensors/bme280
    Body: {
        "device_id": "bme280_001",
        "temperature_c": 23.45,
        "humidity": 45.67,
        "pressure_hpa": 1013.25,
        "timestamp": "2025-11-14T10:30:00Z"  // Optional, defaults to server time
    }
    Response: 201 Created
```

### Raw Data Queries
```
GET /api/v1/data/raw?sensor_type=bme280&start=2025-11-14T00:00:00Z&end=2025-11-14T23:59:59Z
    Response: {
        "count": 100,
        "data": [...]
    }

GET /api/v1/data/raw/{device_id}?start=...&end=...
    Response: { "count": 50, "data": [...] }
```

### Data Processing
```
POST /api/v1/processing/run
    Body: {
        "processor": "average",
        "start_time": "2025-11-14T00:00:00Z",
        "end_time": "2025-11-14T23:59:59Z",
        "sensor_type": "bme280",
        "device_id": null  // Optional, null for all devices
    }
    Response: {
        "job_id": "uuid",
        "status": "completed",
        "result": {...}
    }
```

### Processed Data Queries
```
GET /api/v1/data/processed?processor=average&start=...&end=...
    Response: {
        "count": 24,
        "data": [...]
    }
```

### System Status
```
GET /api/v1/health
    Response: { "status": "healthy", "database": "connected" }

GET /api/v1/processors
    Response: {
        "processors": [
            {
                "name": "average",
                "version": "1.0.0",
                "description": "Calculate average of sensor readings"
            }
        ]
    }
```

## Bootstrap Sequence

### Phase 1: Project Initialization
1. Create root directory structure
2. Initialize git repository
3. Create .gitignore for Python and Node.js
4. Create root README.md with project overview

### Phase 2: Backend Setup
1. Initialize Poetry project in `backend/`
2. Add dependencies:
   - fastapi[all]
   - sqlalchemy[asyncio]
   - aiosqlite
   - pydantic-settings
   - python-dotenv
   - apscheduler
3. Create database models and migrations
4. Implement core API endpoints
5. Add basic tests

### Phase 3: Data Producer Setup
1. Initialize Poetry project in `data-producer/`
2. Add dependencies:
   - httpx (async HTTP client)
   - pydantic-settings
3. Implement fake BME280 data generator
4. Create HTTP client for sending data
5. Add configuration for server URL and intervals

### Phase 4: Frontend Setup
1. Initialize Vite + React + TypeScript project
2. Add dependencies:
   - react-query
   - axios
   - recharts
   - tailwindcss
3. Create basic layout and components
4. Implement API client
5. Add data visualization

### Phase 5: Integration
1. Test end-to-end data flow
2. Add docker-compose for easy deployment
3. Write documentation
4. Create example .env files

## Configuration

### Backend (.env)
```bash
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Database
DATABASE_URL=sqlite+aiosqlite:///./sensor_data.db

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Processing
DEFAULT_PROCESSING_INTERVAL=3600  # seconds
```

### Data Producer (.env)
```bash
# Server
SERVER_URL=http://localhost:8000

# Generator
DEVICE_ID=bme280_fake_001
INTERVAL_SECONDS=10

# Data ranges (for realistic fake data)
TEMP_MIN=18.0
TEMP_MAX=28.0
HUMIDITY_MIN=30.0
HUMIDITY_MAX=70.0
PRESSURE_MIN=1000.0
PRESSURE_MAX=1025.0
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Development Workflow

### Running Locally

**Backend:**
```bash
cd backend
poetry install
poetry run uvicorn src.main:app --reload --port 8000
```

**Data Producer:**
```bash
cd data-producer
poetry install
poetry run python -m src.main
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Testing

**Backend:**
```bash
cd backend
poetry run pytest
poetry run ruff check .
poetry run mypy .
```

**Frontend:**
```bash
cd frontend
npm run test
npm run lint
npm run type-check
```

## Next Steps After Bootstrap

1. **Add more processors**: Implement min/max, moving average, anomaly detection
2. **Real sensor integration**: Replace fake data producer with actual BME280 code
3. **Authentication**: Add API key or JWT authentication
4. **Monitoring**: Add logging, metrics, and alerting
5. **Deployment**: Containerize and deploy to cloud platform
6. **Advanced features**:
   - WebSocket for real-time updates
   - Historical data export
   - Alert thresholds and notifications
   - Multi-device management dashboard

## Success Criteria

After bootstrap, you should be able to:
1. Start the backend server and see OpenAPI docs at http://localhost:8000/docs
2. Start the data producer and see data being sent every 10 seconds
3. Query raw data via API and see generated readings
4. Open the frontend at http://localhost:5173
5. View raw data in a table/chart
6. Trigger processing via the UI
7. View processed results (averages) in the UI

## Common Pitfalls to Avoid

1. **Database locking**: Use WAL mode for SQLite to allow concurrent reads
2. **Time zones**: Always store timestamps in UTC
3. **Type validation**: Use Pydantic models for all API inputs/outputs
4. **Error handling**: Implement proper error responses with meaningful messages
5. **CORS issues**: Configure CORS properly for local development
6. **Async consistency**: Don't mix sync and async database operations

## Resources

- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLAlchemy 2.0: https://docs.sqlalchemy.org/en/20/
- React Query: https://tanstack.com/query/latest
- Recharts: https://recharts.org/

---

This plan provides a solid foundation for Claude Code to build a professional, extensible sensor data collection system.