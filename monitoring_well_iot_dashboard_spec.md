# Monitoring Well IoT Dashboard - Detailed Specification

## Overview

This document specifies the design and functionality for the Monitoring Well IoT Dashboard, which displays real-time and historical monitoring data with integrated document validation and compliance tracking. This dashboard is used to track subsurface conditions and verify containment of injected CO2.

---

## Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  Monitoring Well #1 - IoT Dashboard            [Back] [Home] [User] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ Time Period: ○Day ○Week ○Month ○6 months ○Year ○YTD ○Custom   ││
│  │              From: [____] To: [____]                            ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│  │ Tracer       │ │ CO2          │ │ Avg Inj      │ │ Avg Temp   ││
│  │ Detector     │ │ Composition  │ │ Pressure     │ │            ││
│  │              │ │              │ │              │ │            ││
│  │ [Value]      │ │ [Value]      │ │ [Value]      │ │ [Value]    ││
│  │              │ │              │ │              │ │            ││
│  │ ✅ Valid in  │ │ ✅ Valid in  │ │ ❌ Not       │ │ ❌ Not     ││
│  │   Period     │ │   Period     │ │   Valid      │ │   Valid    ││
│  │              │ │              │ │              │ │            ││
│  │ DID: [____]  │ │ DID: [____]  │ │ DID: [____]  │ │ DID: [____]││
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘│
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
│  │  Legend: ─ Tracer  ─ CO2 Composition  ─ Pressure  ─ Temp       ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ REQUIRED COMPLIANCE DOCUMENTS                                   ││
│  ├────────────────────────────────────────────────────────────────┤│
│  │                                                                  ││
│  │ 📄 Tracer Detector Calibration Report                           ││
│  │    Date of Test: [11/20/2025]                                  ││
│  │    Valid Until: Date of Test + 3 months                        ││
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

#### 2.1 Tracer Detector

**Display:**
- **Label:** "Tracer Detector"
- **Value Type:** Reading value (detection level or concentration)
- **Unit:** ppm or ppb (parts per million/billion)
- **Example:** "0.05 ppm"
- **Decimal Places:** 2-4 depending on range

**DID (Device ID) Field:**
- Input field below validation badge
- **Label:** "DID"
- **Purpose:** Links measurement to specific device/sensor
- **Format:** Text input (e.g., "TD-001", "TRACER-MW1")

**Validation Status:**
- **Valid Criteria:** Required document valid in selected period:
  - ✅ Tracer Detector Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green checkmark) - Document valid
  - ❌ "Not Valid in Period" (red X) - Document expired/missing

**Dependencies:**
```javascript
{
  "measurement": "tracer_detector",
  "calculation": "average",
  "required_documents": [
    "tracer_detector_calibration"
  ]
}
```

---

#### 2.2 CO2 Composition

**Display:**
- **Label:** "CO2 Composition"
- **Value Type:** Average over selected period
- **Unit:** % or ppm
- **Example:** "2.5%" or "250 ppm"
- **Decimal Places:** 1-2

**DID (Device ID) Field:**
- Input field below validation badge
- **Label:** "DID"
- **Purpose:** Links measurement to specific gas analyzer device
- **Format:** Text input (e.g., "GA-001", "ANALYZER-MW1")

**Validation Status:**
- **Valid Criteria:** Required document valid in selected period:
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
    "gas_analyzer_calibration"
  ]
}
```

---

#### 2.3 Average Injection Pressure

**Display:**
- **Label:** "Avg Inj Pressure"
- **Value Type:** Average over selected period
- **Unit:** bar or psi
- **Example:** "85.3 bar"
- **Decimal Places:** 1

**DID (Device ID) Field:**
- Input field below validation badge
- **Label:** "DID"
- **Purpose:** Links measurement to specific pressure transducer
- **Format:** Text input (e.g., "PT-001", "PRESS-MW1")

**Validation Status:**
- **Valid Criteria:** Required document valid in selected period:
  - ✅ P & T Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "monitoring_pressure",
  "calculation": "average",
  "required_documents": [
    "pt_meter_calibration"
  ]
}
```

---

#### 2.4 Average Temperature

**Display:**
- **Label:** "Avg Temp"
- **Value Type:** Average over selected period
- **Unit:** °C or °F
- **Example:** "38.5°C"
- **Decimal Places:** 1

**DID (Device ID) Field:**
- Input field below validation badge
- **Label:** "DID"
- **Purpose:** Links measurement to specific temperature sensor
- **Format:** Text input (e.g., "TT-001", "TEMP-MW1")

