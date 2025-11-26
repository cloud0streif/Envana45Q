# CO2 Transportation Section - Detailed Specification

## Overview

This document specifies the design and functionality for the CO2 Transportation section of the CCS Project Tracking Platform. The transportation system consists of 5 nodes that track CO2 as it moves from the capture facility to the injection site:

1. **Capture Plant Outlet** - Where CO2 exits the capture facility
2. **Pipeline Segment #1** - First pipeline section
3. **Pump Station #1** - Intermediate compression/pumping
4. **Pipeline Segment #2** - Second pipeline section
5. **Injection Site Outlet** - Where CO2 arrives at the sequestration site

---

## Navigation Structure

```
/transport
├── /transport/capture-plant-outlet
├── /transport/pipeline-segment-1
├── /transport/pump-station-1
├── /transport/pipeline-segment-2
└── /transport/injection-site-outlet
```

---

## Transportation Overview Page

**URL:** `/transport`

### Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CCS Platform > CO2 Transportation                       [Back] [Home]      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                    CO2 TRANSPORTATION NETWORK                          ││
│  │                         Real-Time Status                               ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │  ┌─────────────────────┐                                               ││
│  │  │ Capture Plant       │  Current Mass Rate    Current Pressure       ││
│  │  │ Outlet              │  [150.5 t/hr]         [125.3 bar]            ││
│  │  │                     │                                               ││
│  │  │ [CLICK TO VIEW] ────┼──────────────────────────────────────────►   ││
│  │  └─────────────────────┘                                               ││
│  │           │                                                             ││
│  │           ▼                                                             ││
│  │  ┌─────────────────────┐                                               ││
│  │  │ Pipeline Segment #1 │  Peak Emission in Last 24hr                  ││
│  │  │                     │  [0.00 ppm] ✅                                ││
│  │  │                     │                                               ││
│  │  │ [CLICK TO VIEW] ────┼──────────────────────────────────────────►   ││
│  │  └─────────────────────┘                                               ││
│  │           │                                                             ││
│  │           ▼                                                             ││
│  │  ┌─────────────────────┐                                               ││
│  │  │ Pump Station #1     │  Current Mass Rate  Current Inlet  Current   ││
│  │  │                     │  [150.2 t/hr]       Pressure       Outlet    ││
│  │  │                     │                     [85.1 bar]     Pressure  ││
│  │  │ [CLICK TO VIEW] ────┼──────────────────────────────────  [125.8 bar]││
│  │  └─────────────────────┘                                               ││
│  │           │                                                             ││
│  │           ▼                                                             ││
│  │  ┌─────────────────────┐                                               ││
│  │  │ Pipeline Segment #2 │  Peak Emission in Last 24hr                  ││
│  │  │                     │  [0.00 ppm] ✅                                ││
│  │  │                     │                                               ││
│  │  │ [CLICK TO VIEW] ────┼──────────────────────────────────────────►   ││
│  │  └─────────────────────┘                                               ││
│  │           │                                                             ││
│  │           ▼                                                             ││
│  │  ┌─────────────────────┐                                               ││
│  │  │ Injection Site      │  Current Mass Rate    Current Pressure       ││
│  │  │ Outlet              │  [150.1 t/hr]         [124.8 bar]            ││
│  │  │                     │                                               ││
│  │  │ [CLICK TO VIEW] ────┼──────────────────────────────────────────►   ││
│  │  └─────────────────────┘                                               ││
│  │                                                                         ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Overview Page Node Summary

| Node | Key Metrics Displayed | Click Action |
|------|----------------------|--------------|
| Capture Plant Outlet | Current Mass Rate, Current Pressure | Navigate to `/transport/capture-plant-outlet` |
| Pipeline Segment #1 | Peak Emission in Last 24hr | Navigate to `/transport/pipeline-segment-1` |
| Pump Station #1 | Current Mass Rate, Current Inlet Pressure, Current Outlet Pressure | Navigate to `/transport/pump-station-1` |
| Pipeline Segment #2 | Peak Emission in Last 24hr | Navigate to `/transport/pipeline-segment-2` |
| Injection Site Outlet | Current Mass Rate, Current Pressure | Navigate to `/transport/injection-site-outlet` |

### Overview Data Refresh
- Auto-refresh every 60 seconds
- Manual refresh button available
- Real-time WebSocket updates (optional)

---

# Node 1: Capture Plant Outlet Dashboard

