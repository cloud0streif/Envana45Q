# Injector IoT Dashboard - Detailed Specification

## Overview

This document specifies the design and functionality for the Injector Well IoT Dashboard, which displays real-time and historical injection data with integrated document validation and compliance tracking.

---

## Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  Injector Well #1 - IoT Dashboard              [Back] [Home] [User] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ Time Period: ○Day ○Week ○Month ○6 months ○Year ○YTD ○Custom   ││
│  │              From: [____] To: [____]                            ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│  │ CO2 Mass     │ │ Fluid        │ │ CO2          │ │ Avg Inj    ││
│  │ Injected     │ │ Density      │ │ Composition  │ │ Pressure   ││
│  │              │ │              │ │              │ │            ││
│  │ 1,234.5 t    │ │ 0.85 g/cm³   │ │ 98.5% purity │ │ 125.3 bar  ││
│  │              │ │              │ │              │ │            ││
│  │ ✅ Valid in  │ │ ✅ Valid in  │ │ ✅ Valid in  │ │ ❌ Not     ││
│  │   Period     │ │   Period     │ │   Period     │ │   Valid    ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘│
│                                                                      │
│  ┌──────────────┐                                                   │
│  │ Avg Temp     │                                                   │
│  │              │                                                   │
│  │ 45.2°C       │                                                   │
│  │              │                                                   │
│  │ ❌ Not Valid │                                                   │
│  │   in Period  │                                                   │
│  └──────────────┘                                                   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ ⭕ Data Received Through SCADA                                 ││
│  │ 📤 Upload Measurement Data [Browse CSV]                        ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                Chart of data over the selected period           ││
│  │                                                                  ││
│  │  Value │                                                        ││
│  │        │            ╱────────╲                                  ││
│  │        │         ╱──          ──╲                               ││
│  │        │      ╱──                ───╲                           ││
│  │        │   ╱──                       ──╲                        ││
│  │        │╱──                              ───                    ││
│  │        └────────────────────────────────────────────► Time     ││
│  │                                                                  ││
│  │  Legend: ─ CO2 Mass  ─ Density  ─ Composition  ─ Pressure     ││
│  │          ─ Temperature                                          ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ REQUIRED COMPLIANCE DOCUMENTS                                   ││
│  ├────────────────────────────────────────────────────────────────┤│
│  │                                                                  ││
│  │ 📄 Wellbore Integrity - Cased-hole Logging (Annually)          ││
│  │    Date of Test: [11/20/2025]                                  ││
│  │    Valid Until: Date of Test + 1 Year                          ││
│  │    Status: ✅ Valid                        [Upload]            ││
│  │                                                                  ││
│  │ 📄 Pressure Fall off Test                                       ││
│  │    Date of Test: [11/20/2025]                                  ││
│  │    Valid Until: Date of Test + 3 months                        ││
│  │    Status: ✅ Valid                        [Upload]            ││
│  │                                                                  ││
│  │ 📄 Coriolis Meter Calibration Report                            ││
│  │    Date of Test: [11/20/2025]                                  ││
│  │    Valid Until: Date of Test + 1 Year                          ││
│  │    Status: ✅ Valid                        [Upload]            ││
│  │                                                                  ││
│  │ 📄 Gas Analyzer Calibration Report                              ││
│  │    Date of Test: [11/20/2025]                                  ││
│  │    Valid Until: Date of Test + 3 months                        ││
│  │    Status: ✅ Valid                        [Upload]            ││
│  │                                                                  ││
│  │ 📄 P & T Meter Calibration Report                               ││
│  │    Date of Test: [11/20/2025]                                  ││
│  │    Valid Until: Date of Test + 1 Year                          ││
│  │    Status: ❌ Expired                      [Upload]            ││
│  │                                                                  ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Time Period Selector

**Location:** Top of page, full width

**Radio Button Options:**
- `Day` - Last 24 hours
- `Week` - Last 7 days
- `Month` - Last 30 days
- `6 months` - Last 180 days
- `Year` - Last 365 days
- `YTD` - Year to date (Jan 1 to current date)
- `Custom` - Opens date range picker

**Custom Date Range:**
- When "Custom" is selected, show two date inputs:
  - `From:` [Date Picker]
  - `To:` [Date Picker]
- Max range: 5 years
- Min range: 1 day

**Behavior:**
- Default selection: `Week`
- Auto-refresh data when selection changes
- Persist selection in session storage

---

### 2. Meter Readings Section