**Validation Status:**
- **Valid Criteria:** Required document valid in selected period:
  - ✅ P & T Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "monitoring_temperature",
  "calculation": "average",
  "required_documents": [
    "pt_meter_calibration"
  ]
}
```

---

### 3. Device ID (DID) Feature

**Purpose:**
The DID field allows operators to link each measurement to a specific physical device or sensor. This is important for:
- Asset tracking
- Calibration management
- Maintenance scheduling
- Audit trails
- Multi-sensor deployments

**Form Field:**
```
┌──────────────────────────────────────────────────────────┐
│  DID: [__________________]                              │
│        └── Device Identifier input field                │
└──────────────────────────────────────────────────────────┘
```

**Properties:**
- **Type:** Text input
- **Max Length:** 50 characters
- **Format:** Alphanumeric with hyphens/underscores allowed
- **Validation:** Optional (can be empty)
- **Persistence:** Stored per well, per measurement type

**Example DIDs:**
- Tracer Detector: "TD-MW1-001"
- Gas Analyzer: "GA-MW1-001"
- Pressure Transducer: "PT-MW1-001"
- Temperature Sensor: "TT-MW1-001"

---

### 4. Data Source Selection

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
  - `tracer_detector` (ppm)
  - `co2_composition` (%)
  - `monitoring_pressure` (bar)
  - `monitoring_temperature` (°C)

**CSV Example:**
```csv
timestamp,tracer_detector,co2_composition,monitoring_pressure,monitoring_temperature
2025-01-15T08:00:00Z,0.05,2.5,85.3,38.5
2025-01-15T09:00:00Z,0.04,2.4,85.1,38.6
2025-01-15T10:00:00Z,0.06,2.6,85.5,38.4
```

**Upload Process:**
1. User clicks "Browse CSV"
2. File dialog opens
3. User selects CSV file
4. System validates CSV structure
5. If valid: Parse and store data, refresh display
6. If invalid: Show error message with specific issues

---

### 5. Data Visualization Chart

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
  - Left: Pressure (bar), Temperature (°C)
  - Right: Tracer (ppm), CO2 Composition (%)
- **Auto-scale:** Based on data range with 10% padding

**Data Series:**
1. Tracer Detector - Blue line, 2px
2. CO2 Composition - Green line, 2px
3. Monitoring Pressure - Red line, 2px
4. Monitoring Temperature - Purple line, 2px

**Legend:**
- Position: Below chart
- Format: Horizontal, color-coded
- Interactive: Click to show/hide series

**Tooltips:**
- On hover: Show all values at that timestamp
- Format:
  ```
  Time: Jan 15, 2025 08:00
  Tracer: 0.05 ppm
  CO2 Composition: 2.5%
  Pressure: 85.3 bar
  Temperature: 38.5°C
  ```

**Interactions:**
- Zoom: Mouse wheel or pinch gesture
- Pan: Click and drag
- Reset: Double-click or reset button
- Export: Download as PNG/SVG

---

### 6. Compliance Documents Section

#### Document 1: Tracer Detector Calibration Report

**Document Details:**
- **Full Name:** "Tracer Detector Calibration Report"
- **Test Frequency:** Quarterly
- **Validity Period:** Date of Test + 3 Months

**Form Fields:**
```
┌──────────────────────────────────────────────────────────┐
│ 📄 Tracer Detector Calibration Report                    │
│                                                           │
│ Date of Test: [11/20/2025] 📅                           │
│ Valid Until: 02/20/2026 (Calculated)                    │
│ Status: ✅ Valid                                         │
│                                            [Upload]      │
└──────────────────────────────────────────────────────────┘
```

**Fields:**
- `Date of Test`: Date picker input
- `Valid Until`: Auto-calculated (read-only) = Date of Test + 90 days
- `Status`: Auto-calculated badge
  - ✅ Valid (green) - If Valid Until > Current Date
  - ❌ Expired (red) - If Valid Until ≤ Current Date
- `Upload`: Button to upload document file

**Affects Measurements:**
- Tracer Detector

---

#### Document 2: Gas Analyzer Calibration Report

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
  - ✅ Valid (green)
  - ❌ Expired (red)
- `Upload`: Button to upload document

**Affects Measurements:**
- CO2 Composition

---

#### Document 3: P & T Meter Calibration Report

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
- Avg Inj Pressure
- Avg Temperature

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
  "tracer_detector": [
    "tracer_detector_calibration"
  ],
  "co2_composition": [
    "gas_analyzer_calibration"
  ],
  "monitoring_pressure": [
    "pt_meter_calibration"
  ],
  "monitoring_temperature": [
    "pt_meter_calibration"
  ]
};
```

