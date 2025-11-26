// Mock data for Capture Facilities

export interface CaptureFacility {
  facility_id: number
  facility_name: string
  technology_type: string
  capacity_tpd: number
  status: 'operational' | 'maintenance' | 'inactive'
  current_rate_tpd: number
  efficiency_percent: number
}

export interface CaptureCalibrationDocument {
  document_id: number
  document_type: string
  display_name: string
  date_of_test: string
  validity_period_days: number
  validity_period_text: string
  status: 'valid' | 'expired'
  file_name?: string
}

// Utility functions
function calculateValidUntil(testDate: string, days: number): string {
  const date = new Date(testDate)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// Generate historical calibration reports (2 years back)
function generateHistoricalReports(
  baseDocuments: Omit<CaptureCalibrationDocument, 'document_id' | 'date_of_test' | 'status'>[]
): CaptureCalibrationDocument[] {
  const allReports: CaptureCalibrationDocument[] = []
  let documentId = 1
  const today = new Date()
  const twoYearsAgo = new Date(today.getTime() - 2 * 365 * 24 * 60 * 60 * 1000)

  baseDocuments.forEach((docTemplate) => {
    const validityDays = docTemplate.validity_period_days
    const overlapDays = Math.floor(validityDays * 0.1) // 10% overlap to ensure continuous coverage

    // Start from 2 years ago and work forward
    let currentDate = new Date(twoYearsAgo)
    const reports: CaptureCalibrationDocument[] = []

    while (currentDate <= today) {
      const testDateStr = currentDate.toISOString().split('T')[0]
      const validUntil = calculateValidUntil(testDateStr, validityDays)
      const status = new Date(validUntil) >= today ? 'valid' : 'expired'

      reports.push({
        ...docTemplate,
        document_id: documentId++,
        date_of_test: testDateStr,
        status,
        file_name: `${docTemplate.document_type}_${testDateStr}.pdf`,
      })

      // Move to next test date (validity period minus overlap)
      currentDate = new Date(currentDate.getTime() + (validityDays - overlapDays) * 24 * 60 * 60 * 1000)
    }

    allReports.push(...reports)
  })

  return allReports
}

export { calculateValidUntil }

// Facility measurement metrics
export interface FacilityMeasurement {
  label: string
  value: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
}

export interface FacilityTimeSeriesData {
  timestamp: string
  sour_gas_inlet_mass: number
  sweet_gas_outlet_mass: number
  sweet_gas_ch4_content: number
  co2_outlet_mass: number
  co2_outlet_pressure: number
}

// Generate time series data for facility dashboards
// Target: 1,250,000 t CO2 captured YTD (combined between 2 AGRU trains)
// YTD = ~328 days from Jan 1 to Nov 24
// Train #1 target: 750,000 t ÷ 328 days = 2,286.59 t/day
// Train #2 target: 500,000 t ÷ 328 days = 1,524.39 t/day
export function generateFacilityTimeSeries(days: number, facilityId: number = 1): FacilityTimeSeriesData[] {
  const data: FacilityTimeSeriesData[] = []
  const now = new Date()

  // CO2 outlet targets based on facility (Train #1 = 60%, Train #2 = 40%)
  // These are DAILY totals (data points represent one day each)
  const co2DailyTarget = facilityId === 1 ? 2286.59 : 1524.39 // tonnes per day

  for (let i = days - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayOfYear = Math.floor((timestamp.getTime() - new Date(timestamp.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.05

    // Use minimal variation for YTD periods to ensure totals match targets
    const randomVariation = days > 180 ? (Math.random() - 0.5) * 0.01 : (Math.random() - 0.5) * 0.1
    const co2Output = co2DailyTarget * (1 + seasonalFactor + randomVariation)

    // Sour gas typically contains ~10% CO2, so inlet is ~10x the CO2 output
    const sourGasInlet = co2Output * 10 * (1 + (Math.random() - 0.5) * 0.05)

    // Sweet gas outlet is approximately sour gas inlet minus CO2 removed (with small losses)
    const sweetGasOutlet = sourGasInlet - co2Output * (1 + (Math.random() - 0.5) * 0.02)

    data.push({
      timestamp: timestamp.toISOString(),
      sour_gas_inlet_mass: Number(sourGasInlet.toFixed(1)),
      sweet_gas_outlet_mass: Number(sweetGasOutlet.toFixed(1)),
      sweet_gas_ch4_content: Number((85 + Math.random() * 10).toFixed(2)),
      co2_outlet_mass: Number(co2Output.toFixed(1)),
      co2_outlet_pressure: Number((120 + Math.random() * 20).toFixed(1)),
    })
  }

  return data
}

// Measurement dependencies mapping
export const FACILITY_MEASUREMENT_DEPENDENCIES: Record<string, string[]> = {
  sour_gas_inlet_mass: ['inlet_sour_gas_coriolis'],
  sweet_gas_outlet_mass: ['outlet_sweet_gas_coriolis'],
  sweet_gas_ch4_content: ['gas_analyzer_calibration'],
  co2_outlet_mass: ['co2_outlet_coriolis'],
  co2_outlet_pressure: ['pt_transducer_calibration'],
}

export const mockFacilityMeasurements: Record<string, FacilityMeasurement> = {
  sour_gas_inlet_mass: {
    label: 'Sour Gas Inlet Mass',
    value: 550,
    unit: 't',
    status: 'normal',
  },
  sweet_gas_outlet_mass: {
    label: 'Sweet Gas Outlet Mass (CH4)',
    value: 340,
    unit: 't',
    status: 'normal',
  },
  sweet_gas_ch4_content: {
    label: 'Sweet Gas CH4 Content',
    value: 90.5,
    unit: '%',
    status: 'normal',
  },
  co2_outlet_mass: {
    label: 'CO₂ Outlet Mass',
    value: 200,
    unit: 't',
    status: 'normal',
  },
  co2_outlet_pressure: {
    label: 'CO₂ Outlet Pressure',
    value: 130,
    unit: 'bar',
    status: 'normal',
  },
}

export const captureFacilities: CaptureFacility[] = [
  {
    facility_id: 1,
    facility_name: 'AGRU Train #1',
    technology_type: 'MEA Absorption',
    capacity_tpd: 25000,
    status: 'operational',
    current_rate_tpd: 2287,
    efficiency_percent: 90,
  },
  {
    facility_id: 2,
    facility_name: 'AGRU Train #2',
    technology_type: 'Membrane Separation',
    capacity_tpd: 25000,
    status: 'operational',
    current_rate_tpd: 1524,
    efficiency_percent: 92,
  },
]

// Capture Facility Calibration Documents (with 2 years history)
const captureDocumentTemplates = [
  {
    document_type: 'gas_analyzer_calibration',
    display_name: 'Gas Analyzer Calibration Report',
    validity_period_days: 90,
    validity_period_text: '3 months',
  },
  {
    document_type: 'inlet_sour_gas_coriolis',
    display_name: 'Inlet Sour Gas Coriolis Meter Calibration',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
  {
    document_type: 'outlet_sweet_gas_coriolis',
    display_name: 'Outlet Sweet Gas Coriolis Meter Calibration',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
  {
    document_type: 'co2_outlet_coriolis',
    display_name: 'CO2 Outlet Coriolis Meter Calibration',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
  {
    document_type: 'pt_transducer_calibration',
    display_name: 'P&T Transducer Calibration Report',
    validity_period_days: 365,
    validity_period_text: '1 Year',
  },
]

export const captureCalibrationDocuments: CaptureCalibrationDocument[] = generateHistoricalReports(captureDocumentTemplates)
