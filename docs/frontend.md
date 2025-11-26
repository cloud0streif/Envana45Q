# Frontend Implementation Plan

## Overview

Build a React + TypeScript web application for monitoring sensor data, triggering processing, and visualizing results.

## Implementation Order

### Step 1: Project Initialization

Create the frontend project with Vite:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Add dependencies:

```bash
# Core dependencies
npm install axios @tanstack/react-query

# UI and styling
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install clsx

# Charts and visualization
npm install recharts

# Date handling
npm install date-fns

# Development dependencies
npm install --save-dev @types/node
```

Initialize Tailwind:

```bash
npx tailwindcss init -p
```

### Step 2: Configuration Files

**File: `frontend/tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**File: `frontend/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
           transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 
           transition-colors;
  }
}
```

**File: `frontend/.env.example`**

```bash
VITE_API_BASE_URL=http://localhost:8000
```

**File: `frontend/vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### Step 3: TypeScript Types

**File: `frontend/src/types/sensor.ts`**

```typescript
export interface SensorReading {
  id: number;
  sensor_type: string;
  device_id: string;
  timestamp: string;
  temperature_c: number | null;
  humidity: number | null;
  pressure_hpa: number | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface RawDataResponse {
  count: number;
  total: number;
  data: SensorReading[];
}

export interface ProcessedData {
  id: number;
  processor_name: string;
  processor_version: string;
  start_time: string;
  end_time: string;
  sensor_type: string;
  device_id: string | null;
  result: {
    count: number;
    temperature_c?: {
      mean: number | null;
      min: number | null;
      max: number | null;
      count: number;
    };
    humidity?: {
      mean: number | null;
      min: number | null;
      max: number | null;
      count: number;
    };
    pressure_hpa?: {
      mean: number | null;
      min: number | null;
      max: number | null;
      count: number;
    };
    time_range?: {
      start: string;
      end: string;
      duration_seconds: number;
    };
  };
  raw_count: number;
  created_at: string;
}

export interface ProcessingRequest {
  processor: string;
  start_time: string;
  end_time: string;
  sensor_type: string;
  device_id?: string | null;
}

export interface ProcessingJobResponse {
  job_id: number;
  processor_name: string;
  status: string;
  start_time: string;
  end_time: string;
  sensor_type: string | null;
  device_id: string | null;
  created_at: string;
}

export interface ProcessorInfo {
  name: string;
  version: string;
  description: string;
}

export interface HealthResponse {
  status: string;
  database: string;
}
```

### Step 4: API Client

**File: `frontend/src/api/client.ts`**

```typescript
import axios from 'axios';
import type {
  RawDataResponse,
  ProcessedData,
  ProcessingRequest,
  ProcessingJobResponse,
  ProcessorInfo,
  HealthResponse,
} from '@/types/sensor';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const api = {
  // Health check
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/api/v1/health');
    return response.data;
  },

  // Raw data queries
  async getRawData(params: {
    sensor_type?: string;
    device_id?: string;
    start_time?: string;
    end_time?: string;
    limit?: number;
    offset?: number;
  }): Promise<RawDataResponse> {
    const response = await apiClient.get<RawDataResponse>('/api/v1/data/raw', {
      params,
    });
    return response.data;
  },

  // Processed data queries
  async getProcessedData(params: {
    processor?: string;
    sensor_type?: string;
    start_time?: string;
    end_time?: string;
    limit?: number;
  }): Promise<ProcessedData[]> {
    const response = await apiClient.get<ProcessedData[]>('/api/v1/data/processed', {
      params,
    });
    return response.data;
  },

  // Processing
  async triggerProcessing(request: ProcessingRequest): Promise<ProcessingJobResponse> {
    const response = await apiClient.post<ProcessingJobResponse>(
      '/api/v1/processing/run',
      request
    );
    return response.data;
  },

  async getProcessors(): Promise<ProcessorInfo[]> {
    const response = await apiClient.get<ProcessorInfo[]>('/api/v1/processing/processors');
    return response.data;
  },
};
```

### Step 5: React Query Hooks

