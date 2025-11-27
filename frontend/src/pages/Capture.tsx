import { useState } from 'react'
import { captureFacilities } from '../lib/mock-data/facilities'
import { CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { CaptureFacilityDashboard } from './CaptureFacilityDashboard'

export function Capture() {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null)

  const handleFacilitySelect = (facilityId: number) => {
    setSelectedFacilityId(facilityId)
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

      {/* Capture Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-envana-brown mb-6">CAPTURE PERFORMANCE</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-envana-sidebar to-envana-sidebar-hover rounded-lg p-4 border border-envana-teal">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-semibold text-envana-brown">Overall System Efficiency</h5>
                <ChartBarIcon className="h-8 w-8 text-envana-teal" />
              </div>
              <p className="text-3xl font-bold text-envana-teal">91%</p>
              <p className="text-xs text-gray-600 mt-1">Combined efficiency</p>
            </div>

            <div className="bg-envana-sidebar rounded-lg p-4 border border-gray-200">
              <h5 className="text-sm font-semibold text-envana-brown mb-2">Energy Consumption</h5>
              <p className="text-3xl font-bold text-envana-teal">2.5 GJ/t</p>
              <p className="text-xs text-gray-600 mt-1">Current average</p>
              <p className="text-xs text-gray-500">Target: 2.2 GJ/t</p>
            </div>

            <div className="bg-envana-sidebar rounded-lg p-4 border border-gray-200">
              <h5 className="text-sm font-semibold text-envana-brown mb-2">CO₂ Purity</h5>
              <p className="text-3xl font-bold text-envana-coral">99.2%</p>
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
      </div>

      {/* Capture Facilities Selection */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-envana-brown mb-6">CAPTURE FACILITIES</h2>
        <p className="text-gray-600 mb-6">Select a capture facility to view its performance dashboard:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {captureFacilities.map((facility) => (
            <div
              key={facility.facility_id}
              onClick={() => handleFacilitySelect(facility.facility_id)}
              className={`border-2 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
                selectedFacilityId === facility.facility_id
                  ? 'border-envana-teal bg-envana-sidebar'
                  : 'border-gray-200 hover:border-envana-teal'
              }`}
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
                  <div className="bg-white rounded-lg p-3 text-sm">
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facility Dashboard - shown when a facility is selected */}
      {selectedFacilityId !== null && (
        <div className="bg-gray-50 rounded-lg p-8 border-2 border-envana-teal">
          <CaptureFacilityDashboard
            facilityId={selectedFacilityId}
            embedded={true}
          />
        </div>
      )}

      {/* System Documents */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
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
  )
}
