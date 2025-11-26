import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatInTimeZone } from 'date-fns-tz'
import { api } from '../api/client'

interface ChartDataPoint {
  timestamp: string
  fullTimestamp: number
  temperature: number | null
  humidity: number | null
  pressure: number | null
  avgTemperature?: number | null
  avgHumidity?: number | null
  avgPressure?: number | null
}

export function Chart() {
  // Fetch raw sensor data
  const { data: rawData, isLoading: rawLoading } = useQuery({
    queryKey: ['chartData'],
    queryFn: () => api.getRawData({ limit: 100 }),
    refetchInterval: 10000,
  })

  // Fetch rolling average processed data
  const { data: rollingAvgData, isLoading: rollingLoading } = useQuery({
    queryKey: ['rollingAverageData'],
    queryFn: () => api.getProcessedResults({ processor: 'rolling_average', limit: 100 }),
    refetchInterval: 10000,
  })

  if (rawLoading || rollingLoading) {
    return <div className="text-center py-8 text-gray-500">Loading chart...</div>
  }

  // Transform raw data for recharts (reverse to show oldest first)
  const chartData: ChartDataPoint[] = rawData?.data
    .slice()
    .reverse()
    .map((reading) => ({
      timestamp: formatInTimeZone(reading.timestamp, 'America/Chicago', 'HH:mm:ss z'),
      fullTimestamp: new Date(reading.timestamp).getTime(),
      temperature: reading.temperature_c,
      humidity: reading.humidity,
      pressure: reading.pressure_hpa,
    })) || []

  // Transform rolling average data
  const rollingAvgChartData = rollingAvgData?.data
    .slice()
    .reverse()
    .map((processed) => {
      const result = processed.result as {
        avg_temperature_c?: number
        avg_humidity?: number
        avg_pressure_hpa?: number
        window_end?: string
      }
      return {
        timestamp: formatInTimeZone(processed.created_at, 'America/Chicago', 'HH:mm:ss z'),
        fullTimestamp: new Date(processed.created_at).getTime(),
        avgTemperature: result.avg_temperature_c,
        avgHumidity: result.avg_humidity,
        avgPressure: result.avg_pressure_hpa,
      }
    }) || []

  // Merge raw data and rolling averages by timestamp
  const mergedData: ChartDataPoint[] = [...chartData]

  // Add rolling average data points to the merged data
  rollingAvgChartData.forEach((avgPoint) => {
    const existingPoint = mergedData.find(
      (point) => point.timestamp === avgPoint.timestamp
    )
    if (existingPoint) {
      // Add rolling average values to existing timestamp
      existingPoint.avgTemperature = avgPoint.avgTemperature
      existingPoint.avgHumidity = avgPoint.avgHumidity
      existingPoint.avgPressure = avgPoint.avgPressure
    } else {
      // Add new timestamp with only rolling average values
      mergedData.push({
        timestamp: avgPoint.timestamp,
        fullTimestamp: avgPoint.fullTimestamp,
        temperature: null,
        humidity: null,
        pressure: null,
        avgTemperature: avgPoint.avgTemperature,
        avgHumidity: avgPoint.avgHumidity,
        avgPressure: avgPoint.avgPressure,
      })
    }
  })

  // Sort by timestamp
  mergedData.sort((a, b) => a.fullTimestamp - b.fullTimestamp)

  if (mergedData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available for chart
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Sensor Trends</h2>
      <p className="text-sm text-gray-600 mb-4">
        Real-time sensor data with 1-hour rolling averages (Central Time)
      </p>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Temperature (°C)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={1}
              dot={false}
              name="Raw Temperature"
            />
            <Line
              type="monotone"
              dataKey="avgTemperature"
              stroke="#000000"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#000000', r: 3 }}
              name="1hr Rolling Avg"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Humidity (%)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              strokeWidth={1}
              dot={false}
              name="Raw Humidity"
            />
            <Line
              type="monotone"
              dataKey="avgHumidity"
              stroke="#000000"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#000000', r: 3 }}
              name="1hr Rolling Avg"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Pressure (hPa)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#10b981"
              strokeWidth={1}
              dot={false}
              name="Raw Pressure"
            />
            <Line
              type="monotone"
              dataKey="avgPressure"
              stroke="#000000"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#000000', r: 3 }}
              name="1hr Rolling Avg"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
