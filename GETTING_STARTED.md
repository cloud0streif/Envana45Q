# Getting Started

## Quick Start (Easiest)

Run the automated setup script:
```bash
./start.sh
```

This will check prerequisites and set up all components. Then follow the on-screen instructions to start each service.

## Manual Setup

### 1. Start the Backend (Terminal 1)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi[all] sqlalchemy[asyncio] aiosqlite pydantic-settings python-dotenv apscheduler
uvicorn src.main:app --reload --port 8000
```

Verify at: http://localhost:8000/docs

### 2. Start the Data Producer (Terminal 2)

```bash
cd data-producer
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install httpx pydantic-settings python-dotenv
python -m src.main
```

You should see sensor readings being generated and sent every 10 seconds.

### 3. Start the Frontend (Terminal 3)

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## What You Should See

### Frontend Interface

1. **Status Bar**: Shows backend connection status
2. **Sensor Trends Chart**: Real-time line charts for temperature, humidity, and pressure
3. **Processing Control**: Panel to run data processing algorithms
4. **Raw Sensor Data**: Table of recent sensor readings (auto-refreshes every 10s)
5. **Processed Results**: Shows results from processing jobs

### Testing the System

1. **Wait 30 seconds** for data to accumulate
2. In the "Data Processing" panel:
   - Select "average" processor
   - Set time range to "1 hour"
   - Click "Run Processing"
3. View the results in the "Processed Results" section
4. Watch the charts update in real-time

## Using Docker (Alternative)

If you have Docker installed:

```bash
docker-compose up --build
```

This starts all three services automatically:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## Troubleshooting

### Backend won't start
- Check if Python 3.11+ is installed: `python3 --version`
- Check if port 8000 is available: `lsof -i :8000`

### Data producer can't connect
- Make sure backend is running first
- Check backend logs for errors

### Frontend shows "Disconnected"
- Verify backend is running at http://localhost:8000/api/v1/health
- Check browser console for CORS errors

### No data showing
- Wait 10-30 seconds for data to accumulate
- Check data producer is running and sending data
- Check backend logs for errors

## Next Steps

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Read the docs**:
   - [API Documentation](docs/API.md)
   - [Architecture](docs/ARCHITECTURE.md)
   - [Deployment Guide](docs/DEPLOYMENT.md)
3. **Add features**:
   - Implement new processors (min/max, moving average)
   - Add authentication
   - Connect real BME280 sensor

## Configuration

### Backend (.env)
```bash
DATABASE_URL=sqlite+aiosqlite:///./sensor_data.db
PORT=8000
CORS_ORIGINS=http://localhost:5173
```

### Data Producer (.env)
```bash
SERVER_URL=http://localhost:8000
DEVICE_ID=bme280_fake_001
INTERVAL_SECONDS=10
TEMP_MIN=18.0
TEMP_MAX=28.0
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Development Workflow

### Running Tests

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install pytest pytest-asyncio ruff mypy
pytest
ruff check .
mypy .
```

**Frontend:**
```bash
cd frontend
npm run test
npm run lint
npm run type-check
```

### Building for Production

**Backend:**
```bash
cd backend
# Backend runs from source, no build needed
```

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/
```

## Support

- Check [bootstrap.md](docs/bootstrap.md) for detailed architecture
- Check [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production setup
- Check [API.md](docs/API.md) for API reference
