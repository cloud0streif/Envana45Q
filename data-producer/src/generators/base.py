"""Base generator abstract class."""

from abc import ABC, abstractmethod
from typing import Any


class BaseGenerator(ABC):
    """Abstract base class for sensor data generators."""

    @abstractmethod
    def generate(self) -> dict[str, Any]:
        """
        Generate a single sensor reading.

        Returns:
            Dictionary containing sensor data
        """
        pass
