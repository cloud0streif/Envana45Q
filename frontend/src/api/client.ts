import axios from 'axios'
import type { SensorReading, ProcessedData, ProcessorInfo, ProcessingRequest } from '../types/sensor'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface RawDataResponse {
  count: number
  data: SensorReading[]
}

export interface ProcessedDataResponse {
  count: number
  data: ProcessedData[]
}

export interface ProcessorsResponse {
  processors: ProcessorInfo[]
}

export interface ProcessingJobResponse {
  job_id: number
  status: string
  result: Record<string, unknown>
  raw_count: number
  created_at: string
}

export const api = {
  // Health check
  async checkHealth(): Promise<{ status: string; database: string }> {
    const response = await apiClient.get('/api/v1/health')
    return response.data
  },

  // Raw data queries
  async getRawData(params?: {
    sensor_type?: string
    device_id?: string
    start?: string
    end?: string
    limit?: number
  }): Promise<RawDataResponse> {
    const response = await apiClient.get('/api/v1/data/raw', { params })
    return response.data
  },

  async getDeviceData(
    deviceId: string,
    params?: {
      start?: string
      end?: string
      limit?: number
    }
  ): Promise<RawDataResponse> {
    const response = await apiClient.get(`/api/v1/data/raw/${deviceId}`, { params })
    return response.data
  },

  // Processing
  async runProcessing(request: ProcessingRequest): Promise<ProcessingJobResponse> {
    const response = await apiClient.post('/api/v1/processing/run', request)
    return response.data
  },

  async getProcessors(): Promise<ProcessorsResponse> {
    const response = await apiClient.get('/api/v1/processing/processors')
    return response.data
  },

  async getProcessedResults(params?: {
    processor?: string
    sensor_type?: string
    start?: string
    end?: string
    limit?: number
  }): Promise<ProcessedDataResponse> {
    const response = await apiClient.get('/api/v1/processing/results', { params })
    return response.data
  },
}
