import { useState, useMemo } from 'react'
import { transportNodes, type TransportNode } from '../lib/mock-data/transport-nodes'
import { generateInjectionSiteOutletTimeSeries } from '../lib/mock-data/transport-dashboard-data'
import {
  CheckCircleIcon,
  ArrowDownIcon,
  ChartBarIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'
import { CapturePlantOutletDashboard } from './CapturePlantOutletDashboard'
import { PipelineSegmentDashboard } from './PipelineSegmentDashboard'
import { PumpStationDashboard } from './PumpStationDashboard'
import { InjectionSiteOutletDashboard } from './InjectionSiteOutletDashboard'
import { TransportNetworkMap } from '../components/TransportNetworkMap'

export function Transport() {
  const [selectedNode, setSelectedNode] = useState<TransportNode | null>(null)

  const handleNodeClick = (node: TransportNode) => {
    setSelectedNode(node)
  }

  // Map selected node to highlight value for the network map
  const getHighlightNode = (): 'capture' | 'segment1' | 'pump' | 'segment2' | 'injection' | undefined => {
    if (!selectedNode) return undefined

    switch (selectedNode.node_type) {
      case 'capture_plant_outlet':
        return 'capture'
      case 'pipeline_segment':
        return selectedNode.node_order === 2 ? 'segment1' : 'segment2'
      case 'pump_station':
        return 'pump'
      case 'injection_site_outlet':
        return 'injection'
      default:
        return undefined
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

  const renderDashboard = () => {
    if (!selectedNode) return null

    const commonProps = { embedded: true }

    switch (selectedNode.node_type) {
      case 'capture_plant_outlet':
        return <CapturePlantOutletDashboard {...commonProps} />
      case 'pipeline_segment':
        // Use node_order to determine segment number (node_order 2 = segment 1, node_order 4 = segment 2)
        const segmentNumber = selectedNode.node_order === 2 ? '1' : '2'
        return <PipelineSegmentDashboard segmentId={segmentNumber} {...commonProps} />
      case 'pump_station':
        return <PumpStationDashboard {...commonProps} />
      case 'injection_site_outlet':
        return <InjectionSiteOutletDashboard {...commonProps} />
      default:
        return null
    }
  }

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
            onClick={() => window.history.back()}
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

      {/* Transportation System Information - Moved Above */}
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

      {/* Transportation Network Map */}
      <TransportNetworkMap highlightNode={getHighlightNode()} />

      {/* Transportation Network Flow */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-envana-brown mb-6">CO₂ TRANSPORTATION NETWORK</h2>
        <p className="text-gray-600 mb-6">Select a transportation node to view its performance dashboard:</p>

        {/* Network Nodes - Compact Row Layout */}
        <div className="grid grid-cols-5 gap-4">
          {transportNodes.map((node) => (
            <div
              key={node.node_id}
              className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                selectedNode?.node_id === node.node_id
                  ? 'border-envana-coral bg-envana-sidebar shadow-lg'
                  : node.status === 'operational'
                  ? 'border-envana-teal hover:border-envana-teal-dark hover:shadow-lg bg-white'
                  : node.status === 'warning'
                  ? 'border-yellow-200 hover:border-yellow-400 bg-yellow-50'
                  : 'border-red-200 hover:border-red-400 bg-red-50'
              }`}
              onClick={() => handleNodeClick(node)}
            >
              {/* Node Header */}
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className={`rounded-full p-1.5 ${
                    node.status === 'operational' ? 'bg-envana-sidebar' : 'bg-yellow-100'
                  }`}
                >
                  {node.node_type === 'pipeline_segment' ? (
                    <SignalIcon className="h-4 w-4 text-envana-teal" />
                  ) : node.node_type === 'pump_station' ? (
                    <ChartBarIcon className="h-4 w-4 text-envana-teal" />
                  ) : (
                    <CheckCircleIcon className="h-4 w-4 text-envana-teal" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-envana-brown">{node.node_name}</h3>
              </div>

              {/* Metrics */}
              <div className="space-y-2 text-xs">
                {Object.entries(node.current_metrics).map(([key, metric]) => {
                  // Skip segment length and diameter for display in metrics grid
                  if (key === 'segment_length' || key === 'diameter') return null

                  return (
                    <div key={key} className="bg-white rounded p-2 border border-gray-200">
                      <p className="text-gray-500 mb-0.5">
                        {key === 'mass_rate'
                          ? 'Mass Rate'
                          : key === 'pressure'
                          ? 'Pressure'
                          : key === 'inlet_pressure'
                          ? 'Inlet P'
                          : key === 'outlet_pressure'
                          ? 'Outlet P'
                          : key === 'peak_emission_24hr'
                          ? 'Peak Emission'
                          : key}
                      </p>
                      <div className="flex items-baseline space-x-1">
                        <p className="text-sm font-bold text-envana-brown">{metric.value.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">{metric.unit}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Dashboard - shown when a node is selected */}
      {selectedNode && (
        <div className="bg-gray-50 rounded-lg p-8 border-2 border-envana-coral">
          {renderDashboard()}
        </div>
      )}

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
