# Raspberry Pi BME280 Sensor - Deployment Guide

Your Raspberry Pi (MAC: `b8:27:eb:3e:f4:cb`) is ready for BME280 sensor setup!

## Quick Start Checklist

- [ ] SSH access to Raspberry Pi working
- [ ] BME280 sensor physically connected
- [ ] Know your backend server IP address
- [ ] Backend server is running and accessible

---

## Step 1: Transfer Setup Script to Raspberry Pi

From your development machine (WSL/Linux), transfer the setup script:

```bash
# Get your Raspberry Pi's IP address first
# Then transfer the setup script (replace RASPBERRY_PI_IP with actual IP)

scp /home/ondrej/IOT_Test/raspberry-pi-setup.sh pi@RASPBERRY_PI_IP:~/

# Example:
# scp /home/ondrej/IOT_Test/raspberry-pi-setup.sh pi@192.168.1.100:~/
```

---

## Step 2: Connect BME280 Sensor

Before running the setup script, connect your BME280 sensor to the Raspberry Pi GPIO pins:

### Microsoft IoT Pack BME280 Wiring

| BME280 Pin | Wire Color* | Raspberry Pi Pin | Pin Number |
|------------|-------------|------------------|------------|
| VCC/VIN    | Red         | 3.3V             | Pin 1      |
| GND        | Black       | Ground           | Pin 6      |
| SCL        | Yellow      | GPIO 3 (SCL)     | Pin 5      |
| SDA        | Blue        | GPIO 2 (SDA)     | Pin 3      |

*Wire colors may vary depending on your module

### Raspberry Pi GPIO Pinout Reference

```
┌─────────┬──────┬──────┬─────────┐
│   3.3V  │  1   │  2   │   5V    │  ← VCC here (Pin 1)
│   SDA   │  3   │  4   │   5V    │  ← SDA here (Pin 3)
│   SCL   │  5   │  6   │   GND   │  ← SCL (Pin 5), GND (Pin 6)
│  GPIO4  │  7   │  8   │  GPIO14 │
│   GND   │  9   │ 10   │  GPIO15 │
│ GPIO17  │ 11   │ 12   │  GPIO18 │
│ ...     │ ...  │ ...  │  ...    │
└─────────┴──────┴──────┴─────────┘
```

**Important:**
- Use **3.3V** NOT 5V (Pin 1 or 17, NOT Pin 2 or 4)
- Double-check connections before powering on
- BME280 can be damaged by 5V!

---

## Step 3: Run Setup Script on Raspberry Pi

SSH into your Raspberry Pi and run the setup script:

```bash
# SSH into Raspberry Pi
ssh pi@RASPBERRY_PI_IP

# Make setup script executable
chmod +x ~/raspberry-pi-setup.sh

# Run setup script
bash ~/raspberry-pi-setup.sh
```

### What the Setup Script Does:

1. ✅ Updates system packages
2. ✅ Enables I2C interface
3. ✅ Installs Python dependencies (smbus2, bme280, httpx, etc.)
4. ✅ Detects BME280 sensor on I2C bus
5. ✅ Tests sensor readings
6. ✅ Displays next steps

The script will automatically detect your BME280 sensor at address `0x76` or `0x77`.

---

## Step 4: Deploy Data Producer Code

### Option A: Transfer from Development Machine

From your development machine:

```bash
# Create a tarball of the data-producer (excluding venv, cache, etc.)
cd /home/ondrej/IOT_Test
tar -czf data-producer.tar.gz \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='venv' \
    --exclude='.env' \
    data-producer/

# Transfer to Raspberry Pi
scp data-producer.tar.gz pi@RASPBERRY_PI_IP:~/

# SSH into Raspberry Pi and extract
ssh pi@RASPBERRY_PI_IP
tar -xzf data-producer.tar.gz
cd data-producer
```

### Option B: Clone from Git Repository

```bash
# SSH into Raspberry Pi
ssh pi@RASPBERRY_PI_IP

# Clone repository (if pushed to Git)
cd ~
git clone <your-repository-url> IOT_Test
cd IOT_Test/data-producer
```

---

