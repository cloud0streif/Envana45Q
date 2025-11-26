# CCS Platform Redesign Progress

## Branch: envana-45q

This document tracks the progress of redesigning the IOT_Test project into a comprehensive CCS (Carbon Capture and Storage) Operations Tracking Platform.

---

## ✅ Completed Tasks

### 1. Technology Stack Finalized
- **Backend**: FastAPI (Python 3.11+) with PostgreSQL + TimescaleDB
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Database**: PostgreSQL 15+ with TimescaleDB extension for time-series data
- **MQTT**: Eclipse Mosquitto for real-time sensor data streaming
- **Auth**: JWT tokens with role-based access control
- **Storage**: Local filesystem for documents

### 2. Docker Infrastructure Setup
Created comprehensive Docker Compose configuration with:
- **TimescaleDB**: PostgreSQL with TimescaleDB extension for time-series sensor data
- **Mosquitto**: MQTT broker for real-time IoT data streaming (ports 1883 and 9001)
- **Backend**: FastAPI application with all necessary environment variables
- **Data Producer**: BME280 sensor data generator (real or mock)
- **Frontend**: React application with Vite dev server

**Files Created:**
- `docker-compose.yml` - Full stack orchestration
- `mosquitto/config/mosquitto.conf` - MQTT broker configuration

### 3. Database Schema Designed
Comprehensive PostgreSQL schema with TimescaleDB for time-series data:

**Core Tables:**
- `users` - User authentication and role management
- `wells` - CO2 injection and monitoring wells
- `sensor_data` - TimescaleDB hypertable for IoT sensor data
- `capture_facilities` - CO2 capture facilities and operational data
- `transport_assets` - Transportation infrastructure (pipelines, vehicles)
- `pipelines` - Pipeline-specific details
- `vehicle_fleet` - Vehicle fleet management
- `documents` - Document management system
- `injection_operations` - Daily injection operations tracking
- `monitoring_reports` - Monitoring well reports
- `alerts` - System alerts and notifications
- `project_metrics` - Dashboard metrics and KPIs

**Views Created:**
- `v_active_injectors` - Active injector wells with latest data
- `v_active_monitors` - Active monitoring wells
- `v_system_overview` - System-wide overview for dashboard

**Seed Data:**
- 2 default users (admin, operator)
- 4 sample wells (2 injectors, 2 monitoring)
- 2 capture facilities (Amine and Membrane systems)
- 2 pipelines with complete specifications
- Vehicle fleet data (trucks and rail)
- Initial project metrics

**Files Created:**
- `database/init/01_init_schema.sql` - Complete database initialization

### 4. Backend Dependencies Updated
Updated `pyproject.toml` with new dependencies:
- `asyncpg` - PostgreSQL async driver (replaces aiosqlite)
- `paho-mqtt` - MQTT client for IoT integration
- `python-jose` - JWT token generation and validation
- `passlib[bcrypt]` - Password hashing
- `python-multipart` - File upload support
- `aiofiles` - Async file operations

---

## 🚧 Next Steps (In Priority Order)

### Phase 1: Backend Foundation
1. **Update backend configuration** (`src/config.py`) for new environment variables
2. **Create database models** for all tables using SQLAlchemy
3. **Implement authentication system** (login, JWT, user management)
4. **Create base CRUD utilities** for common database operations

### Phase 2: API Endpoints
5. **Wells API** - CRUD operations for injection and monitoring wells
6. **Capture Facilities API** - Manage capture facilities and performance data
7. **Transport Assets API** - Pipelines and vehicle fleet management
8. **Documents API** - Upload, download, and manage documents
9. **IoT Data API** - Sensor data ingestion and querying
10. **Dashboard API** - Project metrics and system overview

### Phase 3: Real-time Data Integration
11. **MQTT Integration** - Connect sensor data to MQTT broker
12. **Update data producer** - Support MQTT publishing and well associations
13. **WebSocket support** - Real-time data streaming to frontend

### Phase 4: Frontend Development
14. **React Router setup** - Multi-page navigation structure
15. **Modal overlay system** - Reusable modal components
16. **Home page** - Project overview dashboard
17. **Sequestration page** - Injection and monitoring operations
18. **Capture page** - Facilities and performance tracking
19. **Transport page** - Pipeline and vehicle management
20. **IoT Dashboard** - Real-time sensor monitoring (integrate existing BME280 charts)
21. **Document manager** - Upload and browse documents
22. **Authentication UI** - Login/logout functionality

