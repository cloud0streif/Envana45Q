import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { api } from '../api/client'

export function RawDataView() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['rawData'],
    queryFn: () => api.getRawData({ limit: 50 }),
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading data: {String(error)}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Raw Sensor Data</h2>
        <div className="text-sm text-gray-500">
          {data?.count || 0} readings
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temperature (°C)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Humidity (%)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pressure (hPa)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data.map((reading) => (
              <tr key={reading.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {format(new Date(reading.timestamp), 'MMM dd, HH:mm:ss')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {reading.device_id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {reading.temperature_c?.toFixed(2) ?? 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {reading.humidity?.toFixed(2) ?? 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {reading.pressure_hpa?.toFixed(2) ?? 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!data?.data || data.data.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No data available. Start the data producer to see readings.
        </div>
      )}
    </div>
  )
}