**URL:** `/transport/capture-plant-outlet`

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Capture Plant Outlet                                  [Back] [Home] [User] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ Time Period: ○Day ○Week ○Month ○6 months ○Year ○YTD ○Custom           ││
│  │              From: [____] To: [____]                                    ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ CO2 Mass  │ │ Fluid     │ │ CO2       │ │ Avg Inlet   │ │ Avg Inlet   ││
│  │ Flow      │ │ Density   │ │Composition│ │ Pressure    │ │ Temp        ││
│  │           │ │           │ │           │ │             │ │             ││
│  │ [Value]   │ │ [Value]   │ │ [Value]   │ │ [Value]     │ │ [Value]     ││
│  │           │ │           │ │           │ │             │ │             ││
│  │ ✅ Valid  │ │ ✅ Valid  │ │ ✅ Valid  │ │ ❌ Not Valid│ │ ❌ Not Valid││
│  │           │ │           │ │           │ │             │ │             ││
│  │ DID:[___] │ │ DID:[___] │ │ DID:[___] │ │ DID:[___]   │ │ DID:[___]   ││
│  └───────────┘ └───────────┘ └───────────┘ └─────────────┘ └─────────────┘│
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ ⭕ Data Received Through SCADA    📤 Upload Measurement Data [Browse] ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────┐ ┌──────────────────────────┐ │
│  │                                          │ │                          │ │
│  │                                          │ │   Map of Capture Plant   │ │
│  │    Chart of data over the selected       │ │        Location          │ │
│  │              period                      │ │                          │ │
│  │                                          │ │      [Interactive Map]   │ │
│  │                                          │ │                          │ │
│  └─────────────────────────────────────────┘ └──────────────────────────┘ │
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
│  │    Status: ❌ Expired                                     [Upload]    ││
│  │                                                                         ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Measurements

| Measurement | Calculation | Unit | DID Field |
|-------------|-------------|------|-----------|
| CO2 Mass Flow | Total/Average | t/hr or tonnes | Yes |
| Fluid Density | Average | g/cm³ | Yes |
| CO2 Composition | Average | % purity | Yes |
| Avg Inlet Pressure | Average | bar | Yes |
| Avg Inlet Temp | Average | °C | Yes |

## Compliance Documents

| Document | Validity Period |
|----------|-----------------|
| Coriolis Meter Calibration Report | 1 Year |
| Gas Analyzer Calibration Report | 3 months |
| P & T Meter Calibration Report | 1 Year |

## Validation Dependencies

```javascript
const CAPTURE_PLANT_OUTLET_DEPENDENCIES = {
  "co2_mass_flow": [
    "coriolis_meter_calibration"
  ],
  "fluid_density": [
    "coriolis_meter_calibration"
  ],
  "co2_composition": [
    "gas_analyzer_calibration"
  ],
  "avg_inlet_pressure": [
    "pt_meter_calibration"
  ],
  "avg_inlet_temp": [
    "pt_meter_calibration"
  ]
};
```

## Unique Features
- **Map Panel:** Displays interactive map of Capture Plant location
- **Location Context:** Shows where this node fits in the overall transport chain

---

# Node 2: Pipeline Segment #1 Dashboard

**URL:** `/transport/pipeline-segment-1`

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Pipeline Segment #1                                   [Back] [Home] [User] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ Time Period: ○Day ○Week ○Month ○6 months ○Year ○YTD ○Custom           ││
│  │              From: [____] To: [____]                                    ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────┐  ┌───────────┐ ┌───────────┐ ┌───────────┐│
│  │ Segment Length: 53 mi       │  │ Peak      │ │ Peak      │ │ Max       ││
│  │ Internal Pipeline           │  │Temperature│ │ Emission  │ │ Vibration ││
│  │   Diameter: 16 in           │  │           │ │ Detected  │ │           ││
│  │ Inlet Pressure: [value]     │  │ [Value]   │ │ [Value]   │ │ [Value]   ││
│  │ Outlet Pressure: [value]    │  │           │ │           │ │           ││
│  │                             │  │ ✅ Valid  │ │ ✅ Valid  │ │ ✅ Valid  ││
│  │                             │  │           │ │           │ │           ││
│  │                             │  │ DID:[___] │ │ DID:[___] │ │ DID:[___] ││
│  └─────────────────────────────┘  └───────────┘ └───────────┘ └───────────┘│
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ ⭕ Data Received Through SCADA    📤 Upload Measurement Data [Browse] ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────┐ ┌──────────────────────────┐ │
│  │                                          │ │                          │ │
│  │  Sensor measurements along pipeline      │ │   Map of pipeline        │ │
│  │  segment length (From 0 to 53mi)         │ │     segment #1           │ │
│  │                                          │ │                          │ │
│  │  [Distance-based chart with multiple     │ │   [Interactive Map       │ │
│  │   sensor readings along the pipeline]    │ │    showing pipeline      │ │
│  │                                          │ │    route]                │ │
│  └─────────────────────────────────────────┘ └──────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ REQUIRED COMPLIANCE DOCUMENTS                                          ││
│  ├────────────────────────────────────────────────────────────────────────┤│
│  │                                                                         ││
│  │ 📄 Corrosion Monitoring Report                                         ││
│  │    Date of Test: [11/20/2025]    Valid Until: Date of Test + 1 Year   ││
│  │    Status: ✅ Valid                                       [Upload]    ││
│  │    ⚠️ Required for ALL measurements                                   ││
│  │                                                                         ││
│  │ 📄 Distributed Acoustic Sensing (DAS) Calibration                      ││
│  │    Date of Test: [11/20/2025]    Valid Until: Date of Test + 1 Year   ││
│  │    Status: ✅ Valid                                       [Upload]    ││
│  │                                                                         ││
│  │ 📄 Acoustic Emission Sensors Calibration Report                        ││
│  │    Date of Test: [11/20/2025]    Valid Until: Date of Test + 1 Year   ││
│  │    Status: ✅ Valid                                       [Upload]    ││
│  │                                                                         ││
│  │ 📄 Distributed Temperature Sensing (DTS) Fiber Calibration             ││
│  │    Date of Test: [11/20/2025]    Valid Until: Date of Test + 1 Year   ││
│  │    Status: ✅ Valid                                       [Upload]    ││
│  │                                                                         ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Static Pipeline Information