### Document Validity Periods

```javascript
const DOCUMENT_VALIDITY_PERIODS = {
  "tracer_detector_calibration": {
    "duration": 90, // days
    "unit": "3 months"
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

## Comparison: Monitoring Well vs Injector Well Dashboards

| Feature | Injector Well | Monitoring Well |
|---------|---------------|-----------------|
| **Measurements** | 5 | 4 |
| **Documents** | 5 | 3 |
| **DID Fields** | No | Yes |
| **Time Period Selector** | Yes | Yes |
| **SCADA Option** | Yes | Yes |
| **CSV Upload** | Yes | Yes |
| **Chart** | Yes | Yes |

### Measurement Comparison

| Injector Well | Monitoring Well |
|---------------|-----------------|
| CO2 Mass Injected (Total) | Tracer Detector (Avg) |
| Fluid Density (Avg) | CO2 Composition (Avg) |
| CO2 Composition (Avg) | Avg Inj Pressure (Avg) |
| Avg Inj Pressure (Avg) | Avg Temperature (Avg) |
| Avg Temperature (Avg) | - |

### Document Comparison

| Injector Well | Monitoring Well |
|---------------|-----------------|
| Wellbore Integrity - Cased-hole Logging | - |
| Pressure Fall off Test | - |
| Coriolis Meter Calibration Report | - |
| Gas Analyzer Calibration Report | Gas Analyzer Calibration Report |
| P & T Meter Calibration Report | P & T Meter Calibration Report |
| - | Tracer Detector Calibration Report |

---

## Data Model

### Database Tables

#### monitoring_measurements
```sql
CREATE TABLE monitoring_measurements (
    measurement_id SERIAL PRIMARY KEY,
    well_id INTEGER REFERENCES wells(well_id),
    timestamp TIMESTAMPTZ NOT NULL,
    tracer_detector DECIMAL(10, 4), -- ppm
    co2_composition DECIMAL(6, 2), -- %
    monitoring_pressure DECIMAL(7, 2), -- bar
    monitoring_temperature DECIMAL(5, 2), -- °C
    data_source VARCHAR(20), -- 'scada' or 'manual'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('monitoring_measurements', 'timestamp');

-- Index for well_id queries
CREATE INDEX idx_monitoring_well_time ON monitoring_measurements(well_id, timestamp DESC);
```

#### device_identifiers
```sql
CREATE TABLE device_identifiers (
    did_id SERIAL PRIMARY KEY,
    well_id INTEGER REFERENCES wells(well_id),
    measurement_type VARCHAR(50) NOT NULL,
    -- Types: 'tracer_detector', 'co2_composition', 
    --        'monitoring_pressure', 'monitoring_temperature'
    device_id VARCHAR(50) NOT NULL,
    device_name VARCHAR(100),
    device_model VARCHAR(100),
    installation_date DATE,
    last_calibration DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(well_id, measurement_type)
);

-- Index for lookups
CREATE INDEX idx_device_well ON device_identifiers(well_id);
```

#### monitoring_compliance_documents
```sql
CREATE TABLE monitoring_compliance_documents (
    document_id SERIAL PRIMARY KEY,
    well_id INTEGER REFERENCES wells(well_id),
    document_type VARCHAR(50) NOT NULL,
    -- Types: 'tracer_detector_calibration', 'gas_analyzer_calibration',
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
CREATE INDEX idx_mon_compliance_well_type ON monitoring_compliance_documents(well_id, document_type);
CREATE INDEX idx_mon_compliance_validity ON monitoring_compliance_documents(valid_until);
```

---

## API Endpoints

### Measurement Data

#### Get Monitoring Data
```
GET /api/sequestration/monitoring-wells/:well_id/measurements

Query Parameters:
- period: 'day' | 'week' | 'month' | '6months' | 'year' | 'ytd' | 'custom'
- start_date: ISO 8601 date (required if period='custom')
- end_date: ISO 8601 date (required if period='custom')

Response:
{
  "well_id": 1,
  "well_type": "monitoring",
  "period": {
    "start": "2025-01-08T00:00:00Z",
    "end": "2025-01-15T23:59:59Z"
  },
  "measurements": {
    "tracer_detector": {
      "value": 0.05,
      "unit": "ppm",
      "calculation": "average",
      "is_valid": true,
      "device_id": "TD-MW1-001"
    },
    "co2_composition": {
      "value": 2.5,
      "unit": "%",
      "calculation": "average",
      "is_valid": true,
      "device_id": "GA-MW1-001"
    },
    "monitoring_pressure": {
      "value": 85.3,
      "unit": "bar",
      "calculation": "average",
      "is_valid": false,
      "missing_documents": ["pt_meter_calibration"],
      "device_id": "PT-MW1-001"
    },
    "monitoring_temperature": {
      "value": 38.5,
      "unit": "°C",
      "calculation": "average",
      "is_valid": false,
      "missing_documents": ["pt_meter_calibration"],
      "device_id": "TT-MW1-001"
    }
  },
  "time_series": [
    {
      "timestamp": "2025-01-08T08:00:00Z",
      "tracer_detector": 0.05,
      "co2_composition": 2.5,
      "monitoring_pressure": 85.3,
      "monitoring_temperature": 38.5
    },
    // ... more data points
  ]
}
```

#### Upload CSV Data
```
POST /api/sequestration/monitoring-wells/:well_id/measurements/upload

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

### Device Identifiers

#### Get Device IDs
```
GET /api/sequestration/monitoring-wells/:well_id/devices

Response:
{
  "well_id": 1,
  "devices": [
    {
      "measurement_type": "tracer_detector",
      "device_id": "TD-MW1-001",
      "device_name": "Tracer Detector Unit 1",
      "device_model": "TracerPro 5000"
    },
    {
      "measurement_type": "co2_composition",
      "device_id": "GA-MW1-001",
      "device_name": "Gas Analyzer Unit 1",
      "device_model": "GasCheck Pro"
    },
    {
      "measurement_type": "monitoring_pressure",
      "device_id": "PT-MW1-001",
      "device_name": "Pressure Transducer 1",
      "device_model": "PressureSense 3000"
    },
    {
      "measurement_type": "monitoring_temperature",
      "device_id": "TT-MW1-001",
      "device_name": "Temperature Sensor 1",
      "device_model": "TempProbe X"
    }
  ]
}
```

#### Update Device ID
```
PUT /api/sequestration/monitoring-wells/:well_id/devices/:measurement_type

Body:
{
  "device_id": "TD-MW1-002",
  "device_name": "Tracer Detector Unit 2",
  "device_model": "TracerPro 6000"
}

Response:
{
  "success": true,
  "measurement_type": "tracer_detector",
  "device_id": "TD-MW1-002"
}
```

### Compliance Documents

#### Get Documents for Monitoring Well
```
GET /api/sequestration/monitoring-wells/:well_id/documents

Response:
{
  "well_id": 1,
  "documents": [
    {
      "document_id": 1,
      "document_type": "tracer_detector_calibration",
      "display_name": "Tracer Detector Calibration Report",
      "date_of_test": "2025-11-20",
      "valid_until": "2026-02-20",
      "validity_period": "3 months",
      "status": "valid",
      "file_name": "tracer_calibration_2025.pdf",
      "file_path": "/documents/monitoring-well-1/tracer_calibration_2025.pdf",
      "uploaded_at": "2025-11-20T10:00:00Z"
    },
    {
      "document_id": 2,
      "document_type": "gas_analyzer_calibration",
      "display_name": "Gas Analyzer Calibration Report",
      "date_of_test": "2025-11-20",
      "valid_until": "2026-02-20",
      "validity_period": "3 months",
      "status": "valid",
      "file_name": "gas_analyzer_calibration_2025.pdf",
      "file_path": "/documents/monitoring-well-1/gas_analyzer_calibration_2025.pdf",
      "uploaded_at": "2025-11-20T10:00:00Z"
    },
    {
      "document_id": 3,
      "document_type": "pt_meter_calibration",
      "display_name": "P & T Meter Calibration Report",
      "date_of_test": "2024-01-15",
      "valid_until": "2025-01-15",
      "validity_period": "1 Year",
      "status": "expired",
      "file_name": "pt_meter_calibration_2024.pdf",
      "file_path": "/documents/monitoring-well-1/pt_meter_calibration_2024.pdf",
      "uploaded_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Upload Document
```
POST /api/sequestration/monitoring-wells/:well_id/documents

Content-Type: multipart/form-data

Body:
- document_type: 'tracer_detector_calibration' | 'gas_analyzer_calibration' | 
                 'pt_meter_calibration'
- date_of_test: ISO 8601 date
- file: Document file (PDF, DOCX, etc.)
- notes: Optional text

Response:
{
  "success": true,
  "document_id": 4,
  "document_type": "pt_meter_calibration",
  "date_of_test": "2025-01-20",
  "valid_until": "2026-01-20",
  "status": "valid"
}
```

### Validation

#### Check Measurement Validity
```
GET /api/sequestration/monitoring-wells/:well_id/validate

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
    "tracer_detector": {
      "is_valid": true,
      "required_documents": [
        {
          "type": "tracer_detector_calibration",
          "status": "valid",
          "valid_until": "2026-02-20"
        }
      ]
    },
    "co2_composition": {
      "is_valid": true,
      "required_documents": [
        {
          "type": "gas_analyzer_calibration",
          "status": "valid",
          "valid_until": "2026-02-20"
        }
      ]
    },
    "monitoring_pressure": {
      "is_valid": false,
      "required_documents": [
        {
          "type": "pt_meter_calibration",
          "status": "expired",
          "valid_until": "2025-01-15"
        }
      ]
    },
    "monitoring_temperature": {
      "is_valid": false,
      "required_documents": [
        {
          "type": "pt_meter_calibration",
          "status": "expired",
          "valid_until": "2025-01-15"
        }
      ]
    }
  }
}
```

---

## User Interactions & Behaviors

### 1. Initial Page Load
1. Default time period: "Week"
2. Fetch monitoring data for last 7 days
3. Fetch all compliance documents
4. Fetch device identifiers
5. Calculate validation status for each measurement
6. Render meter readings with validation badges and DID fields
7. Render chart with data
8. Render document section with current status

### 2. Changing Time Period
1. User selects different time period radio button
2. If "Custom" selected, show date range pickers
3. Fetch new monitoring data for selected period
4. Recalculate validation status for new period
5. Update meter readings
6. Update validation badges
7. Re-render chart with new data
8. Smooth transition animation

### 3. Editing Device ID (DID)
1. User clicks on DID input field
2. Field becomes editable
3. User enters/updates device identifier
4. On blur or Enter key:
   - Validate format
   - Send update to backend
   - Show success indicator
5. If validation fails, show error and revert

### 4. Uploading CSV Data
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

### 5. Uploading Compliance Document
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

### 6. Updating Document Date
1. User clicks date field for existing document
2. Date picker opens
3. User selects new date
4. Auto-calculate new valid_until date
5. Update database
6. Recalculate validation status
7. Update validation badges
8. Show success notification

### 7. Real-time SCADA Updates (if selected)
1. User selects "Data Received Through SCADA" radio
2. WebSocket connection established
3. Every 60 seconds (or on data push):
   - Receive new monitoring data
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
- Tracer Detector: `#3B82F6` (blue-500)
- CO2 Composition: `#10B981` (green-500)
- Monitoring Pressure: `#EF4444` (red-500)
- Monitoring Temperature: `#8B5CF6` (purple-500)

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
- DID label: 11px, regular
- DID value: 12px, medium
- Chart labels: 12px, regular
- Document details: 13px, regular

