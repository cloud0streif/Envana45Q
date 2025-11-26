# API Documentation

## Base URL
```
http://localhost:8000
```

## Health Check

### GET /api/v1/health
Check the system health status.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## Sensor Data Ingestion

### POST /api/v1/sensors/bme280
Ingest a BME280 sensor reading.

**Request Body:**
```json
{
  "device_id": "bme280_001",
  "temperature_c": 23.45,
  "humidity": 45.67,
  "pressure_hpa": 1013.25,
  "timestamp": "2025-11-14T10:30:00Z",  // Optional
  "metadata": {}  // Optional
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "sensor_type": "bme280",
  "device_id": "bme280_001",
  "timestamp": "2025-11-14T10:30:00Z",
  "temperature_c": 23.45,
  "humidity": 45.67,
  "pressure_hpa": 1013.25,
  "metadata": null,
  "created_at": "2025-11-14T10:30:05Z"
}
```

## Raw Data Queries

### GET /api/v1/data/raw
Query raw sensor readings with filters.

**Query Parameters:**
- `sensor_type` (string, optional): Filter by sensor type (e.g., "bme280")
- `device_id` (string, optional): Filter by device ID
- `start` (datetime, optional): Start of time range
- `end` (datetime, optional): End of time range
- `limit` (integer, optional, default: 100): Maximum results (1-1000)

**Response:**
```json
{
  "count": 50,
  "data": [
    {
      "id": 1,
      "sensor_type": "bme280",
      "device_id": "bme280_001",
      "timestamp": "2025-11-14T10:30:00Z",
      "temperature_c": 23.45,
      "humidity": 45.67,
      "pressure_hpa": 1013.25,
      "metadata": null,
      "created_at": "2025-11-14T10:30:05Z"
    }
  ]
}
```

### GET /api/v1/data/raw/{device_id}
Query raw sensor readings for a specific device.

**Path Parameters:**
- `device_id` (string, required): Device identifier

**Query Parameters:**
- `start` (datetime, optional): Start of time range
- `end` (datetime, optional): End of time range
- `limit` (integer, optional, default: 100): Maximum results

**Response:** Same as GET /api/v1/data/raw

## Data Processing

### POST /api/v1/processing/run
Run a data processing job.

**Request Body:**
```json
{
  "processor": "average",
  "start_time": "2025-11-14T00:00:00Z",
  "end_time": "2025-11-14T23:59:59Z",
  "sensor_type": "bme280",
  "device_id": null  // Optional
}
```

**Response (201 Created):**
```json
{
  "job_id": 1,
  "status": "completed",
  "result": {
    "avg_temperature_c": 23.12,
    "avg_humidity": 45.89,
    "avg_pressure_hpa": 1013.45,
    "count": 100,
    "devices": ["bme280_001"]
  },
  "raw_count": 100,
  "created_at": "2025-11-14T15:00:00Z"
}
```

### GET /api/v1/processing/processors
List all available processors.

**Response:**
```json
{
  "processors": [
    {
      "name": "average",
      "version": "1.0.0",
      "description": "Calculate average of sensor readings"
    }
  ]
}
```

### GET /api/v1/processing/results
Query processed data results.

**Query Parameters:**
- `processor` (string, optional): Filter by processor name
- `sensor_type` (string, optional): Filter by sensor type
- `start` (datetime, optional): Start of time range
- `end` (datetime, optional): End of time range
- `limit` (integer, optional, default: 100): Maximum results

**Response:**
```json
{
  "count": 10,
  "data": [
    {
      "id": 1,
      "processor_name": "average",
      "processor_version": "1.0.0",
      "start_time": "2025-11-14T00:00:00Z",
      "end_time": "2025-11-14T23:59:59Z",
      "sensor_type": "bme280",
      "device_id": null,
      "result": {
        "avg_temperature_c": 23.12,
        "avg_humidity": 45.89,
        "avg_pressure_hpa": 1013.45,
        "count": 100
      },
      "raw_count": 100,
      "created_at": "2025-11-14T15:00:00Z"
    }
  ]
}
```

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "detail": "Invalid request parameters"
}
```

**404 Not Found:**
```json
{
  "detail": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error message"
}
```

## Interactive Documentation

When the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