## Step 5: Configure Data Producer

Create the `.env` configuration file on the Raspberry Pi:

```bash
cd ~/data-producer  # or ~/IOT_Test/data-producer

# Create .env file
cat > .env << 'EOF'
# Sensor Configuration
USE_REAL_SENSOR=true
I2C_ADDRESS=0x76
I2C_PORT=1

# Device Identification
DEVICE_ID=raspberrypi-3b-plus

# Server Connection
# Replace with your actual backend server IP
SERVER_URL=http://YOUR_BACKEND_IP:8000

# Data Collection Interval (seconds)
INTERVAL_SECONDS=10
EOF

# Edit the file to set your backend IP
nano .env
```

**Important:** Replace `YOUR_BACKEND_IP` with your actual backend server IP address!

### Find Your Backend Server IP

If your backend is running on your development machine:

```bash
# On your WSL/development machine, find the IP that Raspberry Pi can reach
# This might be your Windows machine's IP on the local network

# Windows: Open PowerShell/CMD and run:
ipconfig

# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.50
```

Then update the `.env` file:
```bash
SERVER_URL=http://192.168.1.50:8000
```

---

## Step 6: Test Data Producer

Run the data producer to test the connection:

```bash
cd ~/data-producer  # or ~/IOT_Test/data-producer

# Run data producer
python3 -m src.main
```

### Expected Output:

```
Initializing REAL BME280 sensor...
✓ BME280 sensor initialized at I2C address 0x76
================================================================================
BME280 Data Producer Started
================================================================================
Sensor Mode:     Real BME280 Sensor
Device ID:       raspberrypi-3b-plus
Server URL:      http://192.168.1.50:8000
Interval:        10 seconds
I2C Address:     0x76
I2C Port:        1
================================================================================
Press Ctrl+C to stop

Checking server health...
✓ Server is healthy

[2025-11-18 12:34:56] Reading #1
  Temperature: 22.45°C
  Humidity:    48.32%
  Pressure:    1013.25 hPa
  Status:      ✓ Sent successfully
```

If you see real sensor readings being sent successfully, congratulations! 🎉

### Troubleshooting

**Problem:** `Server health check failed`
- Ensure backend server is running
- Check `SERVER_URL` in `.env` is correct
- Verify firewall allows port 8000
- Test connection: `curl http://YOUR_BACKEND_IP:8000/api/v1/health`

**Problem:** `Failed to initialize BME280 sensor`
- Check wiring connections
- Run `sudo i2cdetect -y 1` to verify sensor is detected
- Try alternate address (change `I2C_ADDRESS=0x77` in `.env`)
- Ensure I2C is enabled: `sudo raspi-config`

**Problem:** `ImportError: No module named 'smbus2'`
- Install dependencies: `pip3 install --user smbus2 bme280 httpx`

---

## Step 7: Set Up Auto-Start Service (Optional but Recommended)

To automatically start the data producer on boot:

```bash
# Create systemd service file
sudo nano /etc/systemd/system/iot-producer.service
```

Paste this content:

```ini
[Unit]
Description=IoT BME280 Data Producer
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/data-producer
Environment="PATH=/home/pi/.local/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/python3 -m src.main
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**If using Git clone method**, change `WorkingDirectory` to:
```ini
WorkingDirectory=/home/pi/IOT_Test/data-producer
```

Save and exit (Ctrl+X, Y, Enter).

### Enable and Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable iot-producer

# Start service now
sudo systemctl start iot-producer

# Check status
sudo systemctl status iot-producer
```

### Useful Service Commands

```bash
# View live logs
sudo journalctl -u iot-producer -f

# Stop service
sudo systemctl stop iot-producer

# Restart service (after code changes)
sudo systemctl restart iot-producer

# Disable auto-start
sudo systemctl disable iot-producer

# View recent logs
sudo journalctl -u iot-producer -n 50
```

---

## Step 8: Verify Data on Frontend