| Property | Value | Editable |
|----------|-------|----------|
| Segment Length | 53 mi | No (configured in settings) |
| Internal Pipeline Diameter | 16 in | No (configured in settings) |
| Inlet Pressure | Dynamic | Real-time value |
| Outlet Pressure | Dynamic | Real-time value |

## Measurements

| Measurement | Calculation | Unit | DID Field |
|-------------|-------------|------|-----------|
| Peak Temperature | Peak/Max | °C | Yes |
| Peak Emission Detected | Peak/Max | ppm | Yes |
| Max Vibration | Peak/Max | mm/s or g | Yes |

## Compliance Documents

| Document | Validity Period | Notes |
|----------|-----------------|-------|
| Corrosion Monitoring Report | 1 Year | **Required for ALL measurements** |
| Distributed Acoustic Sensing (DAS) Calibration | 1 Year | For vibration/leak detection |
| Acoustic Emission Sensors Calibration Report | 1 Year | For emission detection |
| Distributed Temperature Sensing (DTS) Fiber Calibration | 1 Year | For temperature monitoring |

## Validation Dependencies

```javascript
const PIPELINE_SEGMENT_DEPENDENCIES = {
  "peak_temperature": [
    "corrosion_monitoring_report",  // Required for ALL
    "dts_fiber_calibration"
  ],
  "peak_emission_detected": [
    "corrosion_monitoring_report",  // Required for ALL
    "acoustic_emission_calibration"
  ],
  "max_vibration": [
    "corrosion_monitoring_report",  // Required for ALL
    "das_calibration"
  ]
};
```

## Unique Features

### Distance-Based Chart
- **X-Axis:** Distance along pipeline (0 to 53 miles)
- **Y-Axis:** Sensor values (Temperature, Emission, Vibration)
- Shows sensor readings at multiple points along the pipeline
- Useful for identifying localized issues

### Pipeline Map
- Interactive map showing pipeline route
- Sensor locations marked on map
- Color-coded status (green=normal, yellow=warning, red=alert)

---

# Node 3: Pump Station #1 Dashboard

**URL:** `/transport/pump-station-1`

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Pump Station #1                                       [Back] [Home] [User] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ Time Period: ○Day ○Week ○Month ○6 months ○Year ○YTD ○Custom           ││
│  │              From: [____] To: [____]                                    ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ CO2 Mass  │ │ Fluid     │ │ CO2       │ │ Avg Inlet   │ │ Avg Outlet  ││
│  │ Flow      │ │ Inlet &   │ │Composition│ │ Pressure &  │ │ Pressure &  ││
│  │           │ │ Outlet    │ │           │ │ Temperature │ │ Temperature ││
│  │ [Value]   │ │ Density   │ │ [Value]   │ │             │ │             ││
│  │           │ │           │ │           │ │ P: [Value]  │ │ P: [Value]  ││
│  │ ✅ Valid  │ │ In:[Val]  │ │ ✅ Valid  │ │ T: [Value]  │ │ T: [Value]  ││
│  │           │ │ Out:[Val] │ │           │ │             │ │             ││
│  │ DID:[___] │ │ ✅ Valid  │ │ DID:[___] │ │ ✅ Valid    │ │ ✅ Valid    ││
│  │           │ │ DID:[___] │ │           │ │ DID:[___]   │ │ DID:[___]   ││
│  └───────────┘ └───────────┘ └───────────┘ └─────────────┘ └─────────────┘│
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ ⭕ Data Received Through SCADA    📤 Upload Measurement Data [Browse] ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────┐ ┌──────────────────────────┐ │
│  │                                          │ │                          │ │
│  │                                          │ │   Map of Pump Station    │ │
│  │    Chart of data over the selected       │ │        Location          │ │
│  │              period                      │ │                          │ │
│  │                                          │ │      [Interactive Map]   │ │
│  │                                          │ │                          │ │
│  └─────────────────────────────────────────┘ └──────────────────────────┘ │
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

## Measurements

