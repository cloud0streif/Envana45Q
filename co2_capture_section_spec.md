# CO2 Capture Section - Detailed Specification

## Overview

This document specifies the design and functionality for the CO2 Capture section of the CCS Project Tracking Platform. The capture system consists of Acid Gas Removal Unit (AGRU) trains that separate CO2 from the source gas stream.

**System Components:**
- **AGRU Train #1** - Primary acid gas removal unit
- **AGRU Train #2** - Secondary acid gas removal unit

Each AGRU train processes sour gas (containing CO2, H2S, and other acid gases) and outputs sweet gas (cleaned natural gas) and captured CO2.

---

## Navigation Structure

```
/capture
├── /capture/agru-train-1
└── /capture/agru-train-2
```

---

## CO2 Capture Overview Page

**URL:** `/capture`

### Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CCS Platform > CO2 Capture                              [Back] [Home]      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                         CO2 CAPTURE                                     ││
│  │                      System Overview                                    ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                              │                                               │
│                              │                                               │
│                              ▼                                               │
│         ┌────────────────────┴────────────────────┐                        │
│         │                                          │                        │
│         ▼                                          ▼                        │
│  ┌─────────────────────┐                  ┌─────────────────────┐          │
│  │                     │                  │                     │          │
│  │   AGRU Train #1     │                  │   AGRU Train #2     │          │
│  │                     │                  │                     │          │
│  │  Status: Operating  │                  │  Status: Operating  │          │
│  │                     │                  │                     │          │
│  │  Inlet Flow: 150 t/hr                  │  Inlet Flow: 145 t/hr         │
│  │  CO2 Output: 45 t/hr │                  │  CO2 Output: 43 t/hr │          │
│  │  Efficiency: 95.2%  │                  │  Efficiency: 94.8%  │          │
│  │                     │                  │                     │          │
│  │  [CLICK TO VIEW] ───┼──►               │  [CLICK TO VIEW] ───┼──►      │
│  │                     │                  │                     │          │
│  └─────────────────────┘                  └─────────────────────┘          │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │  COMBINED CAPTURE METRICS                                               ││
│  │                                                                          ││
│  │  Total Sour Gas Inlet:    295 t/hr                                      ││
│  │  Total CO2 Captured:      88 t/hr                                       ││
│  │  Total Sweet Gas Output:  207 t/hr                                      ││
│  │  System Efficiency:       95.0%                                         ││
│  │                                                                          ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Overview Page Summary Metrics

| AGRU Train | Key Metrics Displayed | Click Action |
|------------|----------------------|--------------|
| AGRU Train #1 | Status, Inlet Flow, CO2 Output, Efficiency | Navigate to `/capture/agru-train-1` |
| AGRU Train #2 | Status, Inlet Flow, CO2 Output, Efficiency | Navigate to `/capture/agru-train-2` |

### Combined Metrics Section
- Total Sour Gas Inlet (sum of both trains)
- Total CO2 Captured (sum of both trains)
- Total Sweet Gas Output (sum of both trains)
- System Efficiency (weighted average)

---

# AGRU Train Dashboard

**URL Pattern:** `/capture/agru-train-{n}`