#### 2.1 CO2 Mass Injected

**Display:**
- **Label:** "CO2 Mass Injected"
- **Value Type:** Total (cumulative over selected period)
- **Unit:** tonnes (t)
- **Example:** "1,234.5 t"
- **Decimal Places:** 1

**Validation Status:**
- **Valid Criteria:** All three documents valid in selected period:
  - ✅ Wellbore Integrity - Cased-hole Logging
  - ✅ Pressure Fall off Test
  - ✅ Coriolis Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green checkmark) - All documents valid
  - ❌ "Not Valid in Period" (red X) - Any document expired/missing

**Dependencies:**
```javascript
{
  "measurement": "co2_mass_injected",
  "calculation": "total",
  "required_documents": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "coriolis_meter_calibration"
  ]
}
```

---

#### 2.2 Fluid Density

**Display:**
- **Label:** "Fluid Density"
- **Value Type:** Average over selected period
- **Unit:** g/cm³
- **Example:** "0.85 g/cm³"
- **Decimal Places:** 2

**Validation Status:**
- **Valid Criteria:** All three documents valid:
  - ✅ Wellbore Integrity - Cased-hole Logging
  - ✅ Pressure Fall off Test
  - ✅ Coriolis Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "fluid_density",
  "calculation": "average",
  "required_documents": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "coriolis_meter_calibration"
  ]
}
```

---

#### 2.3 CO2 Composition

**Display:**
- **Label:** "CO2 Composition"
- **Value Type:** Average over selected period
- **Unit:** % purity
- **Example:** "98.5% purity"
- **Decimal Places:** 1

**Validation Status:**
- **Valid Criteria:** All three documents valid:
  - ✅ Wellbore Integrity - Cased-hole Logging
  - ✅ Pressure Fall off Test
  - ✅ Gas Analyzer Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "co2_composition",
  "calculation": "average",
  "required_documents": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "gas_analyzer_calibration"
  ]
}
```

---

#### 2.4 Average Injection Pressure

**Display:**
- **Label:** "Avg Inj Pressure"
- **Value Type:** Average over selected period
- **Unit:** bar
- **Example:** "125.3 bar"
- **Decimal Places:** 1

**Validation Status:**
- **Valid Criteria:** All three documents valid:
  - ✅ Wellbore Integrity - Cased-hole Logging
  - ✅ Pressure Fall off Test
  - ✅ P & T Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "injection_pressure",
  "calculation": "average",
  "required_documents": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "pt_meter_calibration"
  ]
}
```

---

#### 2.5 Average Temperature

**Display:**
- **Label:** "Avg Temp"
- **Value Type:** Average over selected period
- **Unit:** °C
- **Example:** "45.2°C"
- **Decimal Places:** 1

**Validation Status:**
- **Valid Criteria:** All three documents valid:
  - ✅ Wellbore Integrity - Cased-hole Logging
  - ✅ Pressure Fall off Test
  - ✅ P & T Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "injection_temperature",
  "calculation": "average",
  "required_documents": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "pt_meter_calibration"
  ]
}
```

---

### 3. Data Source Selection

**Two mutually exclusive options:**

#### Option A: SCADA Integration (Radio Button)
```
⭕ Data Received Through SCADA
```
- When selected: Automatically fetch data from SQL database
- Display "Last Updated: [timestamp]"
- Auto-refresh every 60 seconds
- Show connection status indicator

#### Option B: Manual CSV Upload (Radio Button + File Input)
```
📤 Upload Measurement Data [Browse CSV]
```
- When selected: Enable file upload button
- Accepted format: CSV only
- Required CSV columns:
  - `timestamp` (ISO 8601 format)
  - `co2_mass_injected` (tonnes)
  - `fluid_density` (g/cm³)
  - `co2_composition` (%)
  - `injection_pressure` (bar)
  - `injection_temperature` (°C)

**CSV Example:**
```csv
timestamp,co2_mass_injected,fluid_density,co2_composition,injection_pressure,injection_temperature
2025-01-15T08:00:00Z,150.5,0.85,98.5,125.3,45.2
2025-01-15T09:00:00Z,151.2,0.84,98.6,126.1,45.5
```

**Upload Process:**
1. User clicks "Browse CSV"
2. File dialog opens
3. User selects CSV file
4. System validates CSV structure
5. If valid: Parse and store data, refresh display
6. If invalid: Show error message with specific issues

---

### 4. Data Visualization Chart

