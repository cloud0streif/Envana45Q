// Mock data for Transport Node Dashboards

import { generateFacilityTimeSeries } from './facilities'

export interface TransportComplianceDocument {
  document_id: number
  document_type: string
  display_name: string
  date_of_test: string
  validity_period_days: number
  validity_period_text: string
  status: 'valid' | 'expired'
  file_name?: string
}

export interface TransportMeasurementReading {
  label: string
  value: number
  unit: string
  calculation: 'total' | 'average' | 'peak'
  is_valid: boolean
  required_documents: string[]
}

export interface TransportTimeSeriesData {
  timestamp: string
  co2_mass_flow?: number
  fluid_density?: number
  fluid_inlet_density?: number
  fluid_outlet_density?: number
  co2_composition?: number
  inlet_pressure?: number
  outlet_pressure?: number
  inlet_temperature?: number
  outlet_temperature?: number
  peak_temperature?: number
  peak_emission?: number
  max_vibration?: number
}

// Utility functions
function calculateValidUntil(testDate: string, days: number): string {
  const date = new Date(testDate)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// Generate historical calibration reports (2 years back)
// This function generates reports working backwards from today to ensure the most recent report is always valid
function generateHistoricalReports(
  baseDocuments: Omit<TransportComplianceDocument, 'document_id' | 'date_of_test' | 'status'>[]
): TransportComplianceDocument[] {
  const allReports: TransportComplianceDocument[] = []
  let documentId = 1
  const today = new Date()

  baseDocuments.forEach((docTemplate) => {
    const validityDays = docTemplate.validity_period_days
    const reports: TransportComplianceDocument[] = []

    // Calculate how many reports we need to cover 2 years
    const daysToGenerate = 2 * 365
    const numberOfReports = Math.ceil(daysToGenerate / validityDays) + 1

    // Generate reports working backwards from today
    for (let i = 0; i < numberOfReports; i++) {
      const daysBack = i * validityDays
      const testDate = new Date(today.getTime() - daysBack * 24 * 60 * 60 * 1000)
      const testDateStr = testDate.toISOString().split('T')[0]
      const validUntil = calculateValidUntil(testDateStr, validityDays)
      const status = new Date(validUntil) >= today ? 'valid' : 'expired'

      reports.push({
        ...docTemplate,
        document_id: documentId++,
        date_of_test: testDateStr,
        status,
        file_name: `${docTemplate.document_type}_${testDateStr}.pdf`,
      })
    }

    allReports.push(...reports)
  })

  return allReports
}

// Capture Plant Outlet & Injection Site Outlet Documents (with 2 years history)
const outletDocumentTemplates = [
  {
    document_type: 'coriolis_meter_calibration',
    display_name: 'Coriolis Meter Calibration Report',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
  {
    document_type: 'gas_analyzer_calibration',
    display_name: 'Gas Analyzer Calibration Report',
    validity_period_days: 90,
    validity_period_text: '3 months',
  },
  {
    document_type: 'pt_meter_calibration',
    display_name: 'P&T Transducer Calibration Report',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
]

export const outletDocuments: TransportComplianceDocument[] = generateHistoricalReports(outletDocumentTemplates)

// Pipeline Segment Documents (with 2 years history)
const pipelineDocumentTemplates = [
  {
    document_type: 'corrosion_monitoring_report',
    display_name: 'Corrosion Monitoring Report',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
  {
    document_type: 'das_calibration',
    display_name: 'Distributed Acoustic Sensing (DAS) Calibration',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
  {
    document_type: 'acoustic_emission_calibration',
    display_name: 'Acoustic Emission Sensors Calibration Report',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
  {
    document_type: 'dts_fiber_calibration',
    display_name: 'Distributed Temperature Sensing (DTS) Fiber Calibration',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
]

export const pipelineDocuments: TransportComplianceDocument[] = generateHistoricalReports(pipelineDocumentTemplates)

// Pump Station Documents (same as outlets)
export const pumpStationDocuments = outletDocuments

// Validation dependencies
export const OUTLET_DEPENDENCIES: Record<string, string[]> = {
  co2_mass_flow: ['coriolis_meter_calibration'],
  fluid_density: ['coriolis_meter_calibration'],
  co2_composition: ['gas_analyzer_calibration'],
  inlet_pressure: ['pt_meter_calibration'],
  inlet_temperature: ['pt_meter_calibration'],
}

export const PIPELINE_DEPENDENCIES: Record<string, string[]> = {
  peak_temperature: ['corrosion_monitoring_report', 'dts_fiber_calibration'],
  peak_emission: ['corrosion_monitoring_report', 'acoustic_emission_calibration'],
  max_vibration: ['corrosion_monitoring_report', 'das_calibration'],
}

export const PUMP_STATION_DEPENDENCIES: Record<string, string[]> = {
  co2_mass_flow: ['coriolis_meter_calibration'],
  fluid_inlet_density: ['coriolis_meter_calibration'],
  fluid_outlet_density: ['coriolis_meter_calibration'],
  co2_composition: ['gas_analyzer_calibration'],
  inlet_pressure: ['pt_meter_calibration'],
  inlet_temperature: ['pt_meter_calibration'],
  outlet_pressure: ['pt_meter_calibration'],
  outlet_temperature: ['pt_meter_calibration'],
}

// Validation check function
export function isTransportMeasurementValid(
  measurementType: string,
  documents: TransportComplianceDocument[],
  dependencies: Record<string, string[]>
): boolean {
  const requiredDocs = dependencies[measurementType] || []
  return requiredDocs.every((docType) => {
    const doc = documents.find((d) => d.document_type === docType)
    return doc && doc.status === 'valid'
  })
}

// Generate time series data for Capture Plant Outlet
// This pulls directly from the two AGRU facility outputs to ensure consistency
// Target: 1,250,000 t CO2 at capture outlet YTD (sum of both AGRU trains)
export function generateOutletTimeSeries(days: number = 7): TransportTimeSeriesData[] {
  // Get data from both AGRU facilities
  const train1Data = generateFacilityTimeSeries(days, 1) // AGRU Train #1
  const train2Data = generateFacilityTimeSeries(days, 2) // AGRU Train #2

  // Ensure both datasets have the same length
  const minLength = Math.min(train1Data.length, train2Data.length)

  // Combine the outputs from both facilities
  const data: TransportTimeSeriesData[] = []
  for (let i = 0; i < minLength; i++) {
    const point1 = train1Data[i]
    const point2 = train2Data[i]

    // Sum the CO2 outlet mass from both trains
    const combinedCO2Mass = point1.co2_outlet_mass + point2.co2_outlet_mass

    // Use averaged values for other properties with some variation
    const avgDensity = 0.85
    const avgComposition = 99.2
    const avgPressure = 125
    const avgTemperature = 42

    data.push({
      timestamp: point1.timestamp,
      co2_mass_flow: combinedCO2Mass,
      fluid_density: avgDensity * (1 + (Math.random() - 0.5) * 0.02),
      co2_composition: avgComposition + (Math.random() - 0.5) * 0.5,
      inlet_pressure: avgPressure * (1 + (Math.random() - 0.5) * 0.08),
      inlet_temperature: avgTemperature + (Math.random() - 0.5) * 2,
    })
  }

  return data
}

// Generate time series data for Injection Site Outlet
// Target: 1,248,750 t CO2 at injection site YTD (after 0.1% transport loss)
// YTD = 328 days from Jan 1 to Nov 24
// Daily: 1,248,750 t ÷ 328 days = 3,807.7743902 t/day
// Hourly: 3,807.7743902 t/day ÷ 24 hours = 158.6572662 t/hr
export function generateInjectionSiteOutletTimeSeries(days: number = 7): TransportTimeSeriesData[] {
  const data: TransportTimeSeriesData[] = []
  const now = new Date()

  let intervalHours: number
  if (days <= 1) intervalHours = 1
  else if (days <= 7) intervalHours = 2
  else if (days <= 30) intervalHours = 6
  else if (days <= 180) intervalHours = 24
  else intervalHours = 24 * 7

  const totalHours = days * 24
  const numPoints = Math.floor(totalHours / intervalHours)

  const co2Target = 158.6573 // tonnes per hour (precise to 4 decimals)

  for (let i = numPoints - 1; i >= 0; i--) {
    const hoursAgo = i * intervalHours
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

    const dayOfYear = timestamp.getDate() + timestamp.getMonth() * 30
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.1
    const hourOfDay = timestamp.getHours()
    const dailyFactor = Math.sin((hourOfDay / 24) * 2 * Math.PI) * 0.05

    // For YTD and longer periods, multiply by intervalHours to get total mass for the period
    // Use minimal variation to ensure totals match targets
    const randomVariation = days > 180 ? (Math.random() - 0.5) * 0.01 : (Math.random() - 0.5) * 0.1
    const massFlowRate = co2Target * (1 + seasonalFactor + dailyFactor + randomVariation)
    const totalMassForInterval = massFlowRate * intervalHours

    data.push({
      timestamp: timestamp.toISOString(),
      co2_mass_flow: totalMassForInterval,
      fluid_density: 0.85 * (1 + seasonalFactor * 0.5 + (Math.random() - 0.5) * 0.02),
      co2_composition: 99.2 + (Math.random() - 0.5) * 0.5,
      inlet_pressure: 125 * (1 + dailyFactor + (Math.random() - 0.5) * 0.08),
      inlet_temperature: 42 + seasonalFactor * 5 + (Math.random() - 0.5) * 2,
    })
  }

  return data
}

// Generate time series data for pump station
// Target: 1,249,375 t CO2 at pump station YTD (halfway through transport, half the loss)
// Total loss through transport: 1,250 t (0.1%)
// Loss before pump station: 625 t (half the total loss)
// YTD = 328 days from Jan 1 to Nov 24
// Daily: 1,249,375 t ÷ 328 days = 3,809.6798780 t/day
// Hourly: 3,809.6798780 t/day ÷ 24 hours = 158.7366616 t/hr
export function generatePumpStationTimeSeries(days: number = 7): TransportTimeSeriesData[] {
  const data: TransportTimeSeriesData[] = []
  const now = new Date()

  let intervalHours: number
  if (days <= 1) intervalHours = 1
  else if (days <= 7) intervalHours = 2
  else if (days <= 30) intervalHours = 6
  else if (days <= 180) intervalHours = 24
  else intervalHours = 24 * 7

  const totalHours = days * 24
  const numPoints = Math.floor(totalHours / intervalHours)

  const co2Target = 158.7367 // tonnes per hour (precise to 4 decimals)

  for (let i = numPoints - 1; i >= 0; i--) {
    const hoursAgo = i * intervalHours
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

    const dayOfYear = timestamp.getDate() + timestamp.getMonth() * 30
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.1
    const hourOfDay = timestamp.getHours()
    const dailyFactor = Math.sin((hourOfDay / 24) * 2 * Math.PI) * 0.05

    // For YTD and longer periods, multiply by intervalHours to get total mass for the period
    // Use minimal variation to ensure totals match targets
    const randomVariation = days > 180 ? (Math.random() - 0.5) * 0.01 : (Math.random() - 0.5) * 0.1
    const massFlowRate = co2Target * (1 + seasonalFactor + dailyFactor + randomVariation)
    const totalMassForInterval = massFlowRate * intervalHours

    data.push({
      timestamp: timestamp.toISOString(),
      co2_mass_flow: totalMassForInterval,
      fluid_inlet_density: 0.85 * (1 + seasonalFactor * 0.5 + (Math.random() - 0.5) * 0.02),
      fluid_outlet_density: 0.84 * (1 + seasonalFactor * 0.5 + (Math.random() - 0.5) * 0.02),
      co2_composition: 99.2 + (Math.random() - 0.5) * 0.5,
      inlet_pressure: 85 * (1 + dailyFactor + (Math.random() - 0.5) * 0.08),
      inlet_temperature: 38 + seasonalFactor * 5 + (Math.random() - 0.5) * 2,
      outlet_pressure: 126 * (1 + dailyFactor + (Math.random() - 0.5) * 0.08),
      outlet_temperature: 42 + seasonalFactor * 5 + (Math.random() - 0.5) * 2,
    })
  }

  return data
}

// Generate time series data for pipeline segments
export function generatePipelineTimeSeries(days: number = 7): TransportTimeSeriesData[] {
  const data: TransportTimeSeriesData[] = []
  const now = new Date()

  let intervalHours: number
  if (days <= 1) intervalHours = 1
  else if (days <= 7) intervalHours = 2
  else if (days <= 30) intervalHours = 6
  else if (days <= 180) intervalHours = 24
  else intervalHours = 24 * 7

  const totalHours = days * 24
  const numPoints = Math.floor(totalHours / intervalHours)

  for (let i = numPoints; i >= 0; i--) {
    const hoursAgo = i * intervalHours
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

    const dayOfYear = timestamp.getDate() + timestamp.getMonth() * 30
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.1
//     const hourOfDay = timestamp.getHours()
//     const dailyFactor = Math.sin((hourOfDay / 24) * 2 * Math.PI) * 0.05

    data.push({
      timestamp: timestamp.toISOString(),
      peak_temperature: 40 + seasonalFactor * 5 + (Math.random() - 0.5) * 3,
      peak_emission: 0.00 + Math.random() * 0.01,
      max_vibration: 0.12 + (Math.random() - 0.5) * 0.05,
    })
  }

  return data
}

export { calculateValidUntil }
