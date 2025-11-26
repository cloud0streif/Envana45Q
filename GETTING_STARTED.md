# Getting Started

## Quick Start (Easiest)

Use Docker Compose to start all services:
```bash
docker-compose up --build
```

This starts:
- **Backend API**: http://localhost:8000
- **Frontend Dashboard**: http://localhost:5173
- **TimescaleDB**: localhost:5432

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

### 2. Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## What You Should See

### Frontend Interface

1. **Navigation**: Home, Capture, Transport, Sequestration sections
2. **Dashboard Views**: Various monitoring dashboards for CCS operations
3. **Real-time Charts**: Visualizations for sensor data and metrics
4. **Interactive Maps**: Transport network and facility locations

### Testing the System

1. Navigate through the different dashboard sections
2. Explore the capture facilities, transport pipelines, and injection sites
3. View mock sensor data and metrics
4. Test data processing features

## Configuration

### Backend (.env)
```bash
DATABASE_URL=postgresql+asyncpg://ccs_user:ccs_password@localhost:5432/ccs_platform
PORT=8000
DEBUG=true
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
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
# Use gunicorn or uvicorn for production deployment
```

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/
```

## Deployment

For production deployment instructions, see:
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Comprehensive deployment guide
- [API.md](docs/API.md) - API reference

## Troubleshooting

### Backend won't start
- Check if Python 3.11+ is installed: `python3 --version`
- Check if port 8000 is available: `lsof -i :8000`
- Verify database connection in .env file

### Frontend shows errors
- Verify backend is running at http://localhost:8000/api/v1/health
- Check browser console for CORS errors
- Ensure VITE_API_BASE_URL is correctly set

### Database issues
- Ensure TimescaleDB container is running: `docker ps`
- Check database logs: `docker logs envana45q-timescaledb`
- Verify connection string in backend/.env

## Next Steps

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Read the docs**:
   - [API Documentation](docs/API.md)
   - [Architecture](docs/ARCHITECTURE.md)
   - [Frontend Guide](docs/frontend.md)
3. **Customize**:
   - Add new dashboard views
   - Customize visualizations
   - Implement authentication