**Chart Type:** Multi-line time series chart

**Chart Area:** Full width, height ~400px

**X-Axis:**
- **Label:** "Time"
- **Format:** Based on selected time period
  - Day: HH:MM
  - Week: MMM DD
  - Month/6 months: MMM DD
  - Year/YTD: MMM YYYY
  - Custom: Dynamic based on range

**Y-Axis:**
- **Dual Y-Axes:**
  - Left: CO2 Mass (tonnes), Pressure (bar)
  - Right: Temperature (°C), Density (g/cm³), Composition (%)
- **Auto-scale:** Based on data range with 10% padding

**Data Series:**
1. CO2 Mass Injected - Blue line, 2px
2. Fluid Density - Green line, 2px
3. CO2 Composition - Orange line, 2px
4. Injection Pressure - Red line, 2px
5. Injection Temperature - Purple line, 2px

**Legend:**
- Position: Below chart
- Format: Horizontal, color-coded
- Interactive: Click to show/hide series

**Tooltips:**
- On hover: Show all values at that timestamp
- Format:
  ```
  Time: Jan 15, 2025 08:00
  CO2 Mass: 150.5 t
  Density: 0.85 g/cm³
  Composition: 98.5%
  Pressure: 125.3 bar
  Temperature: 45.2°C
  ```

**Interactions:**
- Zoom: Mouse wheel or pinch gesture
- Pan: Click and drag
- Reset: Double-click or reset button
- Export: Download as PNG/SVG

---

### 5. Compliance Documents Section

#### Document 1: Wellbore Integrity - Cased-hole Logging

**Document Details:**
- **Full Name:** "Wellbore Integrity - Cased-hole Logging (Annually)"
- **Test Frequency:** Annual
- **Validity Period:** Date of Test + 1 Year

**Form Fields:**
```
┌──────────────────────────────────────────────────────────┐
│ 📄 Wellbore Integrity - Cased-hole Logging (Annually)   │
│                                                           │
│ Date of Test: [11/20/2025] 📅                           │
│ Valid Until: 11/20/2026 (Calculated)                    │
│ Status: ✅ Valid                                         │
│                                            [Upload]      │
└──────────────────────────────────────────────────────────┘
```

**Fields:**
- `Date of Test`: Date picker input
- `Valid Until`: Auto-calculated (read-only) = Date of Test + 365 days
- `Status`: Auto-calculated badge
  - ✅ Valid (green) - If Valid Until > Current Date
  - ❌ Expired (red) - If Valid Until ≤ Current Date
- `Upload`: Button to upload document file

**Affects Measurements:**
- CO2 Mass Injected
- Fluid Density
- CO2 Composition
- Injection Pressure
- Injection Temperature

---

#### Document 2: Pressure Fall off Test

**Document Details:**
- **Full Name:** "Pressure Fall off Test"
- **Test Frequency:** Quarterly
- **Validity Period:** Date of Test + 3 Months

**Form Fields:**
```
┌──────────────────────────────────────────────────────────┐
│ 📄 Pressure Fall off Test                                │
│                                                           │
│ Date of Test: [11/20/2025] 📅                           │
│ Valid Until: 02/20/2026 (Calculated)                    │
│ Status: ✅ Valid                                         │
│                                            [Upload]      │
└──────────────────────────────────────────────────────────┘
```

**Fields:**
- `Date of Test`: Date picker input
- `Valid Until`: Auto-calculated = Date of Test + 90 days
- `Status`: Auto-calculated
  - ✅ Valid (green)
  - ❌ Expired (red)
- `Upload`: Button to upload document

**Affects Measurements:**
- CO2 Mass Injected
- Fluid Density
- CO2 Composition
- Injection Pressure
- Injection Temperature

---

#### Document 3: Coriolis Meter Calibration Report

**Document Details:**
- **Full Name:** "Coriolis Meter Calibration Report"
- **Test Frequency:** Annual
- **Validity Period:** Date of Test + 1 Year

**Form Fields:**
```
┌──────────────────────────────────────────────────────────┐
│ 📄 Coriolis Meter Calibration Report                     │
│                                                           │
│ Date of Test: [11/20/2025] 📅                           │
│ Valid Until: 11/20/2026 (Calculated)                    │
│ Status: ✅ Valid                                         │
│                                            [Upload]      │
└──────────────────────────────────────────────────────────┘
```