### Spacing

**Meter Cards:**
- Width: 200px
- Height: 200px (slightly taller to accommodate DID field)
- Padding: 16px
- Gap between cards: 16px
- Border radius: 8px
- Box shadow: 0 1px 3px rgba(0,0,0,0.1)

**DID Field:**
- Position: Below validation badge
- Width: 100% of card
- Height: 28px
- Font size: 12px
- Border: 1px solid #D1D5DB
- Border radius: 4px

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
- Device: 🔧 or use Font Awesome `fa-microchip`

---

## Error Handling

### CSV Upload Errors

**Missing Required Columns:**
```
Error: CSV file is missing required columns.
Required: timestamp, tracer_detector, co2_composition, 
          monitoring_pressure, monitoring_temperature
Found: timestamp, tracer_detector, co2_composition
```

**Invalid Data Format:**
```
Error: Invalid data format in row 5.
Column: monitoring_pressure
Expected: numeric value (e.g., 85.3)
Found: "N/A"
```

### Device ID Errors

**Invalid Format:**
```
Error: Invalid device ID format.
Allowed characters: letters, numbers, hyphens, underscores
Maximum length: 50 characters
```

**Duplicate Device ID:**
```
Warning: Device ID "PT-MW1-001" is already assigned to another well.
Do you want to reassign it to this well?
[Cancel] [Reassign]
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

### Validation Errors

**No Documents Found:**
```
Warning: No compliance documents found for this monitoring well.
All measurements will be marked as "Not Valid in Period".
Please upload required documents to validate measurements.
```

**Document Expired:**
```
Warning: The following document has expired:
- P & T Meter Calibration Report (expired on 01/15/2025)