| Measurement | Calculation | Unit | DID Field | Notes |
|-------------|-------------|------|-----------|-------|
| CO2 Mass Flow | Total/Average | t/hr or tonnes | Yes | Single measurement |
| Fluid Inlet Density | Average | g/cm³ | Yes | Inlet measurement |
| Fluid Outlet Density | Average | g/cm³ | Yes | Outlet measurement |
| CO2 Composition | Average | % purity | Yes | Single measurement |
| Avg Inlet Pressure | Average | bar | Yes | Inlet measurement |
| Avg Inlet Temperature | Average | °C | Yes | Inlet measurement |
| Avg Outlet Pressure | Average | bar | Yes | Outlet measurement |
| Avg Outlet Temperature | Average | °C | Yes | Outlet measurement |

### Combined Meter Cards

The Pump Station has unique combined meter cards:

**Fluid Inlet Density and Outlet Density Card:**
```
┌─────────────────────────┐
│ Fluid Inlet Density and │
│ Outlet Density          │
│                         │
│ Inlet:  [0.85 g/cm³]    │
│ Outlet: [0.84 g/cm³]    │
│                         │
│ ✅ Valid in Period      │
│                         │
│ DID: [________________] │
└─────────────────────────┘
```

**Avg Inlet Pressure and Temperature Card:**
```
┌─────────────────────────┐
│ Avg Inlet Pressure and  │
│ Temperature             │
│                         │
│ P: [85.1 bar]           │
│ T: [38.5°C]             │
│                         │
│ ✅ Valid in Period      │
│                         │
│ DID: [________________] │
└─────────────────────────┘
```

**Avg Outlet Pressure and Temperature Card:**
```
┌─────────────────────────┐
│ Avg Outlet Pressure and │
│ Temperature             │
│                         │
│ P: [125.8 bar]          │
│ T: [42.3°C]             │
│                         │
│ ✅ Valid in Period      │
│                         │
│ DID: [________________] │
└─────────────────────────┘
```

## Compliance Documents

| Document | Validity Period |
|----------|-----------------|
| Coriolis Meter Calibration Report | 1 Year |
| Gas Analyzer Calibration Report | 3 months |
| P & T Meter Calibration Report | 1 Year |

## Validation Dependencies

```javascript
const PUMP_STATION_DEPENDENCIES = {
  "co2_mass_flow": [
    "coriolis_meter_calibration"
  ],
  "fluid_inlet_density": [
    "coriolis_meter_calibration"
  ],
  "fluid_outlet_density": [
    "coriolis_meter_calibration"
  ],
  "co2_composition": [
    "gas_analyzer_calibration"
  ],
  "avg_inlet_pressure": [
    "pt_meter_calibration"
  ],
  "avg_inlet_temperature": [
    "pt_meter_calibration"
  ],
  "avg_outlet_pressure": [
    "pt_meter_calibration"
  ],
  "avg_outlet_temperature": [
    "pt_meter_calibration"
  ]
};
```

## Unique Features
- **Inlet/Outlet Comparison:** Shows pressure and density changes across pump
- **Compression Ratio:** Can calculate and display compression ratio
- **Map Panel:** Displays interactive map of Pump Station location

---

# Node 4: Pipeline Segment #2 Dashboard

**URL:** `/transport/pipeline-segment-2`

## Page Layout