**File: `frontend/src/hooks/useApi.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ProcessingRequest } from '@/types/sensor';

// Query keys
export const queryKeys = {
  health: ['health'] as const,
  rawData: (params: any) => ['rawData', params] as const,
  processedData: (params: any) => ['processedData', params] as const,
  processors: ['processors'] as const,
};

// Health check
export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.getHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Raw data
export function useRawData(params: Parameters<typeof api.getRawData>[0]) {
  return useQuery({
    queryKey: queryKeys.rawData(params),
    queryFn: () => api.getRawData(params),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// Processed data
export function useProcessedData(params: Parameters<typeof api.getProcessedData>[0]) {
  return useQuery({
    queryKey: queryKeys.processedData(params),
    queryFn: () => api.getProcessedData(params),
  });
}

// Processors
export function useProcessors() {
  return useQuery({
    queryKey: queryKeys.processors,
    queryFn: api.getProcessors,
  });
}

// Processing mutation
export function useProcessing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ProcessingRequest) => api.triggerProcessing(request),
    onSuccess: () => {
      // Invalidate processed data queries to refetch
      queryClient.invalidateQueries({ queryKey: ['processedData'] });
    },
  });
}
```

### Step 6: Utility Functions

**File: `frontend/src/utils/format.ts`**

```typescript
import { format, formatDistanceToNow } from 'date-fns';

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy HH:mm:ss');
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy');
}

export function formatTime(dateString: string): string {
  return format(new Date(dateString), 'HH:mm:ss');
}

export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(decimals);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(1)}%`;
}
```

**File: `frontend/src/utils/date.ts`**

```typescript
import { subHours, subDays, startOfDay, endOfDay } from 'date-fns';

