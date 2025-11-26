"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import init_db
from .routers import processing_router, query_router, sensors_router
from .services.scheduler import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan handler.

    Initializes database and scheduler on startup.
    Cleans up scheduler on shutdown.
    """
    # Startup: Initialize database
    await init_db()

    # Startup: Start background scheduler
    start_scheduler()

    yield

    # Shutdown: Stop scheduler
    stop_scheduler()


# Create FastAPI application
app = FastAPI(
    title="BME280 Data Collection System",
    description="API for collecting and processing BME280 sensor data",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sensors_router)
app.include_router(query_router)
app.include_router(processing_router)


@app.get("/api/v1/health")
async def health_check() -> dict[str, str]:
    """
    Health check endpoint.

    Returns the system status.
    """
    return {"status": "healthy", "database": "connected"}


@app.get("/")
async def root() -> dict[str, str]:
    """
    Root endpoint.

    Provides basic API information.
    """
    return {
        "message": "BME280 Data Collection System API",
        "docs": "/docs",
        "health": "/api/v1/health",
    }