Both AGRU Train #1 and AGRU Train #2 share the same dashboard layout with identical measurements, documents, and validation rules.

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGRU Train #1                                         [Back] [Home] [User] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ Time Period: ○Day ○Week ○Month ○6 months ○Year ○YTD ○Custom           ││
│  │              From: [____] To: [____]                                    ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│  │ Sour Gas  │ │ Sweet Gas │ │ Sweet Gas │ │ CO2       │ │ CO2       │    │
│  │ Inlet     │ │ Outlet    │ │ CH4       │ │ Outlet    │ │ Outlet    │    │
│  │ Mass      │ │ Mass (CH4)│ │ Content   │ │ Mass      │ │ Pressure  │    │
│  │           │ │           │ │           │ │           │ │           │    │
│  │ [Value]   │ │ [Value]   │ │ [Value]   │ │ [Value]   │ │ [Value]   │    │
│  │           │ │           │ │           │ │           │ │           │    │
│  │ ✅ Valid  │ │ ✅ Valid  │ │ ✅ Valid  │ │ ✅ Valid  │ │ ✅ Valid  │    │
│  │ in Period │ │ in Period │ │ in Period │ │ in Period │ │ in Period │    │
│  │           │ │           │ │           │ │           │ │           │    │
│  │ DID:[___] │ │ DID:[___] │ │ DID:[___] │ │ DID:[___] │ │ DID:[___] │    │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ ⭕ Data Received Through SCADA    📤 Upload Measurement Data [Browse] ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │                                                                         ││
│  │                  Chart of data over the selected period                 ││
│  │                                                                         ││
│  │  Value │                                                                ││
│  │        │            ╱────────╲                                          ││
│  │        │         ╱──          ──╲                                       ││
│  │        │      ╱──                ───╲                                   ││
│  │        │   ╱──                       ──╲                                ││
│  │        │╱──                              ───                            ││
│  │        └────────────────────────────────────────────► Time             ││
│  │                                                                         ││
│  │  Legend: ─ Sour Gas Inlet  ─ Sweet Gas Outlet  ─ CH4 Content           ││
│  │          ─ CO2 Mass  ─ CO2 Pressure                                    ││
│  │                                                                         ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ REQUIRED COMPLIANCE DOCUMENTS                                          ││
│  ├────────────────────────────────────────────────────────────────────────┤│
│  │                                                                         ││
│  │ 📄 Coriolis Meter Calibration Report                                   ││
│  │    Date of Test: [11/20/2025]    Valid Until: Date of Test + 1 Year   ││
│  │    Status: ✅ Valid                                       [Upload]    ││
│  │                                                                         ││
│  │ 📄 Gas Analyzer Calibration Report                                     ││
│  │    Date of Test: [11/20/2025]    Valid Until: Date of Test + 3 months ││
│  │    Status: ✅ Valid                                       [Upload]    ││
│  │                                                                         ││
│  │ 📄 P & T Meter Calibration Report                                      ││
│  │    Date of Test: [11/20/2025]    Valid Until: Date of Test + 1 Year   ││
│  │    Status: ✅ Valid                                       [Upload]    ││
│  │                                                                         ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
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

#### 2.1 Sour Gas Inlet Mass

**Display:**
- **Label:** "Sour Gas Inlet Mass"
- **Description:** Mass flow rate of raw gas entering the AGRU
- **Value Type:** Total or Average over selected period
- **Unit:** t/hr (tonnes per hour) or tonnes (total)
- **Example:** "150.5 t/hr"
- **Decimal Places:** 1

**DID (Device ID) Field:**
- Input field below validation badge
- **Label:** "DID"
- **Purpose:** Links measurement to specific flow meter
- **Format:** Text input (e.g., "CM-AGRU1-INLET")

**Validation Status:**
- **Valid Criteria:** Required document valid in selected period:
  - ✅ Coriolis Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green checkmark)
  - ❌ "Not Valid in Period" (red X)

**Dependencies:**
```javascript
{
  "measurement": "sour_gas_inlet_mass",
  "calculation": "total_or_average",
  "required_documents": [
    "coriolis_meter_calibration"
  ]
}
```

---

#### 2.2 Sweet Gas Outlet Mass (CH4)

**Display:**
- **Label:** "Sweet Gas Outlet Mass (CH4)"
- **Description:** Mass flow rate of cleaned natural gas exiting the AGRU
- **Value Type:** Total or Average over selected period
- **Unit:** t/hr or tonnes
- **Example:** "105.2 t/hr"
- **Decimal Places:** 1

**DID (Device ID) Field:**
- **Label:** "DID"
- **Format:** Text input (e.g., "CM-AGRU1-SWEET")

