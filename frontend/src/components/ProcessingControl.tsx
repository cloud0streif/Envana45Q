import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export function ProcessingControl() {
  const queryClient = useQueryClient()
  const [processor, setProcessor] = useState('average')
  const [hours, setHours] = useState(1)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: processors } = useQuery({
    queryKey: ['processors'],
    queryFn: () => api.getProcessors(),
  })

  const processMutation = useMutation({
    mutationFn: api.runProcessing,
    onSuccess: (data) => {
      setResult(`Processing completed! Job ID: ${data.job_id}, Processed ${data.raw_count} readings`)
      setError(null)
      // Invalidate processed results to refresh the view
      queryClient.invalidateQueries({ queryKey: ['processedData'] })
    },
    onError: (err) => {
      setError(String(err))
      setResult(null)
    },
  })

  const handleProcess = () => {
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000)

    processMutation.mutate({
      processor,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      sensor_type: 'bme280',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Processing</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Processor
          </label>
          <select
            value={processor}
            onChange={(e) => setProcessor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-envana-teal"
          >
            {processors?.processors.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} - {p.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range (hours)
          </label>
          <input
            type="number"
            min="1"
            max="24"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-envana-teal"
          />
          <p className="text-xs text-gray-500 mt-1">
            Process data from the last {hours} hour{hours !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={handleProcess}
          disabled={processMutation.isPending}
          className="w-full px-4 py-2 bg-envana-teal text-white rounded-md hover:bg-envana-teal-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {processMutation.isPending ? 'Processing...' : 'Run Processing'}
        </button>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm">
            {result}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  )
}