**Fields:**
- `Date of Test`: Date picker input
- `Valid Until`: Auto-calculated = Date of Test + 365 days
- `Status`: Auto-calculated
- `Upload`: Button to upload document

**Affects Measurements:**
- CO2 Mass Injected
- Fluid Density

---

#### Document 4: Gas Analyzer Calibration Report

**Document Details:**
- **Full Name:** "Gas Analyzer Calibration Report"
- **Test Frequency:** Quarterly
- **Validity Period:** Date of Test + 3 Months

**Form Fields:**
```
┌──────────────────────────────────────────────────────────┐
│ 📄 Gas Analyzer Calibration Report                       │
│                                                           │
│ Date of Test: [11/20/2025] 📅                           │
│ Valid Until: 02/20/2026 (Calculated)                    │
│ Status: ✅ Valid                                         │
│                                            [Upload]      │
└──────────────────────────────────────────────────────────┘
```

**Fields:**
- `Date of Test`: Date picker input
- `Valid Until`: Auto-calculated = Date of Test + 90 days
- `Status`: Auto-calculated
- `Upload`: Button to upload document

**Affects Measurements:**
- CO2 Composition

---

#### Document 5: P & T Meter Calibration Report

**Document Details:**
- **Full Name:** "P & T Meter Calibration Report"
- **Test Frequency:** Annual
- **Validity Period:** Date of Test + 1 Year

**Form Fields:**
```
┌──────────────────────────────────────────────────────────┐
│ 📄 P & T Meter Calibration Report                        │
│                                                           │
│ Date of Test: [11/20/2025] 📅                           │
│ Valid Until: 11/20/2026 (Calculated)                    │
│ Status: ❌ Expired                                       │
│                                            [Upload]      │
└──────────────────────────────────────────────────────────┘
```

**Fields:**
- `Date of Test`: Date picker input
- `Valid Until`: Auto-calculated = Date of Test + 365 days
- `Status`: Auto-calculated
- `Upload`: Button to upload document

**Affects Measurements:**
- Injection Pressure
- Injection Temperature

---

## Validation Logic

### Document Validation Algorithm

For each document, check validity against the selected time period:

```javascript
function isDocumentValidInPeriod(document, selectedPeriod) {
  const testDate = document.date_of_test;
  const validUntil = document.valid_until;
  const periodStart = selectedPeriod.start;
  const periodEnd = selectedPeriod.end;
  
  // Document must be valid for the ENTIRE selected period
  return testDate <= periodStart && validUntil >= periodEnd;
}
```

### Measurement Validation Algorithm

For each measurement, check if all required documents are valid:

```javascript
function isMeasurementValid(measurement, documents, selectedPeriod) {
  const requiredDocs = MEASUREMENT_DEPENDENCIES[measurement];
  
  return requiredDocs.every(docType => {
    const doc = documents[docType];
    return doc && isDocumentValidInPeriod(doc, selectedPeriod);
  });
}
```

### Document Dependencies Matrix

```javascript
const MEASUREMENT_DEPENDENCIES = {
  "co2_mass_injected": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "coriolis_meter_calibration"
  ],
  "fluid_density": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "coriolis_meter_calibration"
  ],
  "co2_composition": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "gas_analyzer_calibration"
  ],
  "injection_pressure": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "pt_meter_calibration"
  ],
  "injection_temperature": [
    "wellbore_integrity_log",
    "pressure_falloff_test",
    "pt_meter_calibration"
  ]
};
```

### Document Validity Periods

```javascript
const DOCUMENT_VALIDITY_PERIODS = {
  "wellbore_integrity_log": {
    "duration": 365, // days
    "unit": "1 Year"
  },
  "pressure_falloff_test": {
    "duration": 90, // days
    "unit": "3 months"
  },
  "coriolis_meter_calibration": {
    "duration": 365, // days
    "unit": "1 Year"
  },
  "gas_analyzer_calibration": {
    "duration": 90, // days
    "unit": "3 months"
  },
  "pt_meter_calibration": {
    "duration": 365, // days
    "unit": "1 Year"
  }
};
```

---

## Data Model

### Database Tables