Affected measurements:
- Avg Inj Pressure
- Avg Temperature

Please upload a new calibration report.
```

---

## Implementation Notes

### React Component Structure

```typescript
// Types
interface MonitoringMeasurementData {
  tracer_detector: number;
  co2_composition: number;
  monitoring_pressure: number;
  monitoring_temperature: number;
  timestamp: string;
}

interface DeviceIdentifier {
  measurement_type: string;
  device_id: string;
  device_name?: string;
  device_model?: string;
}

interface MonitoringComplianceDocument {
  document_id: number;
  document_type: string;
  date_of_test: string;
  valid_until: string;
  status: 'valid' | 'expired';
  file_name: string;
}

interface MonitoringValidationResult {
  is_valid: boolean;
  missing_documents: string[];
}

// State
interface MonitoringDashboardState {
  selectedPeriod: TimePeriod;
  customDateRange: DateRange | null;
  measurements: MonitoringMeasurementData[];
  devices: DeviceIdentifier[];
  documents: MonitoringComplianceDocument[];
  validations: Record<string, MonitoringValidationResult>;
  dataSource: 'scada' | 'manual';
  loading: boolean;
  error: Error | null;
}
```

### Component Hierarchy

```
MonitoringWellDashboard
├── Header
│   └── Breadcrumb, Title, Navigation
├── TimePeriodSelector
│   └── RadioButtons, DateRangePicker
├── MeterReadingsSection
│   ├── MeterCard (Tracer Detector)
│   │   ├── ValueDisplay
│   │   ├── ValidationBadge
│   │   └── DeviceIdInput
│   ├── MeterCard (CO2 Composition)
│   ├── MeterCard (Avg Pressure)
│   └── MeterCard (Avg Temperature)
├── DataSourceSelector
│   ├── ScadaOption
│   └── CsvUploadOption
├── DataChart
│   └── MultiLineTimeSeriesChart
└── ComplianceDocumentsSection
    ├── DocumentRow (Tracer Detector Calibration)
    ├── DocumentRow (Gas Analyzer Calibration)
    └── DocumentRow (P & T Meter Calibration)
