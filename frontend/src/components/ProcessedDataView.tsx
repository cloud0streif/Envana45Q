import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { api } from '../api/client'

export function ProcessedDataView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['processedData'],
    queryFn: () => api.getProcessedResults({ limit: 20 }),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading processed data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading processed data: {String(error)}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Processed Results</h2>
        <div className="text-sm text-gray-500">
          {data?.count || 0} results
        </div>
      </div>

      {(!data?.data || data.data.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No processed data yet. Run processing to see results.
        </div>
      )}

      <div className="space-y-4">
        {data?.data.map((result) => {
          const avgResult = result.result as {
            avg_temperature_c?: number
            avg_humidity?: number
            avg_pressure_hpa?: number
            count?: number
            devices?: string[]
          }

          return (
            <div
              key={result.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {result.processor_name} <span className="text-xs text-gray-500">v{result.processor_version}</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(result.start_time), 'MMM dd, HH:mm')} - {format(new Date(result.end_time), 'HH:mm')}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {result.raw_count} readings
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="bg-red-50 rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">Avg Temperature</div>
                  <div className="text-lg font-semibold text-red-700">
                    {avgResult.avg_temperature_c?.toFixed(2) ?? 'N/A'}°C
                  </div>
                </div>
                <div className="bg-envana-sidebar rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">Avg Humidity</div>
                  <div className="text-lg font-semibold text-envana-teal">
                    {avgResult.avg_humidity?.toFixed(2) ?? 'N/A'}%
                  </div>
                </div>
                <div className="bg-green-50 rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">Avg Pressure</div>
                  <div className="text-lg font-semibold text-green-700">
                    {avgResult.avg_pressure_hpa?.toFixed(2) ?? 'N/A'} hPa
                  </div>
                </div>
              </div>

              {avgResult.devices && avgResult.devices.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  Devices: {avgResult.devices.join(', ')}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
