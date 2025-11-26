import { useState, useMemo, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpTrayIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import {
  outletDocuments,
  OUTLET_DEPENDENCIES,
  isTransportMeasurementValid,
  generateInjectionSiteOutletTimeSeries,
  calculateValidUntil,
  type TransportComplianceDocument,
} from '../lib/mock-data/transport-dashboard-data'
import { TransportNetworkMap } from '../components/TransportNetworkMap'
import { Modal } from '../components/modals/Modal'

type TimePeriod = 'day' | 'week' | 'month' | '6months' | 'year' | 'ytd' | 'custom'
type DataSource = 'scada' | 'manual'

export function InjectionSiteOutletDashboard() {
  const navigate = useNavigate()

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('ytd')
  const [dataSource, setDataSource] = useState<DataSource>('scada')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [documents, setDocuments] = useState<TransportComplianceDocument[]>(outletDocuments)
  const [selectedMeasurement, setSelectedMeasurement] = useState<string | null>(null)
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Scroll to top when component mounts (useLayoutEffect runs before paint)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Generate chart data based on selected period
  const chartData = useMemo(() => {
    let days = 7
    switch (selectedPeriod) {
      case 'day': days = 1; break
      case 'week': days = 7; break
      case 'month': days = 30; break
      case '6months': days = 180; break
      case 'year': days = 365; break
      case 'ytd':
        const startOfYear = new Date(new Date().getFullYear(), 0, 1)
        days = Math.floor((new Date().getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
        break
      case 'custom':
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate)
          const end = new Date(customEndDate)
          days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        }
        break
    }

    const timeSeriesData = generateInjectionSiteOutletTimeSeries(days)
    return timeSeriesData.map((point) => ({
      timestamp: point.timestamp,
      displayTime: format(new Date(point.timestamp), days <= 1 ? 'HH:mm' : days <= 30 ? 'MMM dd' : 'MMM yyyy'),
      mass_flow: Number(point.co2_mass_flow!.toFixed(1)),
      density: Number(point.fluid_density!.toFixed(3)),
      composition: Number(point.co2_composition!.toFixed(2)),
      pressure: Number(point.inlet_pressure!.toFixed(1)),
      temperature: Number(point.inlet_temperature!.toFixed(1)),
    }))
  }, [selectedPeriod, customStartDate, customEndDate])

  // Calculate summary statistics
  const calculatedMeasurements = useMemo(() => {
    if (chartData.length === 0) return {}

    const totalMass = chartData.reduce((sum, point) => sum + point.mass_flow, 0)
    const avgDensity = chartData.reduce((sum, point) => sum + point.density, 0) / chartData.length
    const avgComposition = chartData.reduce((sum, point) => sum + point.composition, 0) / chartData.length
    const avgPressure = chartData.reduce((sum, point) => sum + point.pressure, 0) / chartData.length
    const avgTemperature = chartData.reduce((sum, point) => sum + point.temperature, 0) / chartData.length

    return {
      co2_mass_flow: {
        label: 'CO2 Mass Flow',
        value: Number(totalMass.toFixed(1)),
        unit: 't',
        is_valid: isTransportMeasurementValid('co2_mass_flow', documents, OUTLET_DEPENDENCIES),
      },
      fluid_density: {
        label: 'Fluid Density',
        value: Number(avgDensity.toFixed(3)),
        unit: 'g/cm³',
        is_valid: isTransportMeasurementValid('fluid_density', documents, OUTLET_DEPENDENCIES),
      },
      co2_composition: {
        label: 'CO2 Content',
        value: Number(avgComposition.toFixed(2)),
        unit: '%',
        is_valid: isTransportMeasurementValid('co2_composition', documents, OUTLET_DEPENDENCIES),
      },
      inlet_pressure: {
        label: 'Avg Inlet Pressure',
        value: Number(avgPressure.toFixed(1)),
        unit: 'bar',
        is_valid: isTransportMeasurementValid('inlet_pressure', documents, OUTLET_DEPENDENCIES),
      },
      inlet_temperature: {
        label: 'Avg Inlet Temp',
        value: Number(avgTemperature.toFixed(1)),
        unit: '°C',
        is_valid: isTransportMeasurementValid('inlet_temperature', documents, OUTLET_DEPENDENCIES),
      },
    }
  }, [chartData, documents])

  const handleDocumentDateChange = (documentId: number, newDate: string, validityDays: number) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id === documentId) {
        const validUntil = calculateValidUntil(newDate, validityDays)
        const status = new Date(validUntil) >= new Date() ? 'valid' : 'expired'
        return { ...doc, date_of_test: newDate, status: status as 'valid' | 'expired' }
      }
      return doc
    }))
  }

  const handleMeasurementClick = (measurementKey: string) => {
    setSelectedMeasurement(measurementKey)
    setIsReportsModalOpen(true)
  }

  const getDependentDocuments = (measurementKey: string) => {
    const requiredDocTypes = OUTLET_DEPENDENCIES[measurementKey] || []
    return documents.filter(doc => requiredDocTypes.includes(doc.document_type))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Injection Site Outlet</h1>
          <p className="text-gray-600 mt-1">Where CO₂ arrives at the sequestration site</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => navigate('/transport')} className="text-envana-coral hover:text-envana-coral-dark font-medium">
            ← Back
          </button>
          <button onClick={() => navigate('/')} className="text-envana-coral hover:text-envana-coral-dark font-medium">
            🏠 Home
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">TIME PERIOD</h3>
        <div className="flex flex-wrap items-center gap-4">
          {(['day', 'week', 'month', '6months', 'year', 'ytd', 'custom'] as TimePeriod[]).map((period) => (
            <label key={period} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="period"
                value={period}
                checked={selectedPeriod === period}
                onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
                className="w-4 h-4 text-envana-coral"
              />
              <span className="text-sm font-medium text-gray-700">
                {period === '6months' ? '6 Months' : period === 'ytd' ? 'YTD' : period.charAt(0).toUpperCase() + period.slice(1)}
              </span>
            </label>
          ))}
        </div>

        {selectedPeriod === 'custom' && (
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        )}
      </div>

      {/* Meter Readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(calculatedMeasurements).map(([key, measurement]) => (
          <div
            key={key}
            onClick={() => handleMeasurementClick(key)}
            className="bg-white rounded-lg shadow-md p-4 border-2 border-envana-teal hover:border-envana-teal-dark hover:shadow-lg transition-all cursor-pointer"
          >
            <h4 className="text-sm font-medium text-gray-600 mb-2">{measurement.label}</h4>
            <p className="text-3xl font-bold text-gray-900 mb-3">
              {measurement.value >= 1000
                ? Math.round(measurement.value).toLocaleString()
                : measurement.value.toFixed(measurement.unit === 'g/cm³' ? 3 : measurement.unit === '%' ? 2 : 1)
              } {measurement.unit}
            </p>
            <div className={`flex items-center space-x-2 text-xs font-medium ${measurement.is_valid ? 'text-green-600' : 'text-red-600'}`}>
              {measurement.is_valid ? (
                <><CheckCircleIcon className="h-4 w-4" /><span>Valid in Period</span></>
              ) : (
                <><XCircleIcon className="h-4 w-4" /><span>Not Valid</span></>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Data Source Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">DATA SOURCE</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="radio" name="dataSource" value="scada" checked={dataSource === 'scada'} onChange={(e) => setDataSource(e.target.value as DataSource)} className="w-4 h-4 text-envana-coral" />
            <span className="text-sm font-medium text-gray-700">⭕ Data Received Through SCADA</span>
            {dataSource === 'scada' && <span className="text-xs text-gray-500 ml-auto">Last Updated: 2 minutes ago</span>}
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="radio" name="dataSource" value="manual" checked={dataSource === 'manual'} onChange={(e) => setDataSource(e.target.value as DataSource)} className="w-4 h-4 text-envana-coral" />
            <span className="text-sm font-medium text-gray-700">📤 Upload Measurement Data</span>
            {dataSource === 'manual' && <button className="ml-auto bg-envana-coral hover:bg-envana-coral-dark text-white px-4 py-2 rounded-md text-sm font-medium">Browse CSV</button>}
          </label>
        </div>
      </div>

      {/* Chart and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart of Data Over Selected Period</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayTime" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: 't/hr / bar / °C', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: 'g/cm³ / %', angle: 90, position: 'insideRight' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
              <Line yAxisId="left" type="monotone" dataKey="mass_flow" stroke="#3B82F6" name="CO2 Mass Flow (t/hr)" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="density" stroke="#10B981" name="Density (g/cm³)" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="composition" stroke="#F59E0B" name="Composition (%)" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="pressure" stroke="#EF4444" name="Pressure (bar)" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8B5CF6" name="Temperature (°C)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Network Map */}
        <div className="lg:col-span-1">
          <TransportNetworkMap highlightNode="injection" />
        </div>
      </div>

      {/* Current Compliance Documents */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">CURRENT COMPLIANCE/CALIBRATION DOCUMENTS</h3>
        <div className="space-y-4">
          {(() => {
            const docsByType = documents.reduce((acc, doc) => {
              if (!acc[doc.document_type] || new Date(doc.date_of_test) > new Date(acc[doc.document_type].date_of_test)) {
                acc[doc.document_type] = doc
              }
              return acc
            }, {} as Record<string, typeof documents[0]>)

            return Object.values(docsByType).map((doc) => {
              const validUntil = calculateValidUntil(doc.date_of_test, doc.validity_period_days)
              return (
                <div key={doc.document_id} className={`border-2 rounded-lg p-5 ${doc.status === 'valid' ? 'border-envana-teal bg-envana-sidebar' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <DocumentTextIcon className="h-5 w-5 text-envana-teal" />
                        <h4 className="text-sm font-semibold text-gray-900">{doc.display_name}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <label className="text-gray-600 block mb-1">Date of Test:</label>
                          <div className="flex items-center space-x-2">
                            <input type="date" value={doc.date_of_test} onChange={(e) => handleDocumentDateChange(doc.document_id, e.target.value, doc.validity_period_days)} className="border-gray-300 rounded-md shadow-sm text-sm" />
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="text-gray-600 block mb-1">Valid Until:</label>
                          <p className="font-medium text-gray-900 py-2">{new Date(validUntil).toLocaleDateString()} (Calculated)</p>
                        </div>
                        <div>
                          <label className="text-gray-600 block mb-1">Status:</label>
                          <div className="flex items-center space-x-2 py-2">
                            {doc.status === 'valid' ? (
                              <><CheckCircleIcon className="h-5 w-5 text-envana-teal" /><span className="font-semibold text-envana-teal">Valid</span></>
                            ) : (
                              <><XCircleIcon className="h-5 w-5 text-red-600" /><span className="font-semibold text-red-700">Expired</span></>
                            )}
                          </div>
                        </div>
                      </div>
                      {doc.file_name && <p className="text-xs text-gray-500 mt-2">📎 {doc.file_name}</p>}
                    </div>
                    <button onClick={() => alert('Document upload functionality will be implemented')} className="ml-4 flex items-center space-x-2 bg-envana-coral hover:bg-envana-coral-dark text-white px-4 py-2 rounded-md text-sm font-medium">
                      <ArrowUpTrayIcon className="h-4 w-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              )
            })
          })()}
        </div>

        {/* Report Dependencies */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Report Dependencies on Measurements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-700 mb-2">Coriolis Meter Calibration Report:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>CO2 Mass Flow</li>
                <li>Fluid Density</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-700 mb-2">Gas Analyzer Calibration Report:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>CO2 Content</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-700 mb-2">P&T Transducer Calibration Report:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Avg Inlet Pressure</li>
                <li>Avg Inlet Temp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button onClick={() => setIsExportModalOpen(true)} className="bg-envana-coral hover:bg-envana-coral-dark text-white px-6 py-3 rounded-md font-medium transition-colors">
          Export Data
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
          Generate Report
        </button>
        <button className="bg-envana-teal hover:bg-envana-teal-dark text-white px-6 py-3 rounded-md font-medium transition-colors">
          View History
        </button>
      </div>

      {/* Dependent Reports Modal */}
      <Modal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        title={selectedMeasurement ? (calculatedMeasurements as any)[selectedMeasurement]?.label : 'Required Reports'}
        size="md"
      >
        {selectedMeasurement && (
          <div className="space-y-4">
            {(() => {
              const allDocs = getDependentDocuments(selectedMeasurement)
              const docsByType = allDocs.reduce((acc, doc) => {
                if (!acc[doc.document_type]) {
                  acc[doc.document_type] = []
                }
                acc[doc.document_type].push(doc)
                return acc
              }, {} as Record<string, typeof allDocs>)

              return Object.entries(docsByType).map(([docType, docs]) => {
                const sortedDocs = docs.sort((a, b) => new Date(b.date_of_test).getTime() - new Date(a.date_of_test).getTime())
                const currentDoc = sortedDocs[0]
                const historicalDocs = sortedDocs.slice(1)

                return (
                  <div key={docType} className="border border-envana-teal rounded-md p-3 bg-envana-sidebar">
                    <h4 className="font-semibold text-envana-brown text-sm mb-2">{currentDoc.display_name}</h4>

                    {/* Current/Most Recent Report */}
                    <div className="mb-2 pb-2 border-b border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-envana-teal">Current ({currentDoc.validity_period_text})</span>
                        {currentDoc.status === 'valid' ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-700 mt-1">
                        Test: {new Date(currentDoc.date_of_test).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })} |
                        Exp: {new Date(calculateValidUntil(currentDoc.date_of_test, currentDoc.validity_period_days)).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                      </p>
                    </div>

                    {/* Historical Reports */}
                    {historicalDocs.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Historical Reports:</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {historicalDocs.map((doc) => {
                            const testDate = new Date(doc.date_of_test).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
                            const expDate = new Date(calculateValidUntil(doc.date_of_test, doc.validity_period_days)).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
                            return (
                              <div key={doc.document_id} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                                Test: {testDate} | Exp: {expDate}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        )}
      </Modal>

      {/* Export Data Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Data"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Choose the type of data to export:</p>
          <button
            onClick={() => {
              alert('Exporting Raw Data...')
              setIsExportModalOpen(false)
            }}
            className="w-full bg-envana-coral hover:bg-envana-coral-dark text-white px-6 py-3 rounded-md font-medium transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Raw Data</p>
                <p className="text-sm opacity-90">Export unprocessed sensor data</p>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </button>
          <button
            onClick={() => {
              alert('Exporting Clean Data...')
              setIsExportModalOpen(false)
            }}
            className="w-full bg-envana-teal hover:bg-envana-teal-dark text-white px-6 py-3 rounded-md font-medium transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Clean Data</p>
                <p className="text-sm opacity-90">Export processed and validated data</p>
              </div>
              <span className="text-2xl">✨</span>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  )
}