**Validation Status:**
- **Valid Criteria:** Required document valid:
  - ✅ Coriolis Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "sweet_gas_outlet_mass",
  "calculation": "total_or_average",
  "required_documents": [
    "coriolis_meter_calibration"
  ]
}
```

---

#### 2.3 Sweet Gas CH4 Content

**Display:**
- **Label:** "Sweet Gas CH4 Content"
- **Description:** Methane concentration in the sweet gas output (purity)
- **Value Type:** Average over selected period
- **Unit:** % (percentage)
- **Example:** "98.5%"
- **Decimal Places:** 1

**DID (Device ID) Field:**
- **Label:** "DID"
- **Format:** Text input (e.g., "GA-AGRU1-CH4")

**Validation Status:**
- **Valid Criteria:** Required document valid:
  - ✅ Gas Analyzer Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "sweet_gas_ch4_content",
  "calculation": "average",
  "required_documents": [
    "gas_analyzer_calibration"
  ]
}
```

---

#### 2.4 CO2 Outlet Mass

**Display:**
- **Label:** "CO2 Outlet Mass"
- **Description:** Mass flow rate of captured CO2 exiting the AGRU
- **Value Type:** Total or Average over selected period
- **Unit:** t/hr or tonnes
- **Example:** "45.3 t/hr"
- **Decimal Places:** 1

**DID (Device ID) Field:**
- **Label:** "DID"
- **Format:** Text input (e.g., "CM-AGRU1-CO2")

