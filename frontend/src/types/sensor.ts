export interface SensorReading {
  id: number
  sensor_type: string
  device_id: string
  timestamp: string
  temperature_c: number | null
  humidity: number | null
  pressure_hpa: number | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface ProcessedData {
  id: number
  processor_name: string
  processor_version: string
  start_time: string
  end_time: string
  sensor_type: string
  device_id: string | null
  result: Record<string, unknown>
  raw_count: number
  created_at: string
}

export interface ProcessorInfo {
  name: string
  version: string
  description: string
}

export interface ProcessingRequest {
  processor: string
  start_time: string
  end_time: string
  sensor_type: string
  device_id?: string | null
}