#### injection_measurements
```sql
CREATE TABLE injection_measurements (
    measurement_id SERIAL PRIMARY KEY,
    well_id INTEGER REFERENCES wells(well_id),
    timestamp TIMESTAMPTZ NOT NULL,
    co2_mass_injected DECIMAL(10, 2), -- tonnes
    fluid_density DECIMAL(6, 4), -- g/cm³
    co2_composition DECIMAL(5, 2), -- % purity
    injection_pressure DECIMAL(7, 2), -- bar
    injection_temperature DECIMAL(5, 2), -- °C
    data_source VARCHAR(20), -- 'scada' or 'manual'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('injection_measurements', 'timestamp');

-- Index for well_id queries
CREATE INDEX idx_injection_well_time ON injection_measurements(well_id, timestamp DESC);
```

#### compliance_documents
```sql
CREATE TABLE compliance_documents (
    document_id SERIAL PRIMARY KEY,
    well_id INTEGER REFERENCES wells(well_id),
    document_type VARCHAR(50) NOT NULL,
    -- Types: 'wellbore_integrity_log', 'pressure_falloff_test',
    --        'coriolis_meter_calibration', 'gas_analyzer_calibration',
    --        'pt_meter_calibration'
    date_of_test DATE NOT NULL,
    valid_until DATE NOT NULL, -- Calculated: date_of_test + validity_period
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size_kb INTEGER,
    uploaded_by INTEGER REFERENCES users(user_id),
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20), -- 'valid', 'expired', 'pending'
    notes TEXT
);

-- Index for validation queries
CREATE INDEX idx_compliance_well_type ON compliance_documents(well_id, document_type);
CREATE INDEX idx_compliance_validity ON compliance_documents(valid_until);
```

#### measurement_validations
```sql
CREATE TABLE measurement_validations (
    validation_id SERIAL PRIMARY KEY,
    well_id INTEGER REFERENCES wells(well_id),
    measurement_type VARCHAR(50),
    -- Types: 'co2_mass_injected', 'fluid_density', 'co2_composition',
    --        'injection_pressure', 'injection_temperature'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    is_valid BOOLEAN NOT NULL,
    missing_documents TEXT[], -- Array of missing/expired document types
    validated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for period queries
CREATE INDEX idx_validation_period ON measurement_validations(well_id, period_start, period_end);
```

---

## API Endpoints

### Measurement Data

#### Get Injection Data
```
GET /api/sequestration/wells/:well_id/measurements

Query Parameters:
- period: 'day' | 'week' | 'month' | '6months' | 'year' | 'ytd' | 'custom'
- start_date: ISO 8601 date (required if period='custom')
- end_date: ISO 8601 date (required if period='custom')

Response:
{
  "well_id": 1,
  "period": {
    "start": "2025-01-08T00:00:00Z",
    "end": "2025-01-15T23:59:59Z"
  },
  "measurements": {
    "co2_mass_injected": {
      "value": 1234.5,
      "unit": "tonnes",
      "calculation": "total",
      "is_valid": true
    },
    "fluid_density": {
      "value": 0.85,
      "unit": "g/cm³",
      "calculation": "average",
      "is_valid": true
    },
    "co2_composition": {
      "value": 98.5,
      "unit": "% purity",
      "calculation": "average",
      "is_valid": true
    },
    "injection_pressure": {
      "value": 125.3,
      "unit": "bar",
      "calculation": "average",
      "is_valid": false,
      "missing_documents": ["pt_meter_calibration"]
    },
    "injection_temperature": {
      "value": 45.2,
      "unit": "°C",
      "calculation": "average",
      "is_valid": false,
      "missing_documents": ["pt_meter_calibration"]
    }
  },
  "time_series": [
    {
      "timestamp": "2025-01-08T08:00:00Z",
      "co2_mass_injected": 150.5,
      "fluid_density": 0.85,
      "co2_composition": 98.5,
      "injection_pressure": 125.3,
      "injection_temperature": 45.2
    },
    // ... more data points
  ]
}
```

#### Upload CSV Data
```
POST /api/sequestration/wells/:well_id/measurements/upload

Content-Type: multipart/form-data

Body:
- file: CSV file

Response:
{
  "success": true,
  "records_imported": 1440,
  "period_covered": {
    "start": "2025-01-01T00:00:00Z",
    "end": "2025-01-15T23:59:59Z"
  },
  "errors": []
}
```

### Compliance Documents

#### Get Documents for Well
```
GET /api/sequestration/wells/:well_id/documents

Response:
{
  "well_id": 1,
  "documents": [
    {
      "document_id": 1,
      "document_type": "wellbore_integrity_log",
      "display_name": "Wellbore Integrity - Cased-hole Logging (Annually)",
      "date_of_test": "2025-11-20",
      "valid_until": "2026-11-20",
      "validity_period": "1 Year",
      "status": "valid",
      "file_name": "wellbore_integrity_2025.pdf",
      "file_path": "/documents/well-1/wellbore_integrity_2025.pdf",
      "uploaded_at": "2025-11-20T10:00:00Z"
    },
    // ... other documents
  ]
}
```

