import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircleIcon, SignalIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export function IoTDashboard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Parse the ID to determine the type and number
  const idParts = id?.split('-') || []
  const assetType = idParts[0] // 'well', 'facility', 'pipeline'
  const assetId = idParts[1]

  const getAssetInfo = () => {
    switch (assetType) {
      case 'well':
        return {
          name: `Injector Well #${assetId}`,
          type: 'Injection Well',
          backLink: '/sequestration',
        }
      case 'facility':
        return {
          name: `Capture Facility ${assetId === '1' ? 'A' : 'B'}`,
          type: 'Capture Facility',
          backLink: '/capture',
        }
      case 'pipeline':
        return {
          name: `Pipeline #${assetId}`,
          type: 'Pipeline',
          backLink: '/transport',
        }
      default:
        return {
          name: 'Asset Dashboard',
          type: 'Unknown',
          backLink: '/',
        }
    }
  }

  const assetInfo = getAssetInfo()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{assetInfo.name}</h1>
          <p className="text-gray-600 mt-1">Real-time Monitoring Dashboard • {assetInfo.type}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(assetInfo.backLink)}
            className="text-envana-coral hover:text-envana-coral-dark font-medium"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-envana-coral hover:text-envana-coral-dark font-medium"
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-lg font-bold text-green-900">🟢 OPERATIONAL</p>
            <p className="text-sm text-green-700">Last Updated: 2 seconds ago</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">PRESSURE</h3>
          <p className="text-4xl font-bold text-gray-900">125 bar</p>
          <p className="text-sm text-green-600 mt-2">▲ +2%</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">TEMPERATURE</h3>
          <p className="text-4xl font-bold text-gray-900">45°C</p>
          <p className="text-sm text-red-600 mt-2">▼ -1%</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">FLOW RATE</h3>
          <p className="text-4xl font-bold text-gray-900">150 t/day</p>
          <p className="text-sm text-green-600 mt-2">▲ +5%</p>
        </div>
      </div>

      {/* Real-time Sensor Data */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Real-Time Sensor Data</h3>
          <SignalIcon className="h-6 w-6 text-green-500 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <p className="text-sm font-medium text-red-700">🌡️ Ambient Temperature</p>
            <p className="text-2xl font-bold text-red-900 mt-2">23.5°C</p>
          </div>

          <div className="bg-gradient-to-br from-envana-sidebar to-envana-sidebar-hover rounded-lg p-4 border border-envana-sidebar-active">
            <p className="text-sm font-medium text-envana-coral-dark">💧 Humidity</p>
            <p className="text-2xl font-bold text-envana-teal mt-2">45.2%</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p className="text-sm font-medium text-green-700">📊 Pressure (Atmospheric)</p>
            <p className="text-2xl font-bold text-green-900 mt-2">1013.4 hPa</p>
          </div>
        </div>

        {/* Placeholder for Charts */}
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">📈 Live Chart: Last 24 Hours</h4>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg">Real-time charts will be integrated here</p>
              <p className="text-sm mt-2">(BME280 sensor data with rolling averages)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Data */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Operational Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total CO₂ Processed Today</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">148.5 tonnes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total CO₂ Processed (Project)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">12,450 tonnes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Operational Efficiency</p>
            <p className="text-2xl font-bold text-green-700 mt-1">98.5%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">System Uptime</p>
            <p className="text-2xl font-bold text-envana-coral-dark mt-1">99.2%</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Alerts & Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-2xl">🟡</span>
            <div>
              <p className="font-medium text-yellow-900">Minor: Temperature trending up (within limits)</p>
              <p className="text-xs text-yellow-700">Last updated: 5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-2xl">🟢</span>
            <div>
              <p className="font-medium text-green-900">All other systems normal</p>
              <p className="text-xs text-green-700">System health: Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="flex items-center space-x-2 bg-envana-coral hover:bg-envana-coral-dark text-white px-6 py-3 rounded-md font-medium transition-colors">
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Export Data</span>
        </button>
        <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
          <span>Generate Report</span>
        </button>
        <button className="flex items-center space-x-2 bg-envana-teal hover:bg-envana-teal-dark text-white px-6 py-3 rounded-md font-medium transition-colors">
          <span>View History</span>
        </button>
      </div>
    </div>
  )
}
