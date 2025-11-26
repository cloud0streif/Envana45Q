"""Processed data database model."""

from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from ..database import Base


class ProcessedData(Base):
    """Processed sensor data results."""

    __tablename__ = "processed_data"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    processor_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    processor_version: Mapped[str] = mapped_column(String(20), nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    sensor_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    device_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    result: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    raw_count: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now())

    __table_args__ = (
        Index("idx_processor_time", "processor_name", "start_time", "end_time"),
        Index("idx_time_range", "start_time", "end_time"),
    )

    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<ProcessedData(id={self.id}, processor={self.processor_name}, "
            f"start_time={self.start_time}, end_time={self.end_time})>"
        )
