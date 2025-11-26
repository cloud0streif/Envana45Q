#!/bin/bash
################################################################################
# Deploy Data Producer to Raspberry Pi
#
# Usage: ./deploy-to-pi.sh RASPBERRY_PI_IP
# Example: ./deploy-to-pi.sh 192.168.1.100
################################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}Error: Raspberry Pi IP address required${NC}"
    echo "Usage: $0 RASPBERRY_PI_IP"
    echo "Example: $0 192.168.1.100"
    exit 1
fi

RPI_IP=$1
RPI_USER=${2:-pi}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Deploy Data Producer to Raspberry Pi${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Target: $RPI_USER@$RPI_IP"
echo ""

# Check if package exists
if [ ! -f "data-producer-rpi.tar.gz" ]; then
    echo -e "${RED}Error: data-producer-rpi.tar.gz not found${NC}"
    echo "Please run this script from /home/ondrej/IOT_Test directory"
    exit 1
fi

# Test SSH connection
echo -e "${BLUE}[1/4]${NC} Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes $RPI_USER@$RPI_IP "echo 'SSH OK'" 2>/dev/null; then
    echo -e "${YELLOW}SSH key authentication failed, will prompt for password${NC}"
fi

# Transfer package
echo -e "${BLUE}[2/4]${NC} Transferring data producer package..."
scp data-producer-rpi.tar.gz $RPI_USER@$RPI_IP:~/
echo -e "${GREEN}✓${NC} Package transferred"

# Extract and setup
echo -e "${BLUE}[3/4]${NC} Extracting and setting up on Raspberry Pi..."
ssh $RPI_USER@$RPI_IP << 'ENDSSH'
# Extract package
tar -xzf data-producer-rpi.tar.gz
echo "✓ Package extracted"

# Check if dependencies are installed
if ! python3 -c "import smbus2, bme280, httpx" 2>/dev/null; then
    echo "Installing Python dependencies..."
    pip3 install --user smbus2 bme280 httpx pydantic pydantic-settings python-dateutil
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

# Check I2C
if command -v i2cdetect &> /dev/null; then
    echo ""
    echo "Scanning for BME280 sensor..."
    sudo i2cdetect -y 1 2>/dev/null | grep -E "76|77" && echo "✓ BME280 sensor detected" || echo "⚠ BME280 sensor not found"
fi
ENDSSH

echo -e "${GREEN}✓${NC} Setup complete on Raspberry Pi"

# Get backend IP suggestion
echo ""
echo -e "${BLUE}[4/4]${NC} Configuration needed..."
echo ""
echo "Next steps on Raspberry Pi:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. SSH into Raspberry Pi:"
echo "   ${GREEN}ssh $RPI_USER@$RPI_IP${NC}"
echo ""
echo "2. Create .env configuration:"
echo "   ${GREEN}cd ~/data-producer${NC}"
echo "   ${GREEN}nano .env${NC}"
echo ""
echo "   Add this content:"
echo "   ┌─────────────────────────────────────────────────┐"
echo "   │ USE_REAL_SENSOR=true                            │"
echo "   │ I2C_ADDRESS=0x76                                │"
echo "   │ I2C_PORT=1                                      │"
echo "   │ DEVICE_ID=raspberrypi-3b-plus                   │"
echo "   │ SERVER_URL=http://YOUR_BACKEND_IP:8000          │"
echo "   │ INTERVAL_SECONDS=10                             │"
echo "   └─────────────────────────────────────────────────┘"
echo ""
echo "   Replace YOUR_BACKEND_IP with your Windows machine's IP"
echo "   (Find it in Windows: ipconfig in PowerShell)"
echo ""
echo "3. Test the data producer:"
echo "   ${GREEN}python3 -m src.main${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Deployment complete!${NC}"