1. Open your frontend dashboard: `http://localhost:5173`
2. You should see real sensor data appearing in the charts
3. Watch for the 1-hour rolling averages to start appearing (after scheduler runs)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Raspberry Pi 3B+                        │
│  ┌──────────────┐                                           │
│  │ BME280       │                                           │
│  │ Sensor       │                                           │
│  │  I2C 0x76    │                                           │
│  └───────┬──────┘                                           │
│          │                                                   │
│  ┌───────▼──────────────┐                                   │
│  │ Data Producer        │                                   │
│  │ (Python)             │                                   │
│  │ - Read sensor        │                                   │
│  │ - Send via HTTP      │                                   │
│  └───────┬──────────────┘                                   │
└──────────┼──────────────────────────────────────────────────┘
           │ HTTP POST
           │ /api/v1/sensors/bme280
           ▼
┌──────────────────────────────────────────────────────────────┐
│              Backend Server (FastAPI)                        │
│  ┌────────────────┐    ┌──────────────┐                     │
│  │ REST API       │───▶│  Database    │                     │
│  │                │    │  (SQLite)    │                     │
│  └────────────────┘    └──────────────┘                     │
│  ┌────────────────┐           │                             │
│  │ Scheduler      │───────────┘                             │
│  │ (APScheduler)  │                                         │
│  │ - Rolling Avg  │                                         │
│  │   every 1 min  │                                         │
│  └────────────────┘                                         │
└───────────────┬──────────────────────────────────────────────┘
                │ HTTP GET
                │ /api/v1/data/raw
                ▼
┌──────────────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                         │
│  ┌──────────────────────────────────────────┐               │
│  │ Real-time Charts                         │               │
│  │ - Raw sensor data (thin line)            │               │
│  │ - 1hr rolling average (thick dashed)     │               │
│  │ - Updates every 10 seconds               │               │
│  └──────────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────────┘
```

---

## Maintenance and Monitoring

### Check Data Producer Logs

```bash
# Real-time logs
sudo journalctl -u iot-producer -f

# Last 100 lines
sudo journalctl -u iot-producer -n 100

# Logs from today
sudo journalctl -u iot-producer --since today

# Logs with errors only
sudo journalctl -u iot-producer -p err
```

### Update Code on Raspberry Pi

```bash
# Stop service
sudo systemctl stop iot-producer

# Update code (if using Git)
cd ~/IOT_Test
git pull

# Or transfer new version
# scp data-producer.tar.gz pi@RASPBERRY_PI_IP:~/

# Restart service
sudo systemctl restart iot-producer

# Check status
sudo systemctl status iot-producer
```

### Monitor System Resources

```bash
# CPU temperature
vcgencmd measure_temp

# Memory usage
free -h

# Disk usage
df -h

# System info
htop  # Install with: sudo apt install htop
```

---

## Next Steps

1. ✅ Monitor real sensor data in frontend
2. ✅ Verify rolling averages are being calculated every minute
3. 🔄 Consider adding more Raspberry Pi sensors to your network
4. 🔄 Set up proper logging and monitoring
5. 🔄 Configure alerts for sensor failures
6. 🔄 Set up remote backup of sensor data

---

## Support and Troubleshooting

### Common Issues

1. **Sensor readings are all zeros or None**
   - Check wiring, especially VCC to 3.3V not 5V
   - Verify I2C address with `sudo i2cdetect -y 1`

2. **Connection refused to backend**
   - Ensure backend is running
   - Check firewall settings
   - Verify `SERVER_URL` is correct

3. **Service fails to start**
   - Check logs: `sudo journalctl -u iot-producer -n 50`
   - Verify `.env` file exists
   - Check Python dependencies installed

4. **High CPU/Memory usage**
   - Check `INTERVAL_SECONDS` - don't set too low
   - Monitor with `htop`
   - Consider reducing log verbosity

---

## Security Considerations

- Change default Pi password: `passwd`
- Keep system updated: `sudo apt update && sudo apt upgrade`
- Configure SSH key authentication (disable password auth)
- Set up firewall if Pi is exposed to internet
- Use HTTPS for production deployments

---

## Congratulations! 🎉

Your Raspberry Pi is now a fully functional IoT sensor node sending real BME280 data to your cloud-ready data collection system with real-time visualization and rolling average analytics!