#### Upload Document
```
POST /api/sequestration/wells/:well_id/documents

Content-Type: multipart/form-data

Body:
- document_type: 'wellbore_integrity_log' | 'pressure_falloff_test' | 
                 'coriolis_meter_calibration' | 'gas_analyzer_calibration' | 
                 'pt_meter_calibration'
- date_of_test: ISO 8601 date
- file: Document file (PDF, DOCX, etc.)
- notes: Optional text

Response:
{
  "success": true,
  "document_id": 5,
  "document_type": "pt_meter_calibration",
  "date_of_test": "2025-01-15",
  "valid_until": "2026-01-15",
  "status": "valid"
}
```

#### Update Document Date
```
PUT /api/sequestration/wells/:well_id/documents/:document_id

Body:
{
  "date_of_test": "2025-01-15"
}

Response:
{
  "success": true,
  "document_id": 5,
  "date_of_test": "2025-01-15",
  "valid_until": "2026-01-15",
  "status": "valid"
}
```

### Validation

#### Check Measurement Validity
```
GET /api/sequestration/wells/:well_id/validate

Query Parameters:
- period: 'day' | 'week' | 'month' | '6months' | 'year' | 'ytd' | 'custom'
- start_date: ISO 8601 date (if custom)
- end_date: ISO 8601 date (if custom)

Response:
{
  "well_id": 1,
  "period": {
    "start": "2025-01-08T00:00:00Z",
    "end": "2025-01-15T23:59:59Z"
  },
  "validations": {
    "co2_mass_injected": {
      "is_valid": true,
      "required_documents": [
        {
          "type": "wellbore_integrity_log",
          "status": "valid",
          "valid_until": "2026-11-20"
        },
        {
          "type": "pressure_falloff_test",
          "status": "valid",
          "valid_until": "2026-02-20"
        },
        {
          "type": "coriolis_meter_calibration",
          "status": "valid",
          "valid_until": "2026-11-20"
        }
      ]
    },
    "injection_pressure": {
      "is_valid": false,
      "required_documents": [
        {
          "type": "wellbore_integrity_log",
          "status": "valid",
          "valid_until": "2026-11-20"
        },
        {
          "type": "pressure_falloff_test",
          "status": "valid",
          "valid_until": "2026-02-20"
        },
        {
          "type": "pt_meter_calibration",
          "status": "expired",
          "valid_until": "2025-01-01"
        }
      ]
    }
    // ... other measurements
  }
}
```

---

## User Interactions & Behaviors

### 1. Initial Page Load
1. Default time period: "Week"
2. Fetch measurement data for last 7 days
3. Fetch all compliance documents
4. Calculate validation status for each measurement
5. Render meter readings with validation badges
6. Render chart with data
7. Render document section with current status

### 2. Changing Time Period
1. User selects different time period radio button
2. If "Custom" selected, show date range pickers
3. Fetch new measurement data for selected period
4. Recalculate validation status for new period
5. Update meter readings
6. Update validation badges
7. Re-render chart with new data
8. Smooth transition animation

### 3. Uploading CSV Data
1. User selects "Upload Measurement Data" radio button
2. User clicks "Browse CSV" button
3. File dialog opens
4. User selects CSV file
5. Frontend validates CSV format
6. If valid: Show progress indicator
7. Upload to backend
8. Backend validates and imports data
9. Refresh page data
10. Show success message with import summary
11. If invalid: Show error dialog with specific issues

### 4. Uploading Compliance Document
1. User clicks "Upload" button for specific document
2. Modal opens with form:
   - Document type (pre-filled, read-only)
   - Date of test (date picker)
   - File upload (drag-drop or browse)
   - Optional notes
3. User fills form and uploads file
4. Backend validates file (size, type)
5. Calculate valid_until date automatically
6. Store document metadata in database
7. Store file in file system or S3
8. Close modal
9. Refresh document list
10. Recalculate validation status for affected measurements
11. Update validation badges
12. Show success notification

### 5. Updating Document Date
1. User clicks date field for existing document
2. Date picker opens
3. User selects new date
4. Auto-calculate new valid_until date
5. Update database
6. Recalculate validation status
7. Update validation badges
8. Show success notification

