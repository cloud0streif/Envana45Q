# Raspberry Pi 3B+ Setup Guide for BME280 Sensor

## Step 1: Find Your Raspberry Pi on the Network

### Option A: Router Method (Easiest)
1. Access your router's admin interface:
   - Common addresses: `192.168.1.1`, `192.168.0.1`, `192.168.100.1`, `10.0.0.1`
   - Default credentials are usually on a sticker on your router
2. Navigate to "Connected Devices", "DHCP Clients", or similar
3. Look for:
   - Device name: `raspberrypi`
   - Manufacturer: `Raspberry Pi Foundation` or `Raspberry Pi Trading`
   - MAC address starting with: `B8:27:EB`, `DC:A6:32`, or `E4:5F:01`

### Option B: Network Scan
From a Windows PowerShell or Command Prompt:

```powershell
# Find your computer's IP address
ipconfig

# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.100

# Install nmap (download from https://nmap.org/download.html)
# Or use built-in arp command:
arp -a

# With nmap installed (adjust network range):
nmap -sn 192.168.1.0/24
```

### Option C: Hostname (if mDNS is working)
```bash
# Try the default hostname
ping raspberrypi.local

# If you set a custom hostname during imaging, use that instead
ping your-custom-hostname.local
```

### Common Raspberry Pi MAC Address Prefixes
- `B8:27:EB:xx:xx:xx` (older models)
- `DC:A6:32:xx:xx:xx` (newer models)
- `E4:5F:01:xx:xx:xx` (Raspberry Pi 4 and newer)

---

## Step 2: Enable SSH Access (if not already enabled)

### If you enabled SSH during imaging:
You're all set! SSH should be enabled.

### If SSH is not working:
You'll need physical access to enable it:
1. Remove the SD card from the Pi
2. Insert it into your computer
3. In the boot partition, create an empty file named `ssh` (no extension)
4. Reinsert the SD card and boot the Pi

### Default SSH Credentials
- **Username**: `pi` (or the username you set during imaging)
- **Password**: The password you set during imaging
- **Default port**: 22

### Connect via SSH
```bash
# Replace with your Pi's actual IP address
ssh pi@192.168.1.XXX

# Or using hostname
ssh pi@raspberrypi.local
```

---

## Step 3: Initial Raspberry Pi Configuration

Once connected via SSH:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Run configuration tool
sudo raspi-config
```

### Important Configuration Options:
1. **Interface Options** → **I2C** → Enable (required for BME280)
2. **Interface Options** → **SSH** → Enable (if not already)
3. **Localisation Options** → Set timezone, keyboard, etc.
4. **System Options** → Set hostname (optional)

---

## Step 4: Install BME280 Sensor

### Hardware Connection (Microsoft IoT Pack BME280)

The BME280 sensor connects via I2C. Typical pinout:

| BME280 Pin | Raspberry Pi Pin | Pin Number |
|------------|------------------|------------|
| VCC/VIN    | 3.3V             | Pin 1      |
| GND        | Ground           | Pin 6      |
| SCL        | GPIO 3 (SCL)     | Pin 5      |
| SDA        | GPIO 2 (SDA)     | Pin 3      |

**Raspberry Pi 3B+ Pin Reference:**
```
     3.3V [ 1] [ 2] 5V
SDA/GPIO2 [ 3] [ 4] 5V
SCL/GPIO3 [ 5] [ 6] GND
    GPIO4 [ 7] [ 8] GPIO14
      GND [ 9] [10] GPIO15
   GPIO17 [11] [12] GPIO18
   ...
```

### Install Required Software

```bash
# Install I2C tools
sudo apt install -y python3-pip python3-dev i2c-tools

# Enable I2C kernel module
sudo raspi-config nonint do_i2c 0

# Verify I2C is enabled
lsmod | grep i2c

# Install BME280 Python library
pip3 install smbus2 bme280

# OR use Adafruit's library (alternative)
pip3 install adafruit-circuitpython-bme280
```

### Test BME280 Connection

```bash
# Detect I2C devices (BME280 should appear at 0x76 or 0x77)
sudo i2cdetect -y 1

