"""Real BME280 sensor data generator for Raspberry Pi."""

from datetime import datetime, timezone
from typing import Any

try:
    import smbus2
    import bme280

    BME280_AVAILABLE = True
except ImportError:
    BME280_AVAILABLE = False
    print("Warning: smbus2 and BME280 libraries not available. Install with: pip3 install smbus2 RPi.bme280")

from .base import BaseGenerator


class RealBME280Generator(BaseGenerator):
    """Generate real sensor data from BME280 via I2C.

    This generator reads real data from a BME280 sensor connected via I2C.
    Requires smbus2 and bme280 Python libraries.

    Hardware Connection (I2C):
    - VCC -> 3.3V (Pin 1)
    - GND -> Ground (Pin 6)
    - SCL -> GPIO 3 (Pin 5)
    - SDA -> GPIO 2 (Pin 3)
    """

    sensor_type = "bme280"

    def __init__(self, device_id: str, i2c_address: int = 0x76, i2c_port: int = 1):
        """
        Initialize BME280 sensor connection.

        Args:
            device_id: Unique identifier for this device
            i2c_address: I2C address of BME280 (0x76 or 0x77)
            i2c_port: I2C port number (usually 1 on Raspberry Pi)
        """
        self.device_id = device_id

        if not BME280_AVAILABLE:
            raise ImportError(
                "BME280 libraries not installed. Run: pip3 install smbus2 RPi.bme280"
            )

        self.port = i2c_port
        self.address = i2c_address

        try:
            self.bus = smbus2.SMBus(self.port)
            # Load calibration parameters
            self.calibration_params = bme280.load_calibration_params(self.bus, self.address)
            print(f"✓ BME280 sensor initialized at I2C address {hex(self.address)}")
        except Exception as e:
            raise RuntimeError(
                f"Failed to initialize BME280 sensor at address {hex(self.address)}: {e}\n"
                f"Check:\n"
                f"  1. Sensor is properly connected\n"
                f"  2. I2C is enabled (sudo raspi-config -> Interface Options -> I2C)\n"
                f"  3. Run 'sudo i2cdetect -y 1' to verify sensor is detected"
            ) from e

    def generate(self) -> dict[str, Any]:
        """
        Read real sensor data from BME280.

        Returns:
            Dictionary with sensor readings including temperature, humidity, and pressure
        """
        try:
            # Read sensor data
            data = bme280.sample(self.bus, self.address, self.calibration_params)

            return {
                "sensor_type": self.sensor_type,
                "device_id": self.device_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "temperature_c": round(data.temperature, 2),
                "humidity": round(data.humidity, 2),
                "pressure_hpa": round(data.pressure, 2),
                "metadata": {
                    "source": "real_bme280",
                    "i2c_address": hex(self.address),
                    "i2c_port": self.port,
                },
            }
        except Exception as e:
            # Return error in metadata if reading fails
            return {
                "sensor_type": self.sensor_type,
                "device_id": self.device_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "temperature_c": None,
                "humidity": None,
                "pressure_hpa": None,
                "metadata": {
                    "source": "real_bme280",
                    "error": str(e),
                    "i2c_address": hex(self.address),
                },
            }