### Phase 5: Testing & Documentation
23. **End-to-end testing** - Sensor → MQTT → Database → API → Frontend
24. **Update README** - New architecture documentation
25. **Deployment guide** - Docker-based deployment instructions

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Home │ Capture │ Transport │ Sequestration │ IoT     │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP REST API
                         │ WebSocket (real-time)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                          │
│  ┌────────────┬──────────────┬───────────────┬────────────┐ │
│  │   Wells    │   Capture    │   Transport   │  Documents │ │
│  │    API     │     API      │      API      │     API    │ │
│  ├────────────┴──────────────┴───────────────┴────────────┤ │
│  │               Authentication (JWT)                      │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │           MQTT Client  │  Scheduler (APScheduler)      │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────┬──────────────────────────────┬────────────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────┐      ┌──────────────────────────────┐
│  PostgreSQL +       │      │    Mosquitto MQTT Broker     │
│  TimescaleDB        │      │                              │
│                     │      │  Port 1883 (MQTT)            │
│  - Operational Data │      │  Port 9001 (WebSocket)       │
│  - Time-series Data │      │                              │
└─────────────────────┘      └──────────┬───────────────────┘
                                        │
                                        ▼
                           ┌─────────────────────────────┐
                           │   IoT Devices               │
                           │   - Raspberry Pi + BME280   │
                           │   - Mock Sensors            │
                           └─────────────────────────────┘
```

---

## Key Features (From Architecture Document)

### User Interface
- **Home Page**: Project overview dashboard with key metrics
- **CO2 Capture**: Facility management and performance monitoring
- **CO2 Transport**: Pipeline and vehicle fleet tracking
- **CO2 Sequestration**: Injection and monitoring well operations
- **IoT Dashboards**: Real-time sensor data visualization
- **Document Management**: Upload and organize regulatory documents

### Modal Navigation System
- Operations are accessed via modal overlays for better UX
- Each modal leads to detailed IoT dashboards
- Clean navigation flow: Page → Modal → Dashboard

### Real-time Capabilities
- MQTT-based sensor data streaming
- WebSocket updates for live dashboards
- Automated rolling average calculations
- Alert system for anomalies

### Data Management
- Time-series optimization with TimescaleDB
- Document storage with metadata tracking
- Hierarchical data organization (Wells, Facilities, Assets)
- Comprehensive audit trails

---

## How to Continue Development

### Start the Infrastructure
```bash
cd /home/ondrej/IOT_Test
docker-compose up -d timescaledb mosquitto
```

### Install Backend Dependencies
```bash
cd backend
poetry install
```

### Start Backend Development Server
```bash
cd backend
poetry run uvicorn src.main:app --reload --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

---

## Configuration Notes

### Environment Variables (Backend)
- `DATABASE_URL`: PostgreSQL connection string
- `MQTT_BROKER_HOST`: Mosquitto broker hostname
- `JWT_SECRET_KEY`: Secret for JWT token signing (CHANGE IN PRODUCTION!)
- `UPLOAD_DIR`: Directory for document uploads

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123` (⚠️ CHANGE IN PRODUCTION!)

---

## Migration from Old System

### What We're Keeping
✅ BME280 sensor integration
✅ Raspberry Pi data producer
✅ FastAPI backend framework
✅ React + TypeScript frontend
✅ Tailwind CSS styling
✅ Recharts for visualization
✅ APScheduler for background jobs

### What We're Upgrading
🔄 SQLite → PostgreSQL + TimescaleDB
🔄 Simple API → Comprehensive CCS platform
🔄 Single page → Multi-page application
🔄 Basic auth → JWT + Role-based access

### What We're Adding
🆕 MQTT real-time data streaming
🆕 Document management system
🆕 Multi-well operations tracking
🆕 Capture facilities management
🆕 Transport asset tracking
🆕 Modal overlay navigation
🆕 Alert and notification system
🆕 Project-wide dashboards

---

## Questions or Issues?

Refer to:
- `ccs_platform_architecture.md` - Complete architecture specification
- `docker-compose.yml` - Infrastructure setup
- `database/init/01_init_schema.sql` - Database structure
- Original BME280 code in `backend/src/` and `data-producer/src/`

---

**Last Updated**: 2025-11-19
**Branch**: envana-45q
**Status**: Infrastructure complete, ready for backend development