# Expected output:
#      0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
# 00:          -- -- -- -- -- -- -- -- -- -- -- -- --
# 10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 70: -- -- -- -- -- -- 76 --    <--- BME280 detected!
```

---

## Step 5: Test BME280 Sensor with Python

Create a test script:

```python
# test_bme280.py
import smbus2
import bme280

port = 1
address = 0x76  # or 0x77, depending on your sensor

bus = smbus2.SMBus(port)
calibration_params = bme280.load_calibration_params(bus, address)

# Read sensor data
data = bme280.sample(bus, address, calibration_params)

print(f"Temperature: {data.temperature:.2f} °C")
print(f"Pressure: {data.pressure:.2f} hPa")
print(f"Humidity: {data.humidity:.2f} %")
```

Run the test:
```bash
python3 test_bme280.py
```

---

## Step 6: Integrate with Your IoT Data Collection System

### Install Dependencies on Raspberry Pi

```bash
# Install Python dependencies
pip3 install httpx asyncio python-dateutil

# Install Git to clone your project
sudo apt install git -y
```

### Clone Your Project

```bash
cd ~
git clone <your-repository-url>
cd IOT_Test/data-producer
```

### Modify Data Producer for Real BME280

You'll need to replace the fake data generator with real BME280 readings.

Create a new generator: `data-producer/src/generators/bme280_real.py`

```python
"""Real BME280 sensor data generator for Raspberry Pi."""

import smbus2
import bme280
from datetime import datetime, timezone
from typing import Any

from .base import BaseGenerator


class RealBME280Generator(BaseGenerator):
    """Generate real sensor data from BME280 via I2C."""

    sensor_type = "bme280"

    def __init__(self, device_id: str):
        super().__init__(device_id)
        self.port = 1
        self.address = 0x76  # Change to 0x77 if needed
        self.bus = smbus2.SMBus(self.port)
        self.calibration_params = bme280.load_calibration_params(
            self.bus, self.address
        )

    def generate(self) -> dict[str, Any]:
        """Read real sensor data from BME280."""
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
            },
        }
```

### Configure Data Producer

Edit `data-producer/.env`:
```bash
SERVER_URL=http://YOUR_BACKEND_IP:8000  # Change to your backend server
DEVICE_ID=raspberrypi-3b-plus
INTERVAL_SECONDS=10
```

### Run Data Producer on Raspberry Pi

```bash
cd ~/IOT_Test/data-producer
python3 -m src.main
```

---

## Step 7: Set Up Data Producer as System Service (Optional)

To run the data producer automatically on boot:

```bash
# Create systemd service file
sudo nano /etc/systemd/system/iot-producer.service
```

Add this content:
```ini
[Unit]
Description=IoT BME280 Data Producer
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/IOT_Test/data-producer
Environment="PATH=/home/pi/.local/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/python3 -m src.main
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable iot-producer

# Start service now
sudo systemctl start iot-producer

# Check status
sudo systemctl status iot-producer

# View logs
sudo journalctl -u iot-producer -f
```

---

## Troubleshooting

### BME280 Not Detected
- Check wiring connections
- Verify I2C is enabled: `sudo raspi-config` → Interface Options → I2C
- Try the alternate I2C address (0x76 vs 0x77)
- Reboot: `sudo reboot`

### Cannot SSH to Raspberry Pi
- Ensure SSH was enabled during imaging
- Check if Pi is on the same network
- Try hostname: `ssh pi@raspberrypi.local`
- Check firewall settings

### Data Producer Connection Issues
- Verify backend server IP is correct
- Ensure backend is running and accessible
- Check network connectivity: `ping YOUR_BACKEND_IP`
- Verify firewall allows port 8000

---

## Next Steps

1. Find your Raspberry Pi's IP address
2. SSH into the Pi
3. Enable I2C interface
4. Connect and test the BME280 sensor
5. Install dependencies and clone your project
6. Modify data producer to use real sensor
7. Configure and run the data producer

Your IoT system will then have:
- **Real BME280 sensor** on Raspberry Pi sending data
- **Backend API** processing and storing the data
- **Frontend dashboard** displaying real-time sensor readings and rolling averages

Good luck with your setup! 🎉