```

---

## Testing Scenarios

### Functional Tests

1. **Time Period Selection**
   - Select each time period option
   - Verify correct data is loaded
   - Test custom date range with edge cases

2. **Measurement Calculations**
   - Verify averages are calculated correctly
   - Test with missing data points

3. **Device ID Management**
   - Add new device ID
   - Update existing device ID
   - Test validation of device ID format
   - Test persistence after page reload

4. **Validation Logic**
   - Test each document dependency
   - Test with expired documents
   - Test with missing documents
   - Test edge case: document expires mid-period

5. **CSV Upload**
   - Upload valid CSV
   - Upload CSV with missing columns
   - Upload CSV with invalid data
   - Upload very large CSV (10k+ rows)

6. **Document Upload**
   - Upload each document type
   - Upload oversized file
   - Upload invalid file type
   - Update document date

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

4. **Device ID Not Set**
   - Display placeholder text
   - Show prompt to add device ID

---

## Next Steps for Development

1. **Set up component structure**
   - Create React components for monitoring dashboard
   - Implement responsive layout

2. **Implement DID feature**
   - Create DeviceIdInput component
   - Add validation and persistence

3. **Build meter reading cards**
   - Dynamic data binding
   - Validation badge logic
   - DID field integration

4. **Integrate chart library**
   - Configure multi-line chart for monitoring data
   - Add legends and tooltips

5. **Create document management system**
   - Upload functionality for 3 document types
   - Date calculation logic

6. **Implement validation engine**
   - Simpler dependencies than injector well
   - Period validation logic

7. **Build API integration**
   - Fetch monitoring data
   - Upload CSV and documents
   - Manage device identifiers

8. **Add real-time updates**
   - WebSocket for SCADA integration
   - Auto-refresh mechanism

---

This specification provides a complete blueprint for implementing the Monitoring Well IoT Dashboard. The key differences from the Injector Well Dashboard are:
- Fewer measurements (4 vs 5)
- Fewer compliance documents (3 vs 5)
- Simpler validation dependencies (1 document per measurement vs 3)
- Addition of Device ID (DID) fields for each measurement

Let me know if you need any clarification or want to proceed with implementation!