Identical structure to Pipeline Segment #1

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Pipeline Segment #2                                   [Back] [Home] [User] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Same layout as Pipeline Segment #1]                                       │
│                                                                              │
│  ┌─────────────────────────────┐  ┌───────────┐ ┌───────────┐ ┌───────────┐│
│  │ Segment Length: 53 mi       │  │ Peak      │ │ Peak      │ │ Max       ││
│  │ Internal Pipeline           │  │Temperature│ │ Emission  │ │ Vibration ││
│  │   Diameter: 16 in           │  │           │ │ Detected  │ │           ││
│  │ Inlet Pressure: [value]     │  │ [Value]   │ │ [Value]   │ │ [Value]   ││
│  │ Outlet Pressure: [value]    │  │           │ │           │ │           ││
│  │                             │  │ ✅ Valid  │ │ ✅ Valid  │ │ ✅ Valid  ││
│  │                             │  │           │ │           │ │           ││
│  │                             │  │ DID:[___] │ │ DID:[___] │ │ DID:[___] ││
│  └─────────────────────────────┘  └───────────┘ └───────────┘ └───────────┘│
│                                                                              │
│  ... [Rest identical to Pipeline Segment #1]                                │
│                                                                              │
│  Map shows: "Map of pipeline segment #2"                                    │
│  Chart shows: "Sensor measurements along pipeline segment length            │
│                (From 0 to 53mi)"                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Measurements

Same as Pipeline Segment #1:

| Measurement | Calculation | Unit | DID Field |
|-------------|-------------|------|-----------|
| Peak Temperature | Peak/Max | °C | Yes |
| Peak Emission Detected | Peak/Max | ppm | Yes |
| Max Vibration | Peak/Max | mm/s or g | Yes |

## Compliance Documents

Same as Pipeline Segment #1:

| Document | Validity Period | Notes |
|----------|-----------------|-------|
| Corrosion Monitoring Report | 1 Year | **Required for ALL measurements** |
| Distributed Acoustic Sensing (DAS) Calibration | 1 Year | |
| Acoustic Emission Sensors Calibration Report | 1 Year | |
| Distributed Temperature Sensing (DTS) Fiber Calibration | 1 Year | |

## Validation Dependencies

Same as Pipeline Segment #1:

```javascript
const PIPELINE_SEGMENT_2_DEPENDENCIES = {
  "peak_temperature": [
    "corrosion_monitoring_report",
    "dts_fiber_calibration"
  ],
  "peak_emission_detected": [
    "corrosion_monitoring_report",
    "acoustic_emission_calibration"
  ],
  "max_vibration": [
    "corrosion_monitoring_report",
    "das_calibration"
  ]
};
```

---

# Node 5: Injection Site Outlet Dashboard

**URL:** `/transport/injection-site-outlet`

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Injection Site Outlet                                 [Back] [Home] [User] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ Time Period: ○Day ○Week ○Month ○6 months ○Year ○YTD ○Custom           ││
│  │              From: [____] To: [____]                                    ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ CO2 Mass  │ │ Fluid     │ │ CO2       │ │ Avg Inlet   │ │ Avg Inlet   ││
│  │ Flow      │ │ Density   │ │Composition│ │ Pressure    │ │ Temp        ││
│  │           │ │           │ │           │ │             │ │             ││
│  │ [Value]   │ │ [Value]   │ │ [Value]   │ │ [Value]     │ │ [Value]     ││
│  │           │ │           │ │           │ │             │ │             ││
│  │ ✅ Valid  │ │ ✅ Valid  │ │ ✅ Valid  │ │ ❌ Not Valid│ │ ❌ Not Valid││
│  │           │ │           │ │           │ │             │ │             ││
│  │ DID:[___] │ │ DID:[___] │ │ DID:[___] │ │ DID:[___]   │ │ DID:[___]   ││
│  └───────────┘ └───────────┘ └───────────┘ └─────────────┘ └─────────────┘│
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ ⭕ Data Received Through SCADA    📤 Upload Measurement Data [Browse] ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────┐ ┌──────────────────────────┐ │
│  │                                          │ │                          │ │
│  │                                          │ │   Map of Injection Site  │ │
│  │    Chart of data over the selected       │ │        Location          │ │
│  │              period                      │ │                          │ │
│  │                                          │ │      [Interactive Map]   │ │
│  │                                          │ │                          │ │
│  └─────────────────────────────────────────┘ └──────────────────────────┘ │
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
│  │    Status: ❌ Expired                                     [Upload]    ││
│  │                                                                         ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Measurements

| Measurement | Calculation | Unit | DID Field |
|-------------|-------------|------|-----------|
| CO2 Mass Flow | Total/Average | t/hr or tonnes | Yes |
| Fluid Density | Average | g/cm³ | Yes |
| CO2 Composition | Average | % purity | Yes |
| Avg Inlet Pressure | Average | bar | Yes |
| Avg Inlet Temp | Average | °C | Yes |

## Compliance Documents

| Document | Validity Period |
|----------|-----------------|
| Coriolis Meter Calibration Report | 1 Year |
| Gas Analyzer Calibration Report | 3 months |
| P & T Meter Calibration Report | 1 Year |

## Validation Dependencies

```javascript
const INJECTION_SITE_OUTLET_DEPENDENCIES = {
  "co2_mass_flow": [
    "coriolis_meter_calibration"
  ],
  "fluid_density": [
    "coriolis_meter_calibration"
  ],
  "co2_composition": [
    "gas_analyzer_calibration"
  ],
  "avg_inlet_pressure": [
    "pt_meter_calibration"
  ],
  "avg_inlet_temp": [
    "pt_meter_calibration"
  ]
};
```

## Unique Features
- **Map Panel:** Displays interactive map of Injection Site location
- **Integration Point:** Data here should match with Sequestration section inputs

---

# Summary: All Transportation Nodes

## Node Comparison Matrix

| Feature | Capture Plant Outlet | Pipeline Segment #1 | Pump Station #1 | Pipeline Segment #2 | Injection Site Outlet |
|---------|---------------------|---------------------|-----------------|---------------------|----------------------|
| **Measurements** | 5 | 3 | 5 (8 values) | 3 | 5 |
| **Documents** | 3 | 4 | 3 | 4 | 3 |
| **DID Fields** | Yes | Yes | Yes | Yes | Yes |
| **Map Panel** | Yes | Yes | Yes | Yes | Yes |
| **Chart Type** | Time-series | Distance-based | Time-series | Distance-based | Time-series |
| **Static Info** | No | Yes (length, diameter) | No | Yes (length, diameter) | No |
| **Inlet/Outlet** | Inlet only | Both (pressure) | Both (all) | Both (pressure) | Inlet only |

## Document Summary Across All Nodes

| Document | Capture Plant | Pipeline #1 | Pump Station | Pipeline #2 | Injection Site |
|----------|---------------|-------------|--------------|-------------|----------------|
| Coriolis Meter Calibration | ✅ 1 Year | - | ✅ 1 Year | - | ✅ 1 Year |
| Gas Analyzer Calibration | ✅ 3 months | - | ✅ 3 months | - | ✅ 3 months |
| P & T Meter Calibration | ✅ 1 Year | - | ✅ 1 Year | - | ✅ 1 Year |
| Corrosion Monitoring Report | - | ✅ 1 Year | - | ✅ 1 Year | - |
| DAS Calibration | - | ✅ 1 Year | - | ✅ 1 Year | - |
| Acoustic Emission Calibration | - | ✅ 1 Year | - | ✅ 1 Year | - |
| DTS Fiber Calibration | - | ✅ 1 Year | - | ✅ 1 Year | - |

---

# Database Schema

## Tables

### transport_nodes
```sql
CREATE TABLE transport_nodes (
    node_id SERIAL PRIMARY KEY,
    node_type VARCHAR(50) NOT NULL,
    -- Types: 'capture_plant_outlet', 'pipeline_segment', 
    --        'pump_station', 'injection_site_outlet'
    node_name VARCHAR(100) NOT NULL,
    node_order INTEGER NOT NULL, -- 1-5 for flow order
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    -- Pipeline-specific fields
    segment_length_miles DECIMAL(6, 2),
    pipeline_diameter_inches DECIMAL(4, 1),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default nodes
INSERT INTO transport_nodes (node_type, node_name, node_order) VALUES
('capture_plant_outlet', 'Capture Plant Outlet', 1),
('pipeline_segment', 'Pipeline Segment #1', 2),
('pump_station', 'Pump Station #1', 3),
('pipeline_segment', 'Pipeline Segment #2', 4),
('injection_site_outlet', 'Injection Site Outlet', 5);
```

### transport_measurements
```sql
CREATE TABLE transport_measurements (
    measurement_id SERIAL PRIMARY KEY,
    node_id INTEGER REFERENCES transport_nodes(node_id),
    timestamp TIMESTAMPTZ NOT NULL,
    -- Flow measurements
    co2_mass_flow DECIMAL(10, 2), -- t/hr
    -- Density measurements
    fluid_density DECIMAL(6, 4), -- g/cm³
    fluid_inlet_density DECIMAL(6, 4), -- g/cm³ (pump station)
    fluid_outlet_density DECIMAL(6, 4), -- g/cm³ (pump station)
    -- Composition
    co2_composition DECIMAL(5, 2), -- %
    -- Pressure measurements
    inlet_pressure DECIMAL(7, 2), -- bar
    outlet_pressure DECIMAL(7, 2), -- bar
    -- Temperature measurements
    inlet_temperature DECIMAL(5, 2), -- °C
    outlet_temperature DECIMAL(5, 2), -- °C
    -- Pipeline-specific measurements
    peak_temperature DECIMAL(5, 2), -- °C
    peak_emission DECIMAL(10, 4), -- ppm
    max_vibration DECIMAL(8, 4), -- mm/s or g
    -- Metadata
    data_source VARCHAR(20), -- 'scada' or 'manual'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Convert to hypertable
SELECT create_hypertable('transport_measurements', 'timestamp');

-- Index
CREATE INDEX idx_transport_node_time ON transport_measurements(node_id, timestamp DESC);
```

### transport_device_identifiers
```sql
CREATE TABLE transport_device_identifiers (
    did_id SERIAL PRIMARY KEY,
    node_id INTEGER REFERENCES transport_nodes(node_id),
    measurement_type VARCHAR(50) NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    device_name VARCHAR(100),
    device_model VARCHAR(100),
    installation_date DATE,
    last_calibration DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(node_id, measurement_type)
);
```

### transport_compliance_documents
```sql
CREATE TABLE transport_compliance_documents (
    document_id SERIAL PRIMARY KEY,
    node_id INTEGER REFERENCES transport_nodes(node_id),
    document_type VARCHAR(100) NOT NULL,
    -- Types: 'coriolis_meter_calibration', 'gas_analyzer_calibration',
    --        'pt_meter_calibration', 'corrosion_monitoring_report',
    --        'das_calibration', 'acoustic_emission_calibration',
    --        'dts_fiber_calibration'
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

-- Index
CREATE INDEX idx_transport_doc_node ON transport_compliance_documents(node_id, document_type);
```

### pipeline_sensor_data
```sql
-- Stores distance-based sensor readings for pipeline segments
CREATE TABLE pipeline_sensor_data (
    reading_id SERIAL PRIMARY KEY,
    node_id INTEGER REFERENCES transport_nodes(node_id),
    timestamp TIMESTAMPTZ NOT NULL,
    distance_miles DECIMAL(6, 2) NOT NULL, -- Distance along pipeline
    sensor_type VARCHAR(50) NOT NULL, -- 'temperature', 'emission', 'vibration'
    value DECIMAL(10, 4),
    unit VARCHAR(20),
    status VARCHAR(20), -- 'normal', 'warning', 'alert'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for distance-based queries
CREATE INDEX idx_pipeline_sensor_dist ON pipeline_sensor_data(node_id, distance_miles, timestamp DESC);
```

---

# API Endpoints

## Overview

### Get Transportation Overview
```
GET /api/transport/overview

Response:
{
  "nodes": [
    {
      "node_id": 1,
      "node_type": "capture_plant_outlet",
      "node_name": "Capture Plant Outlet",
      "node_order": 1,
      "current_metrics": {
        "mass_rate": { "value": 150.5, "unit": "t/hr" },
        "pressure": { "value": 125.3, "unit": "bar" }
      },
      "status": "operational"
    },
    {
      "node_id": 2,
      "node_type": "pipeline_segment",
      "node_name": "Pipeline Segment #1",
      "node_order": 2,
      "current_metrics": {
        "peak_emission_24hr": { "value": 0.00, "unit": "ppm", "status": "normal" }
      },
      "status": "operational"
    },
    {
      "node_id": 3,
      "node_type": "pump_station",
      "node_name": "Pump Station #1",
      "node_order": 3,
      "current_metrics": {
        "mass_rate": { "value": 150.2, "unit": "t/hr" },
        "inlet_pressure": { "value": 85.1, "unit": "bar" },
        "outlet_pressure": { "value": 125.8, "unit": "bar" }
      },
      "status": "operational"
    },
    {
      "node_id": 4,
      "node_type": "pipeline_segment",
      "node_name": "Pipeline Segment #2",
      "node_order": 4,
      "current_metrics": {
        "peak_emission_24hr": { "value": 0.00, "unit": "ppm", "status": "normal" }
      },
      "status": "operational"
    },
    {
      "node_id": 5,
      "node_type": "injection_site_outlet",
      "node_name": "Injection Site Outlet",
      "node_order": 5,
      "current_metrics": {
        "mass_rate": { "value": 150.1, "unit": "t/hr" },
        "pressure": { "value": 124.8, "unit": "bar" }
      },
      "status": "operational"
    }
  ],
  "system_status": "operational",
  "last_updated": "2025-01-15T12:00:00Z"
}
```

## Node-Specific Endpoints

### Get Node Measurements
```
GET /api/transport/nodes/:node_id/measurements

Query Parameters:
- period: 'day' | 'week' | 'month' | '6months' | 'year' | 'ytd' | 'custom'
- start_date: ISO 8601 date
- end_date: ISO 8601 date

Response: (varies by node type - see individual node specs)
```

### Get Node Documents
```
GET /api/transport/nodes/:node_id/documents

Response:
{
  "node_id": 1,
  "documents": [
    {
      "document_id": 1,
      "document_type": "coriolis_meter_calibration",
      "display_name": "Coriolis Meter Calibration Report",
      "date_of_test": "2025-11-20",
      "valid_until": "2026-11-20",
      "validity_period": "1 Year",
      "status": "valid"
    },
    // ... more documents
  ]
}
```

### Upload Document
```
POST /api/transport/nodes/:node_id/documents

Content-Type: multipart/form-data

Body:
- document_type: string
- date_of_test: ISO 8601 date
- file: Document file
- notes: Optional text

Response:
{
  "success": true,
  "document_id": 5,
  "status": "valid"
}
```

### Get/Update Device IDs
```
GET /api/transport/nodes/:node_id/devices
PUT /api/transport/nodes/:node_id/devices/:measurement_type

Body:
{
  "device_id": "CM-CPO-001",
  "device_name": "Coriolis Meter 1"
}
```

### Pipeline-Specific: Get Distance-Based Data
```
GET /api/transport/nodes/:node_id/pipeline-sensors

Query Parameters:
- timestamp: ISO 8601 timestamp (for snapshot at specific time)
- period: time period for aggregation

Response:
{
  "node_id": 2,
  "segment_length": 53,
  "unit": "miles",
  "sensors": [
    {
      "distance_miles": 0,
      "readings": {
        "temperature": { "value": 42.1, "unit": "°C", "status": "normal" },
        "emission": { "value": 0.00, "unit": "ppm", "status": "normal" },
        "vibration": { "value": 0.12, "unit": "mm/s", "status": "normal" }
      }
    },
    {
      "distance_miles": 10,
      "readings": { ... }
    },
    // ... more sensor locations
  ]
}
```

---

# Validation Logic

## Complete Validation Dependencies

```javascript
const TRANSPORT_VALIDATION_CONFIG = {
  // Node 1: Capture Plant Outlet
  "capture_plant_outlet": {
    "co2_mass_flow": ["coriolis_meter_calibration"],
    "fluid_density": ["coriolis_meter_calibration"],
    "co2_composition": ["gas_analyzer_calibration"],
    "avg_inlet_pressure": ["pt_meter_calibration"],
    "avg_inlet_temp": ["pt_meter_calibration"]
  },
  
  // Node 2 & 4: Pipeline Segments
  "pipeline_segment": {
    "peak_temperature": ["corrosion_monitoring_report", "dts_fiber_calibration"],
    "peak_emission_detected": ["corrosion_monitoring_report", "acoustic_emission_calibration"],
    "max_vibration": ["corrosion_monitoring_report", "das_calibration"]
  },
  
  // Node 3: Pump Station
  "pump_station": {
    "co2_mass_flow": ["coriolis_meter_calibration"],
    "fluid_inlet_density": ["coriolis_meter_calibration"],
    "fluid_outlet_density": ["coriolis_meter_calibration"],
    "co2_composition": ["gas_analyzer_calibration"],
    "avg_inlet_pressure": ["pt_meter_calibration"],
    "avg_inlet_temperature": ["pt_meter_calibration"],
    "avg_outlet_pressure": ["pt_meter_calibration"],
    "avg_outlet_temperature": ["pt_meter_calibration"]
  },
  
  // Node 5: Injection Site Outlet
  "injection_site_outlet": {
    "co2_mass_flow": ["coriolis_meter_calibration"],
    "fluid_density": ["coriolis_meter_calibration"],
    "co2_composition": ["gas_analyzer_calibration"],
    "avg_inlet_pressure": ["pt_meter_calibration"],
    "avg_inlet_temp": ["pt_meter_calibration"]
  }
};
```

## Document Validity Periods

```javascript
const TRANSPORT_DOCUMENT_VALIDITY = {
  "coriolis_meter_calibration": { duration: 365, unit: "1 Year" },
  "gas_analyzer_calibration": { duration: 90, unit: "3 months" },
  "pt_meter_calibration": { duration: 365, unit: "1 Year" },
  "corrosion_monitoring_report": { duration: 365, unit: "1 Year" },
  "das_calibration": { duration: 365, unit: "1 Year" },
  "acoustic_emission_calibration": { duration: 365, unit: "1 Year" },
  "dts_fiber_calibration": { duration: 365, unit: "1 Year" }
};
```

## Special Rule: Corrosion Monitoring Report

The Corrosion Monitoring Report is special for Pipeline Segments:
- **Required for ALL measurements** on pipeline segments
- If expired, ALL pipeline measurements become invalid
- Should be highlighted in the UI with a warning

```javascript
function validatePipelineMeasurement(measurement, documents, period) {
  // Corrosion report is always required first
  const corrosionReport = documents["corrosion_monitoring_report"];
  if (!corrosionReport || !isDocumentValidInPeriod(corrosionReport, period)) {
    return {
      is_valid: false,
      reason: "Corrosion Monitoring Report expired or missing (required for all measurements)"
    };
  }
  
  // Then check specific document for measurement
  const requiredDocs = PIPELINE_DEPENDENCIES[measurement];
  // ... standard validation logic
}
```

---

# Visual Design Notes

## Overview Page

- **Layout:** Vertical flow showing nodes in order (top to bottom)
- **Connections:** Visual lines or arrows connecting nodes
- **Status Indicators:** Color-coded status for each node
  - 🟢 Green: All systems operational
  - 🟡 Yellow: Warning (documents expiring soon)
  - 🔴 Red: Alert (expired documents or anomalies)

## Dashboard Pages

- **Consistent Layout:** All dashboards follow same general structure
- **Time Period Selector:** Always at top
- **Meter Cards:** Responsive grid layout
- **Chart + Map:** Side by side on desktop, stacked on mobile
- **Documents:** Bottom section with expandable details

## Pipeline-Specific Charts

- **Distance Chart:** X-axis shows miles (0 to segment length)
- **Multiple Y-axes:** Temperature, Emission, Vibration
- **Sensor Markers:** Clickable points at each sensor location
- **Status Colors:** Line color indicates status (green/yellow/red)

---

# Implementation Notes

## Component Reusability

Create shared components that can be configured per node:

```typescript
// Shared components
<TimePeriodSelector />
<MeterCard measurement={...} validation={...} />
<DataSourceSelector />
<TimeSeriesChart data={...} />
<DistanceBasedChart data={...} /> // Pipeline-specific
<MapPanel location={...} />
<ComplianceDocumentSection documents={...} />

// Node-specific configuration
const CAPTURE_PLANT_CONFIG = {
  measurements: [...],
  documents: [...],
  validationRules: {...}
};
```

## State Management

```typescript
interface TransportState {
  overview: TransportOverview;
  activeNode: NodeId | null;
  nodeData: Record<NodeId, NodeDashboardData>;
  selectedPeriod: TimePeriod;
  loading: boolean;
  error: Error | null;
}
```

---

# Next Steps

1. **Build Overview Page** - Transportation network view with real-time metrics
2. **Create Shared Dashboard Components** - Reusable meter cards, charts, document sections
3. **Implement Node Dashboards** - Configure shared components per node type
4. **Build Pipeline-Specific Features** - Distance-based chart, sensor mapping
5. **Implement Validation Engine** - Handle special corrosion report rule
6. **Add Map Integration** - Interactive maps for each node location
7. **Build API Endpoints** - Node-specific data retrieval
8. **Testing** - Validate all nodes and validation rules

---

This specification provides a complete blueprint for the CO2 Transportation section. Let me know if you need any clarification or want to dive deeper into any specific component!
