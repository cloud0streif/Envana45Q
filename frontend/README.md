# BME280 Frontend

React + TypeScript web interface for viewing and processing BME280 sensor data.

## Features

- Real-time sensor data visualization
- Historical data queries
- Data processing controls
- Interactive charts with Recharts
- Responsive design with Tailwind CSS

## Setup

### Install Dependencies
```bash
npm install
```

### Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `VITE_API_BASE_URL` if your backend runs on a different URL.

## Development

Start the development server:
```bash
npm run dev
```

The application will open at http://localhost:5173

## Build

Create a production build:
```bash
npm run build
```

## Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

## Linting

Run ESLint:
```bash
npm run lint
```
