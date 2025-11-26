// Mock data for Monitoring Well Dashboard

export interface MonitoringComplianceDocument {
  document_id: number
  document_type: string
  display_name: string
  date_of_test: string
  validity_period_days: number
  validity_period_text: string
  status: 'valid' | 'expired'
  file_name?: string
}

export interface MonitoringMeasurementReading {
  label: string
  value: number
  unit: string
  calculation: 'average'
  is_valid: boolean
  required_documents: string[]
}

export interface MonitoringTimeSeriesData {
  timestamp: string
  tracer_detector: number
  co2_composition: number
  monitoring_pressure: number
  monitoring_temperature: number
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
): MonitoringComplianceDocument[] {
  const reports: MonitoringComplianceDocument[] = []
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
export const monitoringComplianceDocuments: MonitoringComplianceDocument[] = [
  ...generateHistoricalReports('tracer_detector_calibration', 'Tracer Detector Calibration Report', 90, '3 months'),
  ...generateHistoricalReports('gas_analyzer_calibration', 'Gas Analyzer Calibration Report', 90, '3 months'),
  ...generateHistoricalReports('pt_meter_calibration', 'P&T Transducer Calibration Report', 365, '1 Year'),
]

// Document dependencies for each measurement
export const MONITORING_MEASUREMENT_DEPENDENCIES: Record<string, string[]> = {
  tracer_detector: ['tracer_detector_calibration'],
  co2_composition: ['gas_analyzer_calibration'],
  monitoring_pressure: ['pt_meter_calibration'],
  monitoring_temperature: ['pt_meter_calibration'],
}

// Check if measurement is valid based on document status
export function isMonitoringMeasurementValid(
  measurementType: string,
  documents: MonitoringComplianceDocument[]
): boolean {
  const requiredDocs = MONITORING_MEASUREMENT_DEPENDENCIES[measurementType] || []
  return requiredDocs.every((docType) => {
    const doc = documents.find((d) => d.document_type === docType)
    return doc && doc.status === 'valid'
  })
}

// Mock measurement data
export const mockMonitoringMeasurements: Record<string, MonitoringMeasurementReading> = {
  tracer_detector: {
    label: 'Tracer Detector',
    value: 0.05,
    unit: 'ppm',
    calculation: 'average',
    is_valid: isMonitoringMeasurementValid('tracer_detector', monitoringComplianceDocuments),
    required_documents: MONITORING_MEASUREMENT_DEPENDENCIES.tracer_detector,
  },
  co2_composition: {
    label: 'CO2 Composition',
    value: 2.5,
    unit: '%',
    calculation: 'average',
    is_valid: isMonitoringMeasurementValid('co2_composition', monitoringComplianceDocuments),
    required_documents: MONITORING_MEASUREMENT_DEPENDENCIES.co2_composition,
  },
  monitoring_pressure: {
    label: 'Average Pressure',
    value: 85.3,
    unit: 'bar',
    calculation: 'average',
    is_valid: isMonitoringMeasurementValid('monitoring_pressure', monitoringComplianceDocuments),
    required_documents: MONITORING_MEASUREMENT_DEPENDENCIES.monitoring_pressure,
  },
  monitoring_temperature: {
    label: 'Avg Temp',
    value: 38.5,
    unit: '°C',
    calculation: 'average',
    is_valid: isMonitoringMeasurementValid('monitoring_temperature', monitoringComplianceDocuments),
    required_documents: MONITORING_MEASUREMENT_DEPENDENCIES.monitoring_temperature,
  },
}

// Generate mock time series data with smart granularity
export function generateMonitoringTimeSeries(days: number = 7): MonitoringTimeSeriesData[] {
  const data: MonitoringTimeSeriesData[] = []
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

  // Generate realistic data with trends and variations
  for (let i = numPoints; i >= 0; i--) {
    const hoursAgo = i * intervalHours
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

    // Add seasonal variations (based on time of year)
    const dayOfYear = timestamp.getDate() + timestamp.getMonth() * 30
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.1

    // Add daily variations (based on time of day)
    const hourOfDay = timestamp.getHours()
    const dailyFactor = Math.sin((hourOfDay / 24) * 2 * Math.PI) * 0.05

    // Base values with random variation, seasonal and daily patterns
    const baseTracerDetector = 0.05 // ppm
    const baseComposition = 2.5 // %
    const basePressure = 85 // bar
    const baseTemp = 38.5 // °C

    data.push({
      timestamp: timestamp.toISOString(),
      tracer_detector: baseTracerDetector * (1 + seasonalFactor * 0.5 + (Math.random() - 0.5) * 0.2),
      co2_composition: baseComposition + (Math.random() - 0.5) * 0.4,
      monitoring_pressure: basePressure * (1 + dailyFactor + (Math.random() - 0.5) * 0.08),
      monitoring_temperature: baseTemp + seasonalFactor * 3 + (Math.random() - 0.5) * 1.5,
    })
  }

  return data
}

// Generate 2 years of historical data (for dashboard initialization)
export const twoYearsMonitoringData = generateMonitoringTimeSeries(730)

export { calculateValidUntil }
