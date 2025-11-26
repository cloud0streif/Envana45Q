"""API route handlers."""

from .processing import router as processing_router
from .query import router as query_router
from .sensors import router as sensors_router

__all__ = ["sensors_router", "processing_router", "query_router"]
