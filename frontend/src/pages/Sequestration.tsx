import { useState, useMemo } from 'react'
import { injectorWells, monitoringWells } from '../lib/mock-data/wells'
import { generateMockTimeSeries } from '../lib/mock-data/injector-data'
import {
  CheckCircleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { InjectorDashboard } from './InjectorDashboard'
import { MonitoringDashboard } from './MonitoringDashboard'

type SelectedWell = { type: 'injector' | 'monitoring'; id: number } | null

export function Sequestration() {
  const [selectedWell, setSelectedWell] = useState<SelectedWell>(null)

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

  const handleWellClick = (type: 'injector' | 'monitoring', id: number) => {
    setSelectedWell({ type, id })
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

      {/* Injection Wells */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-envana-brown mb-6">INJECTION OPERATIONS</h2>
        <p className="text-gray-600 mb-6">Select an injector well to view its performance dashboard:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {injectorWells.map((well) => (
            <div
              key={well.well_id}
              onClick={() => handleWellClick('injector', well.well_id)}
              className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
                selectedWell?.type === 'injector' && selectedWell?.id === well.well_id
                  ? 'border-envana-teal bg-envana-sidebar shadow-lg'
                  : 'border-gray-200 hover:border-envana-teal hover:shadow-lg bg-white'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                {well.status === 'operational' ? (
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                ) : (
                  <WrenchScrewdriverIcon className="h-8 w-8 text-amber-500" />
                )}
                <h3 className="text-xl font-bold text-envana-brown">{well.well_name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-gray-500 mb-1">Status</p>
                  <p className={`font-semibold ${well.status === 'operational' ? 'text-green-600' : 'text-amber-600'}`}>
                    {well.status.charAt(0).toUpperCase() + well.status.slice(1)}
                  </p>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-gray-500 mb-1">Current Rate</p>
                  <p className="font-semibold text-gray-900">{well.current_rate_tpd} t/day</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring Wells */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-envana-brown mb-6">MONITORING OPERATIONS</h2>
        <p className="text-gray-600 mb-6">Select a monitoring well to view its performance dashboard:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monitoringWells.map((well) => (
            <div
              key={well.well_id}
              onClick={() => handleWellClick('monitoring', well.well_id)}
              className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
                selectedWell?.type === 'monitoring' && selectedWell?.id === well.well_id
                  ? 'border-envana-coral bg-envana-sidebar shadow-lg'
                  : 'border-gray-200 hover:border-envana-coral hover:shadow-lg bg-white'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <h3 className="text-xl font-bold text-envana-brown">{well.well_name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-gray-500 mb-1">Type</p>
                  <p className="font-semibold text-gray-900">{well.monitoring_type}</p>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-gray-500 mb-1">Last Reading</p>
                  <p className="font-semibold text-gray-900">{well.last_reading}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Well Dashboard - shown when a well is selected */}
      {selectedWell && (
        <div className="bg-gray-50 rounded-lg p-8 border-2 border-envana-teal">
          {selectedWell.type === 'injector' ? (
            <InjectorDashboard wellId={selectedWell.id} embedded={true} />
          ) : (
            <MonitoringDashboard wellId={selectedWell.id} embedded={true} />
          )}
        </div>
      )}

      {/* Project Documents */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-envana-brown mb-4">PROJECT DOCUMENTS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
            📄 Class VI MRV Plan
          </div>
          <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
            📄 Monitoring & Verification Reports
          </div>
          <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
            📄 Injection Permits
          </div>
          <div className="py-2 px-3 bg-envana-sidebar rounded-lg hover:bg-envana-sidebar-hover cursor-pointer text-sm">
            📄 Compliance Documents
          </div>
        </div>
      </div>

    </div>
  )
}