### 6. Real-time SCADA Updates (if selected)
1. User selects "Data Received Through SCADA" radio
2. WebSocket connection established
3. Every 60 seconds (or on data push):
   - Receive new measurement data
   - Update database
   - Update meter readings (animate value change)
   - Add new point to chart (smooth transition)
   - Show "Last Updated: [timestamp]"
4. If connection lost: Show warning indicator
5. Attempt reconnection every 30 seconds

---

## Visual Design Guidelines

### Color Scheme

**Validation Status:**
- Valid (Green): `#10B981` (emerald-500)
- Invalid/Expired (Red): `#EF4444` (red-500)
- Warning (Yellow): `#F59E0B` (amber-500)

**Chart Colors:**
- CO2 Mass: `#3B82F6` (blue-500)
- Fluid Density: `#10B981` (green-500)
- CO2 Composition: `#F97316` (orange-500)
- Injection Pressure: `#EF4444` (red-500)
- Injection Temperature: `#8B5CF6` (purple-500)

**Background:**
- Page background: `#F9FAFB` (gray-50)
- Card background: `#FFFFFF` (white)
- Chart background: `#FFFFFF` (white)

### Typography

**Headings:**
- Page title: 24px, bold
- Section title: 18px, semibold
- Meter label: 14px, medium
- Document name: 14px, medium

**Body:**
- Meter value: 32px, bold
- Validation badge: 12px, medium
- Chart labels: 12px, regular
- Document details: 13px, regular

### Spacing

**Meter Cards:**
- Width: 200px
- Height: 180px
- Padding: 16px
- Gap between cards: 16px
- Border radius: 8px
- Box shadow: 0 1px 3px rgba(0,0,0,0.1)

**Document Rows:**
- Padding: 16px
- Gap between rows: 12px
- Border: 1px solid #E5E7EB

### Icons

- Valid checkmark: ✅ or use Font Awesome `fa-check-circle`
- Invalid X: ❌ or use Font Awesome `fa-times-circle`
- Document: 📄 or use Font Awesome `fa-file-alt`
- Upload: 📤 or use Font Awesome `fa-upload`
- Calendar: 📅 or use Font Awesome `fa-calendar`
- Radio selected: ⭕ or custom styled radio button

---

## Error Handling

### CSV Upload Errors

**Missing Required Columns:**
```
Error: CSV file is missing required columns.
Required: timestamp, co2_mass_injected, fluid_density, co2_composition, 
          injection_pressure, injection_temperature
Found: timestamp, co2_mass_injected, fluid_density
```

**Invalid Data Format:**
```
Error: Invalid data format in row 5.
Column: injection_pressure
Expected: numeric value (e.g., 125.3)
Found: "N/A"
```

**Date Out of Range:**
```
Error: Timestamps in CSV exceed maximum allowed date range.
CSV range: 2020-01-01 to 2025-12-31
Maximum allowed: 5 years
```

### Document Upload Errors

**File Too Large:**
```
Error: File size exceeds maximum allowed size.
Maximum: 50 MB
File size: 75 MB
```

**Invalid File Type:**
```
Error: Invalid file type.
Allowed: PDF, DOCX, XLSX, PNG, JPG
Received: .exe
```

**Missing Date:**
```
Error: Date of test is required.
Please select a date before uploading.
```

### Validation Errors

**No Documents Found:**
```
Warning: No compliance documents found for this well.
All measurements will be marked as "Not Valid in Period".
Please upload required documents to validate measurements.
```

**Document Expired:**
```
Warning: The following document has expired:
- P & T Meter Calibration Report (expired on 01/01/2025)

Affected measurements:
- Injection Pressure
- Injection Temperature

Please upload a new calibration report.
```

---

## Accessibility

### ARIA Labels

```html
<button aria-label="Upload Wellbore Integrity document">Upload</button>
<input type="date" aria-label="Date of wellbore integrity test" />
<div role="status" aria-live="polite">Last updated: 2 minutes ago</div>
```

### Keyboard Navigation

- Tab order: Time period → Meter cards → Data source → Chart → Documents
- Enter/Space: Activate buttons and radio buttons
- Arrow keys: Navigate chart with keyboard
- Escape: Close modals

### Screen Reader Support

- Announce validation status changes
- Announce chart data on focus
- Announce upload progress
- Announce errors clearly

---

## Performance Considerations

