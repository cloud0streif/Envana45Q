"""Data processing algorithms."""

from .average import AverageProcessor
from .base import BaseProcessor
from .rolling_average import RollingAverageProcessor

# Registry of available processors
PROCESSORS: dict[str, type[BaseProcessor]] = {
    "average": AverageProcessor,
    "rolling_average": RollingAverageProcessor,
}

__all__ = ["BaseProcessor", "AverageProcessor", "RollingAverageProcessor", "PROCESSORS"]
