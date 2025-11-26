import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/modals/Modal'
import { injectorWells, monitoringWells } from '../lib/mock-data/wells'
import { generateMockTimeSeries } from '../lib/mock-data/injector-data'
import {
  ChevronRightIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

export function Sequestration() {
  const [isInjectionModalOpen, setIsInjectionModalOpen] = useState(false)
  const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const navigate = useNavigate()

  // Calculate YTD total from both injection wells
  const ytdInjectionTotal = useMemo(() => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1)
    const days = Math.floor((new Date().getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))

    // Get data from both wells
    const well1Data = generateMockTimeSeries(days, 1)
    const well2Data = generateMockTimeSeries(days, 2)

    // Sum totals from both wells
    const well1Total = well1Data.reduce((sum, point) => sum + point.co2_mass_injected, 0)
    const well2Total = well2Data.reduce((sum, point) => sum + point.co2_mass_injected, 0)

    return {
      total: Math.round(well1Total + well2Total),
      well1: Math.round(well1Total),
      well2: Math.round(well2Total)
    }
  }, [])

  const handleViewInjectorDashboard = (wellId: number) => {
    navigate(`/iot/injector/${wellId}`)
  }

  const handleViewMonitoringDashboard = (wellId: number) => {
    navigate(`/iot/monitoring/${wellId}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-envana-brown">CO₂ Sequestration</h1>
          <p className="text-gray-600 mt-2">Injection and monitoring well operations</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="text-envana-teal hover:text-envana-teal-dark font-medium"
        >
          ← Back to Home
        </button>
      </div>

      {/* YTD Injection Summary */}
      <div className="bg-gradient-to-r from-envana-teal to-envana-teal-dark rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">Total CO₂ Injected (YTD)</h2>
            <p className="text-5xl font-bold">{ytdInjectionTotal.total.toLocaleString()} <span className="text-2xl">t CO₂</span></p>
            <p className="text-sm opacity-90 mt-2">Year-to-Date: January 1 - November 24, 2025</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Injection Well Breakdown</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between space-x-8">
                  <span>Injector Well #1:</span>
                  <span className="font-bold">{ytdInjectionTotal.well1.toLocaleString()} t</span>
                </div>
                <div className="flex items-center justify-between space-x-8">
                  <span>Injector Well #2:</span>
                  <span className="font-bold">{ytdInjectionTotal.well2.toLocaleString()} t</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Cards */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-envana-brown mb-6">CO₂ Sequestration Operations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Injection Operations */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-envana-teal hover:shadow-lg transition-all cursor-pointer group">
            <h3 className="text-lg font-bold text-envana-brown mb-2">INJECTION OPERATIONS</h3>
            <p className="text-gray-600 text-sm mb-4">Manage CO₂ injection wells and operations</p>
            <ul className="space-y-2 mb-4 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-teal rounded-full mr-2"></span>
                Injector Well #1
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-teal rounded-full mr-2"></span>
                Injector Well #2
              </li>
            </ul>
            <button
              onClick={() => setIsInjectionModalOpen(true)}
              className="w-full bg-envana-teal text-white px-4 py-2 rounded-lg hover:bg-envana-teal-dark transition-colors font-medium group-hover:shadow-md"
            >
              VIEW OPERATIONS
            </button>
          </div>

          {/* Monitoring Operations */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-envana-coral hover:shadow-lg transition-all cursor-pointer group">
            <h3 className="text-lg font-bold text-envana-brown mb-2">MONITORING OPERATIONS</h3>
            <p className="text-gray-600 text-sm mb-4">Track monitoring wells and measurements</p>
            <ul className="space-y-2 mb-4 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-coral rounded-full mr-2"></span>
                Monitoring Well #1
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-coral rounded-full mr-2"></span>
                Monitoring Well #2
              </li>
            </ul>
            <button
              onClick={() => setIsMonitoringModalOpen(true)}
              className="w-full bg-envana-coral text-white px-4 py-2 rounded-lg hover:bg-envana-coral-dark transition-colors font-medium group-hover:shadow-md"
            >
              VIEW OPERATIONS
            </button>
          </div>
        </div>

        {/* Project Documents */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">PROJECT DOCUMENTS</h3>
            <button
              onClick={() => setIsDocumentModalOpen(true)}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">Class VI MRV Plan</p>
                  <p className="text-xs text-gray-500">Last updated: 2024-01-15 • Version 2.3</p>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-envana-coral" />
                <div>
                  <p className="font-medium text-gray-900">Monitoring & Verification Reports</p>
                  <p className="text-xs text-gray-500">Last updated: 2024-01-10 • Version 1.8</p>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Injection Permits</p>
                  <p className="text-xs text-gray-500">Last updated: 2023-12-20 • Version 1.2</p>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Injection Operations Modal */}
      <Modal
        isOpen={isInjectionModalOpen}
        onClose={() => setIsInjectionModalOpen(false)}
        title="Injection Operations"
      >
        <p className="text-gray-600 mb-6">Select an injector well to view its real-time dashboard:</p>
        <div className="space-y-4">
          {injectorWells.map((well) => (
            <div
              key={well.well_id}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-envana-teal hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {well.status === 'operational' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <WrenchScrewdriverIcon className="h-6 w-6 text-amber-500" />
                    )}
                    <h4 className="text-lg font-bold text-gray-900">{well.well_name}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 font-semibold ${well.status === 'operational' ? 'text-green-600' : 'text-amber-600'}`}>
                        {well.status.charAt(0).toUpperCase() + well.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Rate:</span>
                      <span className="ml-2 font-semibold text-gray-900">{well.current_rate_tpd} t/day</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewInjectorDashboard(well.well_id)}
                  className="bg-envana-teal hover:bg-envana-teal-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <span>View Dashboard</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Monitoring Operations Modal */}
      <Modal
        isOpen={isMonitoringModalOpen}
        onClose={() => setIsMonitoringModalOpen(false)}
        title="Monitoring Operations"
      >
        <p className="text-gray-600 mb-6">Select a monitoring well to view its real-time dashboard:</p>
        <div className="space-y-4">
          {monitoringWells.map((well) => (
            <div
              key={well.well_id}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-envana-coral hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <h4 className="text-lg font-bold text-gray-900">{well.well_name}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-semibold text-gray-900">{well.monitoring_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Reading:</span>
                      <span className="ml-2 font-semibold text-gray-900">{well.last_reading}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewMonitoringDashboard(well.well_id)}
                  className="bg-envana-coral hover:bg-envana-coral-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <span>View Dashboard</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Document Upload Modal */}
      <Modal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        title="Upload Document"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-envana-teal focus:border-envana-teal">
              <option>Class VI MRV</option>
              <option>Monitoring Report</option>
              <option>Injection Permit</option>
              <option>Compliance Document</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-envana-teal focus:border-envana-teal"
              placeholder="Enter document title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-envana-teal focus:border-envana-teal"
              placeholder="e.g., 1.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-envana-teal transition-colors">
              <div className="space-y-1 text-center">
                <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-envana-teal hover:text-envana-teal-dark">
                    <span>Upload a file</span>
                    <input type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOCX, XLSX up to 50MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsDocumentModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert('Document upload functionality will be implemented in backend')
                setIsDocumentModalOpen(false)
              }}
              className="px-4 py-2 bg-envana-teal text-white rounded-md hover:bg-envana-teal-dark"
            >
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
