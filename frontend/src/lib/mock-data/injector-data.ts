// Mock data for Injector Well Dashboard

export interface ComplianceDocument {
  document_id: number
  document_type: string
  display_name: string
  date_of_test: string
  validity_period_days: number
  validity_period_text: string
  status: 'valid' | 'expired'
  file_name?: string
}

export interface MeasurementReading {
  label: string
  value: number
  unit: string
  calculation: 'total' | 'average'
  is_valid: boolean
  required_documents: string[]
}

export interface TimeSeriesData {
  timestamp: string
  co2_mass_injected: number
  fluid_density: number
  co2_composition: number
  injection_pressure: number
  injection_temperature: number
}

// Calculate valid_until date
function calculateValidUntil(testDate: string, days: number): string {
  const date = new Date(testDate)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// Check if document is valid
export function isDocumentValid(testDate: string, days: number): 'valid' | 'expired' {
  const validUntil = new Date(calculateValidUntil(testDate, days))
  const today = new Date()
  return validUntil >= today ? 'valid' : 'expired'
}

// Generate historical calibration reports going back 2 years
function generateHistoricalReports(
  documentType: string,
  displayName: string,
  validityDays: number,
  validityText: string,
  yearsBack: number = 2
): ComplianceDocument[] {
  const reports: ComplianceDocument[] = []
  const today = new Date()
  let documentId = 1

  // Calculate how many reports we need to cover the time period
  const daysToGenerate = yearsBack * 365
  const numberOfReports = Math.ceil(daysToGenerate / validityDays) + 1

  // Generate reports working backwards from today
  for (let i = 0; i < numberOfReports; i++) {
    const daysBack = i * validityDays
    const testDate = new Date(today.getTime() - daysBack * 24 * 60 * 60 * 1000)
    const testDateStr = testDate.toISOString().split('T')[0]
    const validUntil = calculateValidUntil(testDateStr, validityDays)
    const status = new Date(validUntil) >= today ? 'valid' : 'expired'

    reports.push({
      document_id: documentId++,
      document_type: documentType,
      display_name: displayName,
      date_of_test: testDateStr,
      validity_period_days: validityDays,
      validity_period_text: validityText,
      status: status as 'valid' | 'expired',
      file_name: `${documentType}_${testDate.getFullYear()}_${String(testDate.getMonth() + 1).padStart(2, '0')}.pdf`,
    })
  }

  return reports
}

// Generate all calibration documents with historical data
export const complianceDocuments: ComplianceDocument[] = [
  ...generateHistoricalReports('wellbore_integrity_log', 'Wellbore Integrity - Cased-hole Logging (Annually)', 365, '1 Year'),
  ...generateHistoricalReports('pressure_falloff_test', 'Pressure Fall off Test', 90, '3 months'),
  ...generateHistoricalReports('coriolis_meter_calibration', 'Coriolis Meter Calibration Report', 365, '1 Year'),
  ...generateHistoricalReports('gas_analyzer_calibration', 'Gas Analyzer Calibration Report', 90, '3 months'),
  ...generateHistoricalReports('pt_meter_calibration', 'P&T Transducer Calibration Report', 365, '1 Year'),
]

// Document dependencies for each measurement
export const MEASUREMENT_DEPENDENCIES: Record<string, string[]> = {
  co2_mass_injected: [
    'wellbore_integrity_log',
    'pressure_falloff_test',
    'coriolis_meter_calibration',
  ],
  fluid_density: [
    'wellbore_integrity_log',
    'pressure_falloff_test',
    'coriolis_meter_calibration',
  ],
  co2_composition: [
    'wellbore_integrity_log',
    'pressure_falloff_test',
    'gas_analyzer_calibration',
  ],
  injection_pressure: [
    'wellbore_integrity_log',
    'pressure_falloff_test',
    'pt_meter_calibration',
  ],
  injection_temperature: [
    'wellbore_integrity_log',
    'pressure_falloff_test',
    'pt_meter_calibration',
  ],
}

// Check if measurement is valid based on document status
export function isMeasurementValid(
  measurementType: string,
  documents: ComplianceDocument[]
): boolean {
  const requiredDocs = MEASUREMENT_DEPENDENCIES[measurementType] || []
  return requiredDocs.every((docType) => {
    const doc = documents.find((d) => d.document_type === docType)
    return doc && doc.status === 'valid'
  })
}

// Mock measurement data
export const mockMeasurements: Record<string, MeasurementReading> = {
  co2_mass_injected: {
    label: 'CO2 Mass Injected',
    value: 1234.5,
    unit: 't',
    calculation: 'total',
    is_valid: isMeasurementValid('co2_mass_injected', complianceDocuments),
    required_documents: MEASUREMENT_DEPENDENCIES.co2_mass_injected,
  },
  fluid_density: {
    label: 'Fluid Density',
    value: 0.85,
    unit: 'g/cm³',
    calculation: 'average',
    is_valid: isMeasurementValid('fluid_density', complianceDocuments),
    required_documents: MEASUREMENT_DEPENDENCIES.fluid_density,
  },
  co2_composition: {
    label: 'CO2 Composition',
    value: 98.5,
    unit: '% purity',
    calculation: 'average',
    is_valid: isMeasurementValid('co2_composition', complianceDocuments),
    required_documents: MEASUREMENT_DEPENDENCIES.co2_composition,
  },
  injection_pressure: {
    label: 'Avg Inj Pressure',
    value: 125.3,
    unit: 'bar',
    calculation: 'average',
    is_valid: isMeasurementValid('injection_pressure', complianceDocuments),
    required_documents: MEASUREMENT_DEPENDENCIES.injection_pressure,
  },
  injection_temperature: {
    label: 'Avg Temp',
    value: 45.2,
    unit: '°C',
    calculation: 'average',
    is_valid: isMeasurementValid('injection_temperature', complianceDocuments),
    required_documents: MEASUREMENT_DEPENDENCIES.injection_temperature,
  },
}

// Generate mock time series data with smart granularity
// Target: Based on Injection Site Inlet (1,248,750 t) minus 0.3% injection loss
// Injection loss: 1,248,750 × 0.003 = 3,746.25 t
// Total injected YTD: 1,248,750 - 3,746.25 = 1,245,003.75 t ≈ 1,245,004 t
// YTD = 328 days from Jan 1 to Nov 24
// Daily: 1,245,004 t ÷ 328 days = 3,795.7439 t/day
// Hourly total: 3,795.7439 t/day ÷ 24 hours = 158.1560 t/hr
// Well #1 (50%): 79.078 t/hr, Well #2 (50%): 79.078 t/hr
export function generateMockTimeSeries(days: number = 7, _wellId: number = 1): TimeSeriesData[] {
  const data: TimeSeriesData[] = []
  const now = new Date()

  // Determine data point interval based on time range
  let intervalHours: number
  if (days <= 1) {
    intervalHours = 1 // Hourly for 1 day
  } else if (days <= 7) {
    intervalHours = 2 // Every 2 hours for a week
  } else if (days <= 30) {
    intervalHours = 6 // Every 6 hours for a month
  } else if (days <= 180) {
    intervalHours = 24 // Daily for 6 months
  } else {
    intervalHours = 24 * 7 // Weekly for year+
  }

  const totalHours = days * 24
  const numPoints = Math.floor(totalHours / intervalHours)

  // CO2 injection target based on well (split 50/50 between wells)
  // Both wells have the same target
  const co2Target = 79.078 // tonnes per hour (same for both wells)

  // Generate realistic data with trends and variations
  for (let i = numPoints - 1; i >= 0; i--) {
    const hoursAgo = i * intervalHours
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

    // Add seasonal variations (based on time of year)
    const dayOfYear = timestamp.getDate() + timestamp.getMonth() * 30
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.1

    // Add daily variations (based on time of day)
    const hourOfDay = timestamp.getHours()
    const dailyFactor = Math.sin((hourOfDay / 24) * 2 * Math.PI) * 0.05

    // Use minimal variation for YTD periods to ensure totals match targets
    const randomVariation = days > 180 ? (Math.random() - 0.5) * 0.01 : (Math.random() - 0.5) * 0.1

    // Base values with random variation, seasonal and daily patterns
    const baseTemp = 45
    const basePressure = 125
    const baseDensity = 0.85
    const baseComposition = 98.5

    // For YTD and longer periods, multiply by intervalHours to get total mass for the period
    const massInjectionRate = co2Target * (1 + seasonalFactor + dailyFactor + randomVariation)
    const totalMassForInterval = massInjectionRate * intervalHours

    data.push({
      timestamp: timestamp.toISOString(),
      co2_mass_injected: totalMassForInterval,
      fluid_density: baseDensity * (1 + seasonalFactor * 0.5 + (Math.random() - 0.5) * 0.02),
      co2_composition: baseComposition + (Math.random() - 0.5) * 0.5,
      injection_pressure: basePressure * (1 + dailyFactor + (Math.random() - 0.5) * 0.08),
      injection_temperature: baseTemp + seasonalFactor * 5 + (Math.random() - 0.5) * 2,
    })
  }

  return data
}

// Generate 2 years of historical data (for dashboard initialization)
export const twoYearsData = generateMockTimeSeries(730)

export { calculateValidUntil }