### Data Aggregation

**For large time periods (6 months, year, YTD):**
- Pre-aggregate data in database
- Use materialized views for common queries
- Cache aggregated results for 5 minutes

**Chart Rendering:**
- Limit chart points to 1000 max
- Downsample data for long periods
- Use canvas-based chart library (Chart.js or Plotly)

### Real-time Updates

**SCADA data streaming:**
- Use WebSocket for push updates
- Throttle updates to max 1 per second
- Buffer updates and batch process
- Debounce chart re-renders

### File Uploads

**CSV Processing:**
- Stream large CSV files (don't load entire file in memory)
- Process in chunks of 1000 rows
- Show progress indicator
- Allow cancellation

**Document Storage:**
- Compress PDFs before storage
- Generate thumbnails for preview
- Use CDN for document delivery

---

## Testing Scenarios

### Functional Tests

1. **Time Period Selection**
   - Select each time period option
   - Verify correct data is loaded
   - Test custom date range with edge cases

2. **Measurement Calculations**
   - Verify totals are calculated correctly
   - Verify averages are calculated correctly
   - Test with missing data points

3. **Validation Logic**
   - Test each document dependency
   - Test with expired documents
   - Test with missing documents
   - Test edge case: document expires mid-period

4. **CSV Upload**
   - Upload valid CSV
   - Upload CSV with missing columns
   - Upload CSV with invalid data
   - Upload very large CSV (10k+ rows)

5. **Document Upload**
   - Upload each document type
   - Upload oversized file
   - Upload invalid file type
   - Update document date

6. **SCADA Integration**
   - Connect to SCADA data source
   - Test real-time updates
   - Test connection loss
   - Test reconnection

### Edge Cases

1. **No Data Available**
   - Display empty state
   - Show helpful message

2. **Partial Data**
   - Some measurements missing
   - Handle gracefully in calculations

3. **All Documents Expired**
   - All measurements invalid
   - Show warning banner

4. **Concurrent Updates**
   - Multiple users uploading simultaneously
   - Handle race conditions

5. **Time Zone Issues**
   - UTC storage and conversion
   - Display in user's local time zone

---

## Implementation Notes

### Frontend Framework Recommendation

**React + TypeScript:**
```typescript
interface MeasurementData {
  co2_mass_injected: number;
  fluid_density: number;
  co2_composition: number;
  injection_pressure: number;
  injection_temperature: number;
  timestamp: string;
}

interface ComplianceDocument {
  document_id: number;
  document_type: string;
  date_of_test: string;
  valid_until: string;
  status: 'valid' | 'expired';
  file_name: string;
}

interface ValidationResult {
  is_valid: boolean;
  missing_documents: string[];
}
```

### Chart Library Recommendation

**Chart.js** or **Plotly.js**
- Both support multi-line time series
- Good performance with large datasets
- Interactive features (zoom, pan, tooltip)
- Export capabilities

### State Management

**Redux or Context API:**
```typescript
interface AppState {
  selectedPeriod: TimePeriod;
  customDateRange: DateRange | null;
  measurements: MeasurementData[];
  documents: ComplianceDocument[];
  validations: Record<string, ValidationResult>;
  dataSource: 'scada' | 'manual';
  loading: boolean;
  error: Error | null;
}
```

---

## Next Steps for Development

1. **Set up component structure**
   - Create React components for each section
   - Implement responsive layout

2. **Implement time period selector**
   - Radio buttons with state management
   - Date range picker for custom

3. **Build meter reading cards**
   - Dynamic data binding
   - Validation badge logic

4. **Integrate chart library**
   - Configure multi-line chart
   - Implement zoom/pan
   - Add tooltips

5. **Create document management system**
   - Upload functionality
   - Date calculation logic
   - Status indicators

6. **Implement validation engine**
   - Document dependency checking
   - Period validation logic
   - Real-time updates

7. **Build API integration**
   - Fetch measurement data
   - Upload CSV and documents
   - WebSocket for SCADA

8. **Add error handling**
   - User-friendly error messages
   - Retry logic
   - Fallback states

9. **Implement testing**
   - Unit tests for validation logic
   - Integration tests for API calls
   - E2E tests for user flows

10. **Performance optimization**
    - Lazy loading
    - Memoization
    - Virtual scrolling for large datasets

---

This specification provides a complete blueprint for implementing the Injector IoT Dashboard. Let me know if you need any clarification or want to dive deeper into any specific component!
