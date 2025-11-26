#!/bin/bash
################################################################################
# Raspberry Pi BME280 Sensor Setup Script
#
# This script automates the setup of BME280 sensor on Raspberry Pi
# and prepares it to send data to your IoT backend.
#
# Run this script on your Raspberry Pi after SSH connection:
#   bash raspberry-pi-setup.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_header() {
    echo ""
    echo "=============================================================================="
    echo "  $1"
    echo "=============================================================================="
    echo ""
}

################################################################################
# Step 1: System Update
################################################################################

print_header "Step 1: Updating System Packages"

print_info "Updating package lists..."
sudo apt update

print_info "Upgrading installed packages..."
sudo apt upgrade -y

print_success "System packages updated"

################################################################################
# Step 2: Enable I2C Interface
################################################################################

print_header "Step 2: Enabling I2C Interface"

# Enable I2C using raspi-config non-interactive mode
print_info "Enabling I2C interface..."
sudo raspi-config nonint do_i2c 0

# Load I2C kernel module
print_info "Loading I2C kernel module..."
sudo modprobe i2c-dev

# Add I2C to modules to load on boot
if ! grep -q "i2c-dev" /etc/modules; then
    echo "i2c-dev" | sudo tee -a /etc/modules > /dev/null
    print_info "Added i2c-dev to /etc/modules"
fi

print_success "I2C interface enabled"

################################################################################
# Step 3: Install Required Packages
################################################################################

print_header "Step 3: Installing Required Packages"

print_info "Installing Python3, pip, and I2C tools..."
sudo apt install -y python3-pip python3-dev python3-venv i2c-tools git

print_success "Required packages installed"

################################################################################
# Step 4: Detect BME280 Sensor
################################################################################

print_header "Step 4: Detecting BME280 Sensor"

print_info "Scanning I2C bus for BME280 sensor..."
print_warning "Make sure your BME280 sensor is properly connected:"
echo "  VCC -> 3.3V (Pin 1)"
echo "  GND -> Ground (Pin 6)"
echo "  SCL -> GPIO 3 (Pin 5)"
echo "  SDA -> GPIO 2 (Pin 3)"
echo ""

if command -v i2cdetect &> /dev/null; then
    echo "I2C Device Scan:"
    sudo i2cdetect -y 1
    echo ""

    # Check for BME280 at common addresses
    if sudo i2cdetect -y 1 | grep -q "76\|77"; then
        print_success "BME280 sensor detected!"

        if sudo i2cdetect -y 1 | grep -q "76"; then
            BME280_ADDRESS="0x76"
            print_info "Sensor found at address 0x76"
        elif sudo i2cdetect -y 1 | grep -q "77"; then
            BME280_ADDRESS="0x77"
            print_info "Sensor found at address 0x77"
        fi
    else
        print_error "BME280 sensor NOT detected at 0x76 or 0x77"
        print_warning "Please check your wiring and try again"
        exit 1
    fi
else
    print_warning "i2cdetect command not found, skipping sensor detection"
    BME280_ADDRESS="0x76"  # Default
fi

################################################################################
# Step 5: Install Python Dependencies
################################################################################

print_header "Step 5: Installing Python Dependencies"

print_info "Installing BME280 libraries (smbus2, bme280)..."
pip3 install --user smbus2 bme280

print_info "Installing data producer dependencies..."
pip3 install --user httpx pydantic pydantic-settings python-dateutil

print_success "Python dependencies installed"

################################################################################
# Step 6: Test BME280 Sensor
################################################################################

print_header "Step 6: Testing BME280 Sensor"

print_info "Creating test script..."

cat > /tmp/test_bme280.py << 'EOF'
#!/usr/bin/env python3
"""Quick BME280 sensor test."""

import smbus2
import bme280

# Try common I2C addresses
addresses = [0x76, 0x77]
port = 1

for address in addresses:
    try:
        bus = smbus2.SMBus(port)
        calibration_params = bme280.load_calibration_params(bus, address)
        data = bme280.sample(bus, address, calibration_params)

        print(f"\n✓ BME280 sensor working at address {hex(address)}!")
        print(f"  Temperature: {data.temperature:.2f} °C")
        print(f"  Pressure:    {data.pressure:.2f} hPa")
        print(f"  Humidity:    {data.humidity:.2f} %")

        exit(0)
    except Exception as e:
        continue

print("\n✗ Failed to read from BME280 sensor")
print("  Check wiring and I2C configuration")
exit(1)
EOF

chmod +x /tmp/test_bme280.py

print_info "Running sensor test..."
if python3 /tmp/test_bme280.py; then
    print_success "BME280 sensor is working correctly!"
else
    print_error "BME280 sensor test failed"
    exit 1
fi

################################################################################
# Step 7: Configuration Summary
################################################################################

print_header "Setup Complete!"

print_success "Raspberry Pi BME280 sensor setup completed successfully!"
echo ""
echo "Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Clone your IoT project:"
echo "   cd ~"
echo "   git clone <your-repository-url> IOT_Test"
echo "   cd IOT_Test/data-producer"
echo ""
echo "2. Create .env configuration file:"
echo "   cat > .env << EOF"
echo "   USE_REAL_SENSOR=true"
echo "   DEVICE_ID=raspberrypi-$(hostname)"
echo "   SERVER_URL=http://YOUR_BACKEND_IP:8000"
echo "   INTERVAL_SECONDS=10"
echo "   I2C_ADDRESS=${BME280_ADDRESS:-0x76}"
echo "   I2C_PORT=1"
echo "   EOF"
echo ""
echo "3. Test the data producer:"
echo "   cd ~/IOT_Test/data-producer"
echo "   python3 -m src.main"
echo ""
echo "4. (Optional) Set up as systemd service for auto-start"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Sensor Details:"
echo "  I2C Address: ${BME280_ADDRESS:-0x76}"
echo "  I2C Port:    1"
echo ""

print_info "Setup script completed"