**Validation Status:**
- **Valid Criteria:** Required document valid:
  - ✅ Coriolis Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "co2_outlet_mass",
  "calculation": "total_or_average",
  "required_documents": [
    "coriolis_meter_calibration"
  ]
}
```

---

#### 2.5 CO2 Outlet Pressure

**Display:**
- **Label:** "CO2 Outlet Pressure"
- **Description:** Pressure of CO2 stream at AGRU outlet
- **Value Type:** Average over selected period
- **Unit:** bar or psi
- **Example:** "15.5 bar"
- **Decimal Places:** 1

**DID (Device ID) Field:**
- **Label:** "DID"
- **Format:** Text input (e.g., "PT-AGRU1-CO2")

**Validation Status:**
- **Valid Criteria:** Required document valid:
  - ✅ P & T Meter Calibration Report
- **Display:** 
  - ✅ "Valid in Period" (green)
  - ❌ "Not Valid in Period" (red)

**Dependencies:**
```javascript
{
  "measurement": "co2_outlet_pressure",
  "calculation": "average",
  "required_documents": [
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
  - `sour_gas_inlet_mass` (t/hr)
  - `sweet_gas_outlet_mass` (t/hr)
  - `sweet_gas_ch4_content` (%)
  - `co2_outlet_mass` (t/hr)
  - `co2_outlet_pressure` (bar)

**CSV Example:**
```csv
timestamp,sour_gas_inlet_mass,sweet_gas_outlet_mass,sweet_gas_ch4_content,co2_outlet_mass,co2_outlet_pressure
2025-01-15T08:00:00Z,150.5,105.2,98.5,45.3,15.5
2025-01-15T09:00:00Z,151.2,105.8,98.6,45.4,15.4
2025-01-15T10:00:00Z,149.8,104.9,98.4,44.9,15.6
```

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
  - Left: Mass flow rates (t/hr)
  - Right: Pressure (bar), CH4 Content (%)
- **Auto-scale:** Based on data range with 10% padding

**Data Series:**
1. Sour Gas Inlet Mass - Blue line, 2px
2. Sweet Gas Outlet Mass - Green line, 2px
3. Sweet Gas CH4 Content - Orange line, 2px
4. CO2 Outlet Mass - Red line, 2px
5. CO2 Outlet Pressure - Purple line, 2px

**Legend:**
- Position: Below chart
- Format: Horizontal, color-coded
- Interactive: Click to show/hide series

**Tooltips:**
- On hover: Show all values at that timestamp
- Format:
  ```
  Time: Jan 15, 2025 08:00
  Sour Gas Inlet: 150.5 t/hr
  Sweet Gas Outlet: 105.2 t/hr
  CH4 Content: 98.5%
  CO2 Outlet: 45.3 t/hr
  CO2 Pressure: 15.5 bar
  ```

---

### 5. Compliance Documents Section

#### Document 1: Coriolis Meter Calibration Report

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
- `Valid Until`: Auto-calculated (read-only) = Date of Test + 365 days
- `Status`: Auto-calculated badge
  - ✅ Valid (green) - If Valid Until > Current Date
  - ❌ Expired (red) - If Valid Until ≤ Current Date
- `Upload`: Button to upload document file

**Affects Measurements:**
- Sour Gas Inlet Mass
- Sweet Gas Outlet Mass (CH4)
- CO2 Outlet Mass

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
- Sweet Gas CH4 Content

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
- CO2 Outlet Pressure

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
const AGRU_MEASUREMENT_DEPENDENCIES = {
  "sour_gas_inlet_mass": [
    "coriolis_meter_calibration"
  ],
  "sweet_gas_outlet_mass": [
    "coriolis_meter_calibration"
  ],
  "sweet_gas_ch4_content": [
    "gas_analyzer_calibration"
  ],
  "co2_outlet_mass": [
    "coriolis_meter_calibration"
  ],
  "co2_outlet_pressure": [
    "pt_meter_calibration"
  ]
};
```

### Document Validity Periods

```javascript
const AGRU_DOCUMENT_VALIDITY = {
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

## Summary Tables

### Measurements Summary

| Measurement | Calculation | Unit | Required Document |
|-------------|-------------|------|-------------------|
| Sour Gas Inlet Mass | Total/Average | t/hr | Coriolis Meter Calibration |
| Sweet Gas Outlet Mass (CH4) | Total/Average | t/hr | Coriolis Meter Calibration |
| Sweet Gas CH4 Content | Average | % | Gas Analyzer Calibration |
| CO2 Outlet Mass | Total/Average | t/hr | Coriolis Meter Calibration |
| CO2 Outlet Pressure | Average | bar | P & T Meter Calibration |

### Documents Summary

| Document | Validity Period | Affects |
|----------|-----------------|---------|
| Coriolis Meter Calibration Report | 1 Year | Sour Gas Inlet, Sweet Gas Outlet, CO2 Outlet Mass |
| Gas Analyzer Calibration Report | 3 months | Sweet Gas CH4 Content |
| P & T Meter Calibration Report | 1 Year | CO2 Outlet Pressure |

### AGRU Train Comparison

| Feature | AGRU Train #1 | AGRU Train #2 |
|---------|---------------|---------------|
| **Measurements** | 5 | 5 |
| **Documents** | 3 | 3 |
| **DID Fields** | Yes | Yes |
| **Layout** | Identical | Identical |
| **Validation Rules** | Identical | Identical |

---

## Database Schema

### Tables

#### capture_units
```sql
CREATE TABLE capture_units (
    unit_id SERIAL PRIMARY KEY,
    unit_type VARCHAR(50) NOT NULL, -- 'agru_train'
    unit_name VARCHAR(100) NOT NULL, -- 'AGRU Train #1', 'AGRU Train #2'
    unit_number INTEGER NOT NULL, -- 1, 2
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    design_capacity_tph DECIMAL(10, 2), -- Design capacity in t/hr
    status VARCHAR(50), -- 'operating', 'maintenance', 'offline'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default AGRU trains
INSERT INTO capture_units (unit_type, unit_name, unit_number, status) VALUES
('agru_train', 'AGRU Train #1', 1, 'operating'),
('agru_train', 'AGRU Train #2', 2, 'operating');
```

#### capture_measurements
```sql
CREATE TABLE capture_measurements (
    measurement_id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES capture_units(unit_id),
    timestamp TIMESTAMPTZ NOT NULL,
    -- Inlet measurements
    sour_gas_inlet_mass DECIMAL(10, 2), -- t/hr
    -- Outlet measurements
    sweet_gas_outlet_mass DECIMAL(10, 2), -- t/hr
    sweet_gas_ch4_content DECIMAL(5, 2), -- %
    co2_outlet_mass DECIMAL(10, 2), -- t/hr
    co2_outlet_pressure DECIMAL(7, 2), -- bar
    -- Metadata
    data_source VARCHAR(20), -- 'scada' or 'manual'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('capture_measurements', 'timestamp');

-- Index for unit queries
CREATE INDEX idx_capture_unit_time ON capture_measurements(unit_id, timestamp DESC);
```

#### capture_device_identifiers
```sql
CREATE TABLE capture_device_identifiers (
    did_id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES capture_units(unit_id),
    measurement_type VARCHAR(50) NOT NULL,
    -- Types: 'sour_gas_inlet_mass', 'sweet_gas_outlet_mass',
    --        'sweet_gas_ch4_content', 'co2_outlet_mass', 'co2_outlet_pressure'
    device_id VARCHAR(50) NOT NULL,
    device_name VARCHAR(100),
    device_model VARCHAR(100),
    installation_date DATE,
    last_calibration DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(unit_id, measurement_type)
);
```

#### capture_compliance_documents
```sql
CREATE TABLE capture_compliance_documents (
    document_id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES capture_units(unit_id),
    document_type VARCHAR(100) NOT NULL,
    -- Types: 'coriolis_meter_calibration', 'gas_analyzer_calibration',
    --        'pt_meter_calibration'
    date_of_test DATE NOT NULL,
    valid_until DATE NOT NULL,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size_kb INTEGER,
    uploaded_by INTEGER REFERENCES users(user_id),
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20), -- 'valid', 'expired', 'pending'
    notes TEXT
);

-- Index for validation queries
CREATE INDEX idx_capture_doc_unit ON capture_compliance_documents(unit_id, document_type);
CREATE INDEX idx_capture_doc_validity ON capture_compliance_documents(valid_until);
```

---

## API Endpoints

### Overview

#### Get Capture Overview
```
GET /api/capture/overview

Response:
{
  "units": [
    {
      "unit_id": 1,
      "unit_type": "agru_train",
      "unit_name": "AGRU Train #1",
      "unit_number": 1,
      "status": "operating",
      "current_metrics": {
        "inlet_flow": { "value": 150.5, "unit": "t/hr" },
        "co2_output": { "value": 45.3, "unit": "t/hr" },
        "efficiency": { "value": 95.2, "unit": "%" }
      }
    },
    {
      "unit_id": 2,
      "unit_type": "agru_train",
      "unit_name": "AGRU Train #2",
      "unit_number": 2,
      "status": "operating",
      "current_metrics": {
        "inlet_flow": { "value": 145.0, "unit": "t/hr" },
        "co2_output": { "value": 43.5, "unit": "t/hr" },
        "efficiency": { "value": 94.8, "unit": "%" }
      }
    }
  ],
  "combined_metrics": {
    "total_sour_gas_inlet": { "value": 295.5, "unit": "t/hr" },
    "total_co2_captured": { "value": 88.8, "unit": "t/hr" },
    "total_sweet_gas_output": { "value": 206.7, "unit": "t/hr" },
    "system_efficiency": { "value": 95.0, "unit": "%" }
  },
  "last_updated": "2025-01-15T12:00:00Z"
}
```

### Unit-Specific Endpoints

#### Get Unit Measurements
```
GET /api/capture/units/:unit_id/measurements

Query Parameters:
- period: 'day' | 'week' | 'month' | '6months' | 'year' | 'ytd' | 'custom'
- start_date: ISO 8601 date (required if period='custom')
- end_date: ISO 8601 date (required if period='custom')

Response:
{
  "unit_id": 1,
  "unit_name": "AGRU Train #1",
  "period": {
    "start": "2025-01-08T00:00:00Z",
    "end": "2025-01-15T23:59:59Z"
  },
  "measurements": {
    "sour_gas_inlet_mass": {
      "value": 150.5,
      "unit": "t/hr",
      "calculation": "average",
      "is_valid": true,
      "device_id": "CM-AGRU1-INLET"
    },
    "sweet_gas_outlet_mass": {
      "value": 105.2,
      "unit": "t/hr",
      "calculation": "average",
      "is_valid": true,
      "device_id": "CM-AGRU1-SWEET"
    },
    "sweet_gas_ch4_content": {
      "value": 98.5,
      "unit": "%",
      "calculation": "average",
      "is_valid": true,
      "device_id": "GA-AGRU1-CH4"
    },
    "co2_outlet_mass": {
      "value": 45.3,
      "unit": "t/hr",
      "calculation": "average",
      "is_valid": true,
      "device_id": "CM-AGRU1-CO2"
    },
    "co2_outlet_pressure": {
      "value": 15.5,
      "unit": "bar",
      "calculation": "average",
      "is_valid": true,
      "device_id": "PT-AGRU1-CO2"
    }
  },
  "time_series": [
    {
      "timestamp": "2025-01-08T08:00:00Z",
      "sour_gas_inlet_mass": 150.5,
      "sweet_gas_outlet_mass": 105.2,
      "sweet_gas_ch4_content": 98.5,
      "co2_outlet_mass": 45.3,
      "co2_outlet_pressure": 15.5
    },
    // ... more data points
  ]
}
```

#### Upload CSV Data
```
POST /api/capture/units/:unit_id/measurements/upload

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

#### Get Documents for Unit
```
GET /api/capture/units/:unit_id/documents

Response:
{
  "unit_id": 1,
  "documents": [
    {
      "document_id": 1,
      "document_type": "coriolis_meter_calibration",
      "display_name": "Coriolis Meter Calibration Report",
      "date_of_test": "2025-11-20",
      "valid_until": "2026-11-20",
      "validity_period": "1 Year",
      "status": "valid",
      "file_name": "coriolis_calibration_agru1_2025.pdf",
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
      "file_name": "gas_analyzer_calibration_agru1_2025.pdf",
      "uploaded_at": "2025-11-20T10:00:00Z"
    },
    {
      "document_id": 3,
      "document_type": "pt_meter_calibration",
      "display_name": "P & T Meter Calibration Report",
      "date_of_test": "2025-11-20",
      "valid_until": "2026-11-20",
      "validity_period": "1 Year",
      "status": "valid",
      "file_name": "pt_meter_calibration_agru1_2025.pdf",
      "uploaded_at": "2025-11-20T10:00:00Z"
    }
  ]
}
```

#### Upload Document
```
POST /api/capture/units/:unit_id/documents

Content-Type: multipart/form-data

Body:
- document_type: 'coriolis_meter_calibration' | 'gas_analyzer_calibration' | 
                 'pt_meter_calibration'
- date_of_test: ISO 8601 date
- file: Document file (PDF, DOCX, etc.)
- notes: Optional text

Response:
{
  "success": true,
  "document_id": 4,
  "document_type": "coriolis_meter_calibration",
  "date_of_test": "2025-01-20",
  "valid_until": "2026-01-20",
  "status": "valid"
}
```

#### Get/Update Device IDs
```
GET /api/capture/units/:unit_id/devices

Response:
{
  "unit_id": 1,
  "devices": [
    {
      "measurement_type": "sour_gas_inlet_mass",
      "device_id": "CM-AGRU1-INLET",
      "device_name": "Coriolis Meter - Inlet",
      "device_model": "Emerson CMF400"
    },
    // ... more devices
  ]
}

PUT /api/capture/units/:unit_id/devices/:measurement_type

Body:
{
  "device_id": "CM-AGRU1-INLET-NEW",
  "device_name": "Coriolis Meter - Inlet (Replaced)"
}

Response:
{
  "success": true,
  "measurement_type": "sour_gas_inlet_mass",
  "device_id": "CM-AGRU1-INLET-NEW"
}
```

#### Validate Measurements
```
GET /api/capture/units/:unit_id/validate

Query Parameters:
- period: 'day' | 'week' | 'month' | '6months' | 'year' | 'ytd' | 'custom'
- start_date: ISO 8601 date (if custom)
- end_date: ISO 8601 date (if custom)

Response:
{
  "unit_id": 1,
  "period": {
    "start": "2025-01-08T00:00:00Z",
    "end": "2025-01-15T23:59:59Z"
  },
  "validations": {
    "sour_gas_inlet_mass": {
      "is_valid": true,
      "required_documents": [
        {
          "type": "coriolis_meter_calibration",
          "status": "valid",
          "valid_until": "2026-11-20"
        }
      ]
    },
    "sweet_gas_outlet_mass": {
      "is_valid": true,
      "required_documents": [
        {
          "type": "coriolis_meter_calibration",
          "status": "valid",
          "valid_until": "2026-11-20"
        }
      ]
    },
    "sweet_gas_ch4_content": {
      "is_valid": true,
      "required_documents": [
        {
          "type": "gas_analyzer_calibration",
          "status": "valid",
          "valid_until": "2026-02-20"
        }
      ]
    },
    "co2_outlet_mass": {
      "is_valid": true,
      "required_documents": [
        {
          "type": "coriolis_meter_calibration",
          "status": "valid",
          "valid_until": "2026-11-20"
        }
      ]
    },
    "co2_outlet_pressure": {
      "is_valid": true,
      "required_documents": [
        {
          "type": "pt_meter_calibration",
          "status": "valid",
          "valid_until": "2026-11-20"
        }
      ]
    }
  }
}
```

---

## Process Flow Diagram

```
                          SOUR GAS INPUT
                               │
                               │ (Sour Gas Inlet Mass)
                               │
                               ▼
                    ┌─────────────────────┐
                    │                     │
                    │    AGRU TRAIN       │
                    │                     │
                    │  ┌───────────────┐  │
                    │  │ Acid Gas      │  │
                    │  │ Removal       │  │
                    │  │ Process       │  │
                    │  └───────────────┘  │
                    │                     │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               │               ▼
    ┌─────────────────┐       │     ┌─────────────────┐
    │  SWEET GAS      │       │     │  CO2 STREAM     │
    │  OUTPUT         │       │     │  OUTPUT         │
    │                 │       │     │                 │
    │ • Mass Flow     │       │     │ • Mass Flow     │
    │ • CH4 Content   │       │     │ • Pressure      │
    └─────────────────┘       │     └─────────────────┘
              │               │               │
              ▼               │               ▼
        To Sales/Use          │         To Transport
                              │         (Pipeline)
                              │
                    ┌─────────▼─────────┐
                    │   MASS BALANCE    │
                    │                   │
                    │ Inlet = Sweet Gas │
                    │        + CO2      │
                    └───────────────────┘
```

---

## Calculated Metrics

### Capture Efficiency

```javascript
function calculateCaptureEfficiency(sour_gas_inlet, co2_outlet, expected_co2_fraction) {
  // Expected CO2 in inlet stream
  const expected_co2 = sour_gas_inlet * expected_co2_fraction;
  
  // Efficiency = Actual CO2 captured / Expected CO2
  const efficiency = (co2_outlet / expected_co2) * 100;
  
  return efficiency.toFixed(1);
}
```

### Mass Balance Verification

```javascript
function verifyMassBalance(sour_gas_inlet, sweet_gas_outlet, co2_outlet) {
  const calculated_inlet = sweet_gas_outlet + co2_outlet;
  const variance = Math.abs(sour_gas_inlet - calculated_inlet);
  const variance_percent = (variance / sour_gas_inlet) * 100;
  
  return {
    is_balanced: variance_percent < 2.0, // Within 2% tolerance
    variance_percent: variance_percent.toFixed(2)
  };
}
```

---

## User Interactions & Behaviors

### 1. Initial Page Load
1. Default time period: "Week"
2. Fetch measurement data for last 7 days
3. Fetch all compliance documents
4. Fetch device identifiers
5. Calculate validation status for each measurement
6. Render meter readings with validation badges and DID fields
7. Render chart with data
8. Render document section with current status

### 2. Changing Time Period
1. User selects different time period radio button
2. If "Custom" selected, show date range pickers
3. Fetch new measurement data for selected period
4. Recalculate validation status for new period
5. Update meter readings
6. Update validation badges
7. Re-render chart with new data

### 3. Editing Device ID (DID)
1. User clicks on DID input field
2. Field becomes editable
3. User enters/updates device identifier
4. On blur or Enter key:
   - Validate format
   - Send update to backend
   - Show success indicator

### 4. Uploading CSV Data
1. User selects "Upload Measurement Data"
2. User clicks "Browse CSV" button
3. File dialog opens
4. User selects CSV file
5. Frontend validates CSV format
6. If valid: Upload to backend, refresh data
7. If invalid: Show error message

### 5. Uploading Compliance Document
1. User clicks "Upload" button for specific document
2. Modal opens with form
3. User fills form and uploads file
4. Backend validates and stores
5. Refresh document list and validation status

---

## Implementation Notes

### Component Reusability

Both AGRU trains use identical components with different data:

```typescript
// Shared AGRU Dashboard Component
<AGRUDashboard
  unitId={1}
  unitName="AGRU Train #1"
  measurements={AGRU_MEASUREMENTS}
  documents={AGRU_DOCUMENTS}
  validationRules={AGRU_VALIDATION_RULES}
/>

<AGRUDashboard
  unitId={2}
  unitName="AGRU Train #2"
  measurements={AGRU_MEASUREMENTS}
  documents={AGRU_DOCUMENTS}
  validationRules={AGRU_VALIDATION_RULES}
/>
```

### TypeScript Interfaces

```typescript
interface AGRUMeasurements {
  sour_gas_inlet_mass: number;
  sweet_gas_outlet_mass: number;
  sweet_gas_ch4_content: number;
  co2_outlet_mass: number;
  co2_outlet_pressure: number;
}

interface AGRUComplianceDocument {
  document_id: number;
  document_type: 'coriolis_meter_calibration' | 'gas_analyzer_calibration' | 'pt_meter_calibration';
  date_of_test: string;
  valid_until: string;
  status: 'valid' | 'expired';
}

interface AGRUDeviceIdentifier {
  measurement_type: string;
  device_id: string;
  device_name?: string;
}

interface AGRUValidationResult {
  is_valid: boolean;
  required_documents: {
    type: string;
    status: string;
    valid_until: string;
  }[];
}
```

---

## Next Steps

1. **Build Overview Page** - CO2 Capture system view with both AGRU trains
2. **Create Shared AGRU Dashboard Component** - Reusable for both trains
3. **Implement Meter Cards** - With DID fields and validation badges
4. **Build Time Series Chart** - Multi-line chart for all measurements
5. **Implement Document Management** - Upload, validation, expiry tracking
6. **Build API Endpoints** - Unit-specific data retrieval
7. **Add Mass Balance Calculations** - Verify inlet = outlet + CO2
8. **Testing** - Validate all measurements and document rules

---

This specification provides a complete blueprint for the CO2 Capture section with AGRU Train dashboards. Let me know if you need any clarification or want to dive deeper into any specific component!
