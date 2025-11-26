#!/bin/bash

# BME280 Data Collection System - Quick Start Script

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     BME280 Data Collection System - Quick Start             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✓ Python $PYTHON_VERSION found"

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✓ Node.js $NODE_VERSION found"

if ! command_exists npm; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm $(npm --version) found"
echo ""

# Setup backend
echo "Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "Installing backend dependencies..."
python3 -m venv venv
source venv/bin/activate
pip install fastapi[all] sqlalchemy[asyncio] aiosqlite pydantic-settings python-dotenv apscheduler
deactivate

cd ..
echo "✓ Backend setup complete"
echo ""

# Setup data producer
echo "Setting up data producer..."
cd data-producer

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "Installing data producer dependencies..."
python3 -m venv venv
source venv/bin/activate
pip install httpx pydantic-settings python-dotenv
deactivate

cd ..
echo "✓ Data producer setup complete"
echo ""

# Setup frontend
echo "Setting up frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install

cd ..
echo "✓ Frontend setup complete"
echo ""

# Check if ports are available
echo "Checking port availability..."
if port_in_use 8000; then
    echo "⚠️  Port 8000 is already in use. Please stop the process using this port."
    exit 1
fi

if port_in_use 5173; then
    echo "⚠️  Port 5173 is already in use. Please stop the process using this port."
    exit 1
fi
echo "✓ Ports 8000 and 5173 are available"
echo ""

# Instructions
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete!                           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "To start the system, open THREE terminal windows and run:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn src.main:app --reload --port 8000"
echo ""
echo "Terminal 2 (Data Producer):"
echo "  cd data-producer"
echo "  source venv/bin/activate"
echo "  python -m src.main"
echo ""
echo "Terminal 3 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit:"
echo "  • Frontend: http://localhost:5173"
echo "  • API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C in each terminal to stop the services."
echo ""
