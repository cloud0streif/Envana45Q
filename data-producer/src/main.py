"""Main entry point for data producer."""

import asyncio
import signal
import sys
from datetime import datetime

from .client import SensorClient
from .config import settings
from .generators.bme280 import BME280Generator
from .generators.bme280_real import RealBME280Generator


class DataProducer:
    """Main data producer application."""

    def __init__(self):
        """Initialize data producer."""
        self.running = True
        self.client = SensorClient(settings.server_url)

        # Choose generator based on configuration
        if settings.use_real_sensor:
            print("Initializing REAL BME280 sensor...")
            self.generator = RealBME280Generator(
                device_id=settings.device_id,
                i2c_address=settings.i2c_address,
                i2c_port=settings.i2c_port,
            )
            self.sensor_mode = "Real BME280 Sensor"
        else:
            print("Initializing FAKE BME280 data generator...")
            self.generator = BME280Generator(
                device_id=settings.device_id,
                temp_min=settings.temp_min,
                temp_max=settings.temp_max,
                humidity_min=settings.humidity_min,
                humidity_max=settings.humidity_max,
                pressure_min=settings.pressure_min,
                pressure_max=settings.pressure_max,
            )
            self.sensor_mode = "Fake Data Generator"

    def handle_shutdown(self, signum, frame):
        """Handle shutdown signals gracefully."""
        print("\n\nShutdown signal received. Stopping data producer...")
        self.running = False

    async def run(self):
        """Run the data producer."""
        # Setup signal handlers
        signal.signal(signal.SIGINT, self.handle_shutdown)
        signal.signal(signal.SIGTERM, self.handle_shutdown)

        print("=" * 80)
        print("BME280 Data Producer Started")
        print("=" * 80)
        print(f"Sensor Mode:     {self.sensor_mode}")
        print(f"Device ID:       {settings.device_id}")
        print(f"Server URL:      {settings.server_url}")
        print(f"Interval:        {settings.interval_seconds} seconds")

        if settings.use_real_sensor:
            print(f"I2C Address:     {hex(settings.i2c_address)}")
            print(f"I2C Port:        {settings.i2c_port}")
        else:
            print(f"Temperature:     {settings.temp_min}°C - {settings.temp_max}°C")
            print(f"Humidity:        {settings.humidity_min}% - {settings.humidity_max}%")
            print(f"Pressure:        {settings.pressure_min} hPa - {settings.pressure_max} hPa")

        print("=" * 80)
        print("Press Ctrl+C to stop")
        print()

        # Check server health
        print("Checking server health...")
        if await self.client.check_health():
            print("✓ Server is healthy\n")
        else:
            print("✗ Server health check failed. Will continue anyway...\n")

        reading_count = 0

        try:
            while self.running:
                # Generate reading
                reading = self.generator.generate()
                reading_count += 1

                # Send to server
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                print(f"[{timestamp}] Reading #{reading_count}")
                print(f"  Temperature: {reading['temperature_c']}°C")
                print(f"  Humidity:    {reading['humidity']}%")
                print(f"  Pressure:    {reading['pressure_hpa']} hPa")

                success = await self.client.send_bme280_reading(reading)

                if success:
                    print("  Status:      ✓ Sent successfully")
                else:
                    print("  Status:      ✗ Failed to send")

                print()

                # Wait for next interval
                await asyncio.sleep(settings.interval_seconds)

        except KeyboardInterrupt:
            pass
        finally:
            print(f"\nTotal readings sent: {reading_count}")
            print("Closing connection...")
            await self.client.close()
            print("Data producer stopped.")


async def main():
    """Main async entry point."""
    producer = DataProducer()
    await producer.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)
