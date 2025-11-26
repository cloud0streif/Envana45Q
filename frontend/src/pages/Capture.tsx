import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/modals/Modal'
import { captureFacilities } from '../lib/mock-data/facilities'
import { ChevronRightIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export function Capture() {
  const [isFacilitiesModalOpen, setIsFacilitiesModalOpen] = useState(false)
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleViewFacilityDashboard = (facilityId: number) => {
    navigate(`/capture/facility/${facilityId}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-envana-brown">CO₂ Capture</h1>
          <p className="text-gray-600 mt-2">Monitor capture facilities and performance metrics</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="text-envana-teal hover:text-envana-teal-dark font-medium"
        >
          ← Back to Home
        </button>
      </div>

      {/* YTD Capture Summary */}
      <div className="bg-gradient-to-r from-envana-teal to-envana-teal-dark rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">Total CO₂ Captured (YTD)</h2>
            <p className="text-5xl font-bold">{(1250000).toLocaleString()} <span className="text-2xl">t CO₂</span></p>
            <p className="text-sm opacity-90 mt-2">Year-to-Date: January 1 - November 24, 2025</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Facility Breakdown</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between space-x-8">
                  <span>AGRU Train #1:</span>
                  <span className="font-bold">{(750000).toLocaleString()} t</span>
                </div>
                <div className="flex items-center justify-between space-x-8">
                  <span>AGRU Train #2:</span>
                  <span className="font-bold">{(500000).toLocaleString()} t</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Cards */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-envana-brown mb-6">CO₂ Capture Operations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Capture Facilities */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-envana-teal hover:shadow-lg transition-all cursor-pointer group">
            <h3 className="text-lg font-bold text-envana-brown mb-2">CAPTURE FACILITIES</h3>
            <p className="text-gray-600 text-sm mb-4">Monitor operational capture facilities</p>
            <ul className="space-y-2 mb-4 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-teal rounded-full mr-2"></span>
                Facility A (Amine-based)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-teal rounded-full mr-2"></span>
                Facility B (Membrane)
              </li>
            </ul>
            <button
              onClick={() => setIsFacilitiesModalOpen(true)}
              className="w-full bg-envana-teal text-white px-4 py-2 rounded-lg hover:bg-envana-teal-dark transition-colors font-medium group-hover:shadow-md"
            >
              VIEW FACILITIES
            </button>
          </div>

          {/* Performance Metrics */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-envana-coral hover:shadow-lg transition-all cursor-pointer group">
            <h3 className="text-lg font-bold text-envana-brown mb-2">CAPTURE PERFORMANCE</h3>
            <p className="text-gray-600 text-sm mb-4">System efficiency and metrics</p>
            <ul className="space-y-2 mb-4 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-coral rounded-full mr-2"></span>
                Overall Efficiency Metrics
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-coral rounded-full mr-2"></span>
                Energy Consumption
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-envana-coral rounded-full mr-2"></span>
                CO₂ Purity Levels
              </li>
            </ul>
            <button
              onClick={() => setIsPerformanceModalOpen(true)}
              className="w-full bg-envana-coral text-white px-4 py-2 rounded-lg hover:bg-envana-coral-dark transition-colors font-medium group-hover:shadow-md"
            >
              VIEW PERFORMANCE
            </button>
          </div>
        </div>

        {/* System Documents */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-envana-brown mb-4">CAPTURE SYSTEM DOCUMENTS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
              📄 Process Flow Diagrams
            </div>
            <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
              📄 Operational Procedures
            </div>
            <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
              📄 Maintenance Records
            </div>
            <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
              📄 Performance Reports
            </div>
          </div>
        </div>
      </div>

      {/* Capture Facilities Modal */}
      <Modal
        isOpen={isFacilitiesModalOpen}
        onClose={() => setIsFacilitiesModalOpen(false)}
        title="Capture Facilities"
      >
        <p className="text-gray-600 mb-6">Select a capture facility to view its performance dashboard:</p>
        <div className="space-y-4">
          {captureFacilities.map((facility) => (
            <div
              key={facility.facility_id}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-envana-teal hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-envana-sidebar rounded-full p-2">
                      <CheckCircleIcon className="h-5 w-5 text-envana-teal" />
                    </div>
                    <h4 className="text-lg font-bold text-envana-brown">{facility.facility_name}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Technology:</span>
                      <span className="ml-2 font-semibold text-envana-brown">{facility.technology_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Capacity:</span>
                      <span className="ml-2 font-semibold text-envana-brown">{facility.capacity_tpd.toLocaleString()} t/day</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-semibold text-green-600">
                        {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Rate:</span>
                      <span className="ml-2 font-semibold text-envana-brown">{facility.current_rate_tpd.toLocaleString()} t/day</span>
                    </div>
                  </div>
                  <div className="bg-envana-sidebar rounded-lg p-3 text-sm">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="ml-2 font-bold text-envana-teal">{facility.efficiency_percent}%</span>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-envana-teal h-2 rounded-full transition-all"
                        style={{ width: `${facility.efficiency_percent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewFacilityDashboard(facility.facility_id)}
                  className="ml-4 bg-envana-teal hover:bg-envana-teal-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <span>View Dashboard</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Performance Metrics Modal */}
      <Modal
        isOpen={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
        title="Capture Performance Metrics"
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-envana-sidebar to-envana-sidebar-hover rounded-lg p-6 border border-envana-teal">
            <h4 className="text-lg font-bold text-envana-brown mb-4">Overall System Efficiency</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-envana-teal">91%</p>
                <p className="text-sm text-gray-600 mt-1">Combined efficiency across all facilities</p>
              </div>
              <ChartBarIcon className="h-16 w-16 text-envana-teal" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-envana-sidebar rounded-lg p-4 border border-gray-200">
              <h5 className="text-sm font-semibold text-envana-brown mb-2">Energy Consumption</h5>
              <p className="text-2xl font-bold text-envana-teal">2.5 GJ/t</p>
              <p className="text-xs text-gray-600 mt-1">Current average</p>
              <p className="text-xs text-gray-500">Target: 2.2 GJ/t</p>
            </div>

            <div className="bg-envana-sidebar rounded-lg p-4 border border-gray-200">
              <h5 className="text-sm font-semibold text-envana-brown mb-2">CO₂ Purity</h5>
              <p className="text-2xl font-bold text-envana-coral">99.2%</p>
              <p className="text-xs text-gray-600 mt-1">Current average</p>
              <p className="text-xs text-gray-500">Specification: &gt;99%</p>
            </div>
          </div>

          <div className="bg-envana-sidebar rounded-lg p-4">
            <h5 className="text-sm font-semibold text-envana-brown mb-3">30-Day Capture Rate Trend</h5>
            <div className="h-32 flex items-end justify-between space-x-1">
              {[65, 70, 68, 75, 80, 78, 85, 88, 90, 87, 91].map((value, i) => (
                <div key={i} className="flex-1 bg-envana-teal rounded-t" style={{ height: `${value}%` }} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Daily capture rates over the last 30 days</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