export function getTimeRangePresets() {
  const now = new Date();
  
  return {
    'Last Hour': {
      start: subHours(now, 1).toISOString(),
      end: now.toISOString(),
    },
    'Last 6 Hours': {
      start: subHours(now, 6).toISOString(),
      end: now.toISOString(),
    },
    'Last 24 Hours': {
      start: subHours(now, 24).toISOString(),
      end: now.toISOString(),
    },
    'Today': {
      start: startOfDay(now).toISOString(),
      end: endOfDay(now).toISOString(),
    },
    'Last 7 Days': {
      start: subDays(now, 7).toISOString(),
      end: now.toISOString(),
    },
  };
}
```

### Step 7: Components

**File: `frontend/src/components/StatusBadge.tsx`**

```typescript
import clsx from 'clsx';

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'down';
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = {
    healthy: 'bg-green-100 text-green-800',
    degraded: 'bg-yellow-100 text-yellow-800',
    down: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colors[status]
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full mr-1.5', {
        'bg-green-500': status === 'healthy',
        'bg-yellow-500': status === 'degraded',
        'bg-red-500': status === 'down',
      })} />
      {label || status}
    </span>
  );
}
```

**File: `frontend/src/components/LoadingSpinner.tsx`**

```typescript
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
}
```

**File: `frontend/src/components/ErrorMessage.tsx`**

```typescript
import { XCircleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({ title = 'Error', message }: ErrorMessageProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**File: `frontend/src/components/TimeRangeSelector.tsx`**

```typescript
import { useState } from 'react';
import { getTimeRangePresets } from '@/utils/date';

interface TimeRange {
  start: string;
  end: string;
}

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const [isCustom, setIsCustom] = useState(false);
  const presets = getTimeRangePresets();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Range
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(presets).map(([label, range]) => (
            <button
              key={label}
              onClick={() => {
                onChange(range);
                setIsCustom(false);
              }}
              className="btn-secondary text-sm"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setIsCustom(true)}
            className="btn-secondary text-sm"
          >
            Custom
          </button>
        </div>
      </div>

      {isCustom && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={value.start.slice(0, 16)}
              onChange={(e) =>
                onChange({ ...value, start: new Date(e.target.value).toISOString() })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              value={value.end.slice(0, 16)}
              onChange={(e) =>
                onChange({ ...value, end: new Date(e.target.value).toISOString() })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

**File: `frontend/src/components/SensorChart.tsx`**

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatTime } from '@/utils/format';
import type { SensorReading } from '@/types/sensor';

interface SensorChartProps {
  data: SensorReading[];
  metric: 'temperature_c' | 'humidity' | 'pressure_hpa';
  title: string;
  color: string;
  unit: string;
}

export function SensorChart({ data, metric, title, color, unit }: SensorChartProps) {
  const chartData = data.map((reading) => ({
    timestamp: reading.timestamp,
    value: reading[metric],
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => formatTime(value)}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            label={{ value: unit, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            labelFormatter={(value) => formatTime(value)}
            formatter={(value: number) => [value.toFixed(2), title]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            name={title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**File: `frontend/src/components/RawDataTable.tsx`**

```typescript
import { formatDateTime, formatNumber, formatPercentage } from '@/utils/format';
import type { SensorReading } from '@/types/sensor';

interface RawDataTableProps {
  data: SensorReading[];
}

export function RawDataTable({ data }: RawDataTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Device
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Temperature (°C)
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Humidity (%)
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pressure (hPa)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((reading) => (
            <tr key={reading.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDateTime(reading.timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {reading.device_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatNumber(reading.temperature_c)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatPercentage(reading.humidity)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatNumber(reading.pressure_hpa)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**File: `frontend/src/components/ProcessedDataCard.tsx`**

```typescript
import { formatDateTime, formatNumber, formatPercentage } from '@/utils/format';
import type { ProcessedData } from '@/types/sensor';

interface ProcessedDataCardProps {
  data: ProcessedData;
}

export function ProcessedDataCard({ data }: ProcessedDataCardProps) {
  const { result } = data;

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{data.processor_name}</h3>
          <p className="text-sm text-gray-500">
            {formatDateTime(data.start_time)} - {formatDateTime(data.end_time)}
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {data.raw_count} readings
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {result.temperature_c && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Temperature</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(result.temperature_c.mean)}°C
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Min: {formatNumber(result.temperature_c.min)}°C
              <br />
              Max: {formatNumber(result.temperature_c.max)}°C
            </div>
          </div>
        )}

        {result.humidity && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Humidity</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(result.humidity.mean)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Min: {formatPercentage(result.humidity.min)}
              <br />
              Max: {formatPercentage(result.humidity.max)}
            </div>
          </div>
        )}

        {result.pressure_hpa && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Pressure</div>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(result.pressure_hpa.mean)} hPa
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Min: {formatNumber(result.pressure_hpa.min)} hPa
              <br />
              Max: {formatNumber(result.pressure_hpa.max)} hPa
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**File: `frontend/src/components/ProcessingControl.tsx`**

```typescript
import { useState } from 'react';
import { useProcessors, useProcessing } from '@/hooks/useApi';
import { TimeRangeSelector } from './TimeRangeSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { getTimeRangePresets } from '@/utils/date';

export function ProcessingControl() {
  const { data: processors, isLoading: loadingProcessors } = useProcessors();
  const processing = useProcessing();
  
  const [selectedProcessor, setSelectedProcessor] = useState('average');
  const [timeRange, setTimeRange] = useState(getTimeRangePresets()['Last Hour']);
  const [sensorType] = useState('bme280');

  const handleProcess = async () => {
    try {
      await processing.mutateAsync({
        processor: selectedProcessor,
        start_time: timeRange.start,
        end_time: timeRange.end,
        sensor_type: sensorType,
      });
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  if (loadingProcessors) {
    return <LoadingSpinner />;
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Data Processing</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Processor
          </label>
          <select
            value={selectedProcessor}
            onChange={(e) => setSelectedProcessor(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            {processors?.map((processor) => (
              <option key={processor.name} value={processor.name}>
                {processor.name} - {processor.description}
              </option>
            ))}
          </select>
        </div>

        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

        <div>
          <button
            onClick={handleProcess}
            disabled={processing.isPending}
            className="btn-primary w-full"
          >
            {processing.isPending ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Processing...</span>
              </span>
            ) : (
              'Run Processing'
            )}
          </button>
        </div>

        {processing.isError && (
          <ErrorMessage
            title="Processing Failed"
            message={processing.error.message}
          />
        )}

        {processing.isSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Processing completed successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 8: Main Views

**File: `frontend/src/views/RawDataView.tsx`**

```typescript
import { useState } from 'react';
import { useRawData } from '@/hooks/useApi';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { RawDataTable } from '@/components/RawDataTable';
import { SensorChart } from '@/components/SensorChart';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { getTimeRangePresets } from '@/utils/date';

export function RawDataView() {
  const [timeRange, setTimeRange] = useState(getTimeRangePresets()['Last Hour']);
  const [viewMode, setViewMode] = useState<'table' | 'charts'>('charts');

  const { data, isLoading, error } = useRawData({
    sensor_type: 'bme280',
    start_time: timeRange.start,
    end_time: timeRange.end,
    limit: 1000,
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Raw Sensor Data</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('charts')}
              className={viewMode === 'charts' ? 'btn-primary' : 'btn-secondary'}
            >
              Charts
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}
            >
              Table
            </button>
          </div>
        </div>

        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Showing {data?.count || 0} of {data?.total || 0} readings
          </p>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}

      {error && (
        <ErrorMessage
          title="Failed to load data"
          message={error.message}
        />
      )}

      {data && viewMode === 'charts' && (
        <div className="space-y-6">
          <SensorChart
            data={data.data}
            metric="temperature_c"
            title="Temperature"
            color="#3B82F6"
            unit="°C"
          />
          <SensorChart
            data={data.data}
            metric="humidity"
            title="Humidity"
            color="#10B981"
            unit="%"
          />
          <SensorChart
            data={data.data}
            metric="pressure_hpa"
            title="Pressure"
            color="#8B5CF6"
            unit="hPa"
          />
        </div>
      )}

      {data && viewMode === 'table' && (
        <div className="card">
          <RawDataTable data={data.data} />
        </div>
      )}
    </div>
  );
}
```

**File: `frontend/src/views/ProcessedDataView.tsx`**

```typescript
import { useState } from 'react';
import { useProcessedData } from '@/hooks/useApi';
import { ProcessedDataCard } from '@/components/ProcessedDataCard';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { getTimeRangePresets } from '@/utils/date';

export function ProcessedDataView() {
  const [timeRange, setTimeRange] = useState(getTimeRangePresets()['Last 24 Hours']);

  const { data, isLoading, error } = useProcessedData({
    processor: 'average',
    sensor_type: 'bme280',
    start_time: timeRange.start,
    end_time: timeRange.end,
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Processed Data Results</h2>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {isLoading && <LoadingSpinner />}

      {error && (
        <ErrorMessage
          title="Failed to load processed data"
          message={error.message}
        />
      )}

      {data && data.length === 0 && (
        <div className="card text-center text-gray-500">
          No processed data available for this time range
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((item) => (
            <ProcessedDataCard key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 9: Main App

**File: `frontend/src/App.tsx`**

```typescript
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RawDataView } from './views/RawDataView';
import { ProcessedDataView } from './views/ProcessedDataView';
import { ProcessingControl } from './components/ProcessingControl';
import { StatusBadge } from './components/StatusBadge';
import { useHealth } from './hooks/useApi';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState<'raw' | 'processing' | 'processed'>('raw');
  const { data: health } = useHealth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              BME280 Data System
            </h1>
            {health && (
              <StatusBadge
                status={health.status === 'healthy' ? 'healthy' : 'down'}
                label={`Server: ${health.status}`}
              />
            )}
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['raw', 'processing', 'processed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab === 'raw' && 'Raw Data'}
                {tab === 'processing' && 'Processing'}
                {tab === 'processed' && 'Processed Results'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'raw' && <RawDataView />}
        {activeTab === 'processing' && <ProcessingControl />}
        {activeTab === 'processed' && <ProcessedDataView />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            BME280 Sensor Data Collection System
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
```

**File: `frontend/src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 10: Documentation

**File: `frontend/README.md`**

```markdown
# BME280 Data System Frontend

React + TypeScript web application for monitoring sensor data.

## Features

- Real-time raw data visualization (charts and tables)
- Time range selection with presets
- Data processing triggers
- Processed data results view
- Responsive design
- Auto-refresh for live data

## Setup

Install dependencies:
```bash
npm install
```

Copy environment file:
```bash
cp .env.example .env
```

## Running

Development server:
```bash
npm run dev
```

Access at: http://localhost:5173

## Building

Build for production:
```bash
npm run build
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── api/           # API client
├── components/    # Reusable components
├── hooks/         # React Query hooks
├── types/         # TypeScript types
├── utils/         # Utility functions
├── views/         # Main views
├── App.tsx        # Main app component
└── main.tsx       # Entry point
```

## Features Guide

### Raw Data View
- View sensor readings in real-time
- Switch between charts and table view
- Filter by time range
- Auto-refresh every 10 seconds

### Processing Control
- Select processor (average, etc.)
- Choose time range for processing
- Trigger processing jobs
- View job status

### Processed Results
- View historical processing results
- Filter by time range
- See statistics and aggregations

## Development

Linting:
```bash
npm run lint
```

Type checking:
```bash
npm run type-check
```

## Testing

Run tests:
```bash
npm run test
```
```

## Implementation Checklist

- [ ] Initialize Vite + React + TypeScript project
- [ ] Install and configure Tailwind CSS
- [ ] Create TypeScript types
- [ ] Implement API client
- [ ] Create React Query hooks
- [ ] Build utility functions
- [ ] Create reusable components
- [ ] Implement main views
- [ ] Build main App component
- [ ] Add styling and polish
- [ ] Test all features
- [ ] Write README

## Success Criteria

After implementation:
1. Frontend loads at http://localhost:5173
2. Health status badge shows "healthy"
3. Raw data view shows charts/table
4. Time range selector works
5. Processing control triggers jobs
6. Processed results display correctly
7. Auto-refresh updates data
8. Responsive design works on mobile

## Next Steps

After basic implementation:
1. Add real-time WebSocket updates
2. Implement data export (CSV, JSON)
3. Add user authentication
4. Create custom dashboards
5. Add alert configuration
6. Implement dark mode
7. Add mobile-specific optimizations