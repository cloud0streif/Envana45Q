"""Sensor reading database model."""

from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, Float, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from ..database import Base


class SensorReading(Base):
    """Raw sensor reading data."""

    __tablename__ = "sensor_readings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sensor_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    device_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=func.now(), index=True
    )
    temperature_c: Mapped[float | None] = mapped_column(Float, nullable=True)
    humidity: Mapped[float | None] = mapped_column(Float, nullable=True)
    pressure_hpa: Mapped[float | None] = mapped_column(Float, nullable=True)
    extra_metadata: Mapped[dict[str, Any] | None] = mapped_column("metadata", JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now())

    __table_args__ = (
        Index("idx_sensor_device", "sensor_type", "device_id"),
        Index("idx_timestamp_range", "timestamp"),
    )

    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<SensorReading(id={self.id}, sensor_type={self.sensor_type}, "
            f"device_id={self.device_id}, timestamp={self.timestamp})>"
        )
