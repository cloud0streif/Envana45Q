import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { transportNodes, getNodeRoute } from '../lib/mock-data/transport-nodes'
import { generateInjectionSiteOutletTimeSeries } from '../lib/mock-data/transport-dashboard-data'
import {
  CheckCircleIcon,
  ArrowDownIcon,
  ChartBarIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'

export function Transport() {
  const navigate = useNavigate()

  const handleNodeClick = (nodeId: number) => {
    const node = transportNodes.find(n => n.node_id === nodeId)
    if (node) {
      navigate(getNodeRoute(node))
    }
  }

  // Calculate YTD total from Injection Site Outlet data
  const ytdTotal = useMemo(() => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1)
    const days = Math.floor((new Date().getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
    const data = generateInjectionSiteOutletTimeSeries(days)
    const total = data.reduce((sum, point) => sum + (point.co2_mass_flow || 0), 0)
    return Math.round(total)
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-envana-brown">CO₂ Transportation</h1>
          <p className="text-gray-600 mt-2">Real-time transportation network monitoring</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/')}
            className="text-envana-coral hover:text-envana-coral-dark font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Network Status Banner */}
      <div className="bg-envana-sidebar border-2 border-envana-teal rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-8 w-8 text-envana-teal" />
            <div>
              <p className="text-lg font-bold text-envana-brown">🟢 ALL SYSTEMS OPERATIONAL</p>
              <p className="text-sm text-gray-700">Last Updated: 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Total Transported YTD</p>
              <p className="text-xl font-bold text-gray-900">{ytdTotal.toLocaleString()} t</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Network Efficiency</p>
              <p className="text-xl font-bold text-envana-teal">99.7%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transportation Network Flow */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-envana-brown mb-6">CO₂ Transportation Network</h2>
        <p className="text-gray-600 mb-6">Real-time status of all transportation nodes</p>

        {/* Network Nodes */}
        <div className="space-y-4">
          {transportNodes.map((node, index) => (
            <div key={node.node_id}>
              {/* Node Card */}
              <div
                className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
                  node.status === 'operational'
                    ? 'border-envana-teal hover:border-envana-teal-dark hover:shadow-lg bg-white'
                    : node.status === 'warning'
                    ? 'border-yellow-200 hover:border-yellow-400 bg-yellow-50'
                    : 'border-red-200 hover:border-red-400 bg-red-50'
                }`}
                onClick={() => handleNodeClick(node.node_id)}
              >
                <div className="flex items-center justify-between">
                  {/* Node Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className={`rounded-full p-2 ${
                          node.status === 'operational' ? 'bg-envana-sidebar' : 'bg-yellow-100'
                        }`}
                      >
                        {node.node_type === 'pipeline_segment' ? (
                          <SignalIcon className="h-5 w-5 text-envana-teal" />
                        ) : node.node_type === 'pump_station' ? (
                          <ChartBarIcon className="h-5 w-5 text-envana-teal" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5 text-envana-teal" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-envana-brown">{node.node_name}</h3>
                        <p className="text-xs text-gray-500">
                          {node.node_type === 'capture_plant_outlet'
                            ? 'CO₂ exits capture facility'
                            : node.node_type === 'pipeline_segment'
                            ? `Pipeline transportation (${node.current_metrics.segment_length?.value} ${node.current_metrics.segment_length?.unit})`
                            : node.node_type === 'pump_station'
                            ? 'Intermediate compression/pumping'
                            : 'CO₂ arrives at sequestration site'}
                        </p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {Object.entries(node.current_metrics).map(([key, metric]) => {
                        // Skip segment length and diameter for display in metrics grid
                        if (key === 'segment_length' || key === 'diameter') return null

                        return (
                          <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">
                              {key === 'mass_rate'
                                ? 'Current Mass Rate'
                                : key === 'pressure'
                                ? 'Current Pressure'
                                : key === 'inlet_pressure'
                                ? 'Inlet Pressure'
                                : key === 'outlet_pressure'
                                ? 'Outlet Pressure'
                                : key === 'peak_emission_24hr'
                                ? 'Peak Emission (24hr)'
                                : key}
                            </p>
                            <div className="flex items-baseline space-x-1">
                              <p className="text-lg font-bold text-envana-brown">{metric.value.toFixed(2)}</p>
                              <p className="text-xs text-gray-600">{metric.unit}</p>
                              {metric.status && metric.status === 'normal' && (
                                <span className="text-envana-teal ml-2">✅</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Click to View Button */}
                  <button
                    className={`ml-6 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                      node.status === 'operational'
                        ? 'bg-envana-coral hover:bg-envana-coral-dark'
                        : 'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                  >
                    View Dashboard
                  </button>
                </div>
              </div>

              {/* Flow Arrow */}
              {index < transportNodes.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDownIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-envana-brown mb-4">TRANSPORTATION SYSTEM INFORMATION</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-envana-sidebar rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-envana-brown font-semibold mb-2">Total Pipeline Length</p>
            <p className="text-3xl font-bold text-envana-teal">106 mi</p>
            <p className="text-xs text-gray-600 mt-1">2 segments x 53 miles each</p>
          </div>
          <div className="bg-envana-sidebar rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-envana-brown font-semibold mb-2">Active Pump Stations</p>
            <p className="text-3xl font-bold text-envana-coral">1</p>
            <p className="text-xs text-gray-600 mt-1">Compression ratio: 1.48x</p>
          </div>
          <div className="bg-envana-sidebar rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-envana-brown font-semibold mb-2">System Uptime</p>
            <p className="text-3xl font-bold text-envana-teal">99.8%</p>
            <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
          </div>
        </div>
      </div>

      {/* System Documents */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-envana-brown mb-4">TRANSPORTATION SYSTEM DOCUMENTS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
            📄 Pipeline Integrity Reports
          </div>
          <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
            📄 Pump Station Maintenance Logs
          </div>
          <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
            📄 Corrosion Monitoring Reports
          </div>
          <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
            📄 Calibration Certificates
          </div>
        </div>
      </div>
    </div>
  )
}
