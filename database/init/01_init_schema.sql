-- CCS Platform Database Schema Initialization
-- PostgreSQL + TimescaleDB

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'viewer', -- 'admin', 'operator', 'viewer'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CCS OPERATIONS - WELLS
-- ============================================================================

CREATE TABLE wells (
    well_id SERIAL PRIMARY KEY,
    well_name VARCHAR(100) NOT NULL,
    well_type VARCHAR(50) NOT NULL, -- 'injector', 'monitoring'
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    depth_meters DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'operational', -- 'operational', 'maintenance', 'inactive'
    installation_date DATE,
    capacity_tpd DECIMAL(10, 2), -- tonnes per day
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SENSOR DATA (TimescaleDB Hypertable)
-- ============================================================================

CREATE TABLE sensor_data (
    time TIMESTAMPTZ NOT NULL,
    well_id INTEGER REFERENCES wells(well_id) ON DELETE CASCADE,
    sensor_type VARCHAR(50) NOT NULL, -- 'temperature', 'pressure', 'humidity', 'flow', 'bme280'
    value DECIMAL(10, 4),
    unit VARCHAR(20),
    device_id VARCHAR(100), -- Raspberry Pi or sensor identifier
    metadata JSONB, -- Additional sensor-specific data
    PRIMARY KEY (time, well_id, sensor_type, device_id)
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('sensor_data', 'time', if_not_exists => TRUE);

-- Create indexes for common queries
CREATE INDEX idx_sensor_data_well ON sensor_data(well_id, time DESC);
CREATE INDEX idx_sensor_data_type ON sensor_data(sensor_type, time DESC);
CREATE INDEX idx_sensor_data_device ON sensor_data(device_id, time DESC);

-- ============================================================================
-- CO2 CAPTURE FACILITIES
-- ============================================================================

CREATE TABLE capture_facilities (
    facility_id SERIAL PRIMARY KEY,
    facility_name VARCHAR(100) NOT NULL,
    technology_type VARCHAR(100), -- 'amine', 'membrane', 'oxy-fuel', 'adsorption'
    capacity_tpd DECIMAL(10, 2), -- tonnes per day
    location VARCHAR(200),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    status VARCHAR(50) DEFAULT 'operational',
    efficiency_percent DECIMAL(5, 2),
    current_rate_tpd DECIMAL(10, 2),
    energy_consumption_gj_per_tonne DECIMAL(10, 2),
    co2_purity_percent DECIMAL(5, 2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TRANSPORT ASSETS
-- ============================================================================

CREATE TABLE transport_assets (
    asset_id SERIAL PRIMARY KEY,
    asset_type VARCHAR(50) NOT NULL, -- 'pipeline', 'truck', 'rail', 'ship'
    asset_name VARCHAR(100) NOT NULL,
    capacity_tpd DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'operational',
    specifications JSONB, -- Flexible storage for asset-specific properties
    location VARCHAR(200),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PIPELINE-SPECIFIC DATA
-- ============================================================================

CREATE TABLE pipelines (
    pipeline_id INTEGER PRIMARY KEY REFERENCES transport_assets(asset_id) ON DELETE CASCADE,
    length_km DECIMAL(10, 2),
    diameter_inches DECIMAL(6, 2),
    max_pressure_bar DECIMAL(10, 2),
    current_flow_tpd DECIMAL(10, 2),
    current_pressure_bar DECIMAL(10, 2),
    material VARCHAR(100),
    installation_year INTEGER
);

-- ============================================================================
-- VEHICLE FLEET DATA
-- ============================================================================

CREATE TABLE vehicle_fleet (
    vehicle_id SERIAL PRIMARY KEY,
    fleet_type VARCHAR(50), -- 'truck', 'rail'
    vehicle_count INTEGER DEFAULT 0,
    active_count INTEGER DEFAULT 0,
    maintenance_count INTEGER DEFAULT 0,
    idle_count INTEGER DEFAULT 0,
    total_capacity_tpd DECIMAL(10, 2),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOCUMENTS & FILE MANAGEMENT
-- ============================================================================

CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    document_type VARCHAR(100) NOT NULL, -- 'Class VI MRV', 'Permit', 'Report', 'Procedure'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_kb INTEGER,
    mime_type VARCHAR(100),
    category VARCHAR(50), -- 'capture', 'transport', 'sequestration', 'general'
    subcategory VARCHAR(50), -- 'injection', 'monitoring', 'facilities', 'pipelines', etc.
    version VARCHAR(20),
    uploaded_by INTEGER REFERENCES users(user_id),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags TEXT[], -- Array of searchable tags
    metadata JSONB
);

CREATE INDEX idx_documents_category ON documents(category, subcategory);
CREATE INDEX idx_documents_type ON documents(document_type);

-- ============================================================================
-- INJECTION OPERATIONS (for Injector Wells)
-- ============================================================================

CREATE TABLE injection_operations (
    operation_id SERIAL PRIMARY KEY,
    well_id INTEGER REFERENCES wells(well_id) ON DELETE CASCADE,
    operation_date DATE NOT NULL,
    co2_injected_tonnes DECIMAL(10, 2),
    injection_rate_tpd DECIMAL(10, 2),
    wellhead_pressure_bar DECIMAL(10, 2),
    bottomhole_pressure_bar DECIMAL(10, 2),
    efficiency_percent DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_injection_well ON injection_operations(well_id, operation_date DESC);

-- ============================================================================
-- MONITORING REPORTS (for Monitoring Wells)
-- ============================================================================

CREATE TABLE monitoring_reports (
    report_id SERIAL PRIMARY KEY,
    well_id INTEGER REFERENCES wells(well_id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    monitoring_type VARCHAR(100), -- 'pressure', 'geochemical', 'seismic', 'groundwater'
    measurements JSONB, -- Flexible storage for various measurements
    anomalies_detected BOOLEAN DEFAULT false,
    anomaly_description TEXT,
    status VARCHAR(50) DEFAULT 'normal', -- 'normal', 'warning', 'alert'
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_monitoring_well ON monitoring_reports(well_id, report_date DESC);

-- ============================================================================
-- ALERTS & NOTIFICATIONS
-- ============================================================================

CREATE TABLE alerts (
    alert_id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL, -- 'system', 'sensor', 'operational', 'safety'
    severity VARCHAR(20) NOT NULL, -- 'info', 'warning', 'critical'
    source_type VARCHAR(50), -- 'well', 'facility', 'pipeline', 'vehicle'
    source_id INTEGER,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_unresolved ON alerts(is_resolved, created_at DESC) WHERE is_resolved = false;

-- ============================================================================
-- PROJECT METRICS (Dashboard Summary Data)
-- ============================================================================

CREATE TABLE project_metrics (
    metric_id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    total_co2_captured_tonnes DECIMAL(12, 2),
    total_co2_transported_tonnes DECIMAL(12, 2),
    total_co2_injected_tonnes DECIMAL(12, 2),
    active_wells_count INTEGER,
    active_facilities_count INTEGER,
    active_pipelines_count INTEGER,
    system_efficiency_percent DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(metric_date)
);

-- ============================================================================
-- SEED DATA - Initial Setup
-- ============================================================================

-- Create default admin user (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO users (username, email, hashed_password, full_name, role) VALUES
('admin', 'admin@ccs-platform.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QK7TBOYvEBpm', 'System Administrator', 'admin'),
('operator', 'operator@ccs-platform.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QK7TBOYvEBpm', 'Field Operator', 'operator');

-- Create sample wells
INSERT INTO wells (well_name, well_type, location_lat, location_lng, depth_meters, status, installation_date, capacity_tpd, description) VALUES
('Injector Well #1', 'injector', 41.8781, -87.6298, 1800.00, 'operational', '2023-01-15', 200.00, 'Primary CO2 injection well'),
('Injector Well #2', 'injector', 41.8790, -87.6310, 1750.00, 'operational', '2023-03-20', 150.00, 'Secondary CO2 injection well'),
('Monitoring Well #1', 'monitoring', 41.8785, -87.6305, 1650.00, 'operational', '2023-02-10', NULL, 'Pressure monitoring well'),
('Monitoring Well #2', 'monitoring', 41.8795, -87.6315, 1700.00, 'operational', '2023-04-05', NULL, 'Geochemical monitoring well');

-- Create sample capture facilities
INSERT INTO capture_facilities (facility_name, technology_type, capacity_tpd, location, location_lat, location_lng, status, efficiency_percent, current_rate_tpd, energy_consumption_gj_per_tonne, co2_purity_percent) VALUES
('Facility A - Amine System', 'amine', 500.00, 'Industrial Park North', 41.8800, -87.6350, 'operational', 90.00, 450.00, 2.50, 99.20),
('Facility B - Membrane System', 'membrane', 300.00, 'Industrial Park South', 41.8750, -87.6250, 'operational', 92.00, 275.00, 2.20, 99.50);

-- Create sample transport assets
INSERT INTO transport_assets (asset_type, asset_name, capacity_tpd, status, specifications, location) VALUES
('pipeline', 'Pipeline 1 (Main Line)', 600.00, 'operational', '{"length_km": 45, "diameter_inches": 16, "pressure_bar": 120}', 'Route A'),
('pipeline', 'Pipeline 2 (Secondary)', 350.00, 'operational', '{"length_km": 25, "diameter_inches": 12, "pressure_bar": 115}', 'Route B');

-- Create pipeline details
INSERT INTO pipelines (pipeline_id, length_km, diameter_inches, max_pressure_bar, current_flow_tpd, current_pressure_bar, material, installation_year) VALUES
(1, 45.00, 16.00, 150.00, 600.00, 120.00, 'Carbon Steel', 2022),
(2, 25.00, 12.00, 140.00, 350.00, 115.00, 'Carbon Steel', 2023);

-- Create vehicle fleet
INSERT INTO vehicle_fleet (fleet_type, vehicle_count, active_count, maintenance_count, idle_count, total_capacity_tpd) VALUES
('truck', 12, 8, 2, 2, 240.00),
('rail', 6, 4, 1, 1, 180.00);

-- Initialize project metrics for today
INSERT INTO project_metrics (metric_date, total_co2_captured_tonnes, total_co2_transported_tonnes, total_co2_injected_tonnes, active_wells_count, active_facilities_count, active_pipelines_count, system_efficiency_percent)
VALUES (CURRENT_DATE, 725.00, 725.00, 700.00, 4, 2, 2, 91.50);

-- ============================================================================
-- USEFUL VIEWS
-- ============================================================================

-- View for active injector wells with latest data
CREATE VIEW v_active_injectors AS
SELECT
    w.*,
    (SELECT co2_injected_tonnes FROM injection_operations WHERE well_id = w.well_id ORDER BY operation_date DESC LIMIT 1) as last_injection_tonnes,
    (SELECT operation_date FROM injection_operations WHERE well_id = w.well_id ORDER BY operation_date DESC LIMIT 1) as last_operation_date
FROM wells w
WHERE well_type = 'injector' AND status = 'operational';

-- View for active monitoring wells
CREATE VIEW v_active_monitors AS
SELECT
    w.*,
    (SELECT report_date FROM monitoring_reports WHERE well_id = w.well_id ORDER BY report_date DESC LIMIT 1) as last_report_date,
    (SELECT status FROM monitoring_reports WHERE well_id = w.well_id ORDER BY report_date DESC LIMIT 1) as last_status
FROM wells w
WHERE well_type = 'monitoring' AND status = 'operational';

-- View for system overview
CREATE VIEW v_system_overview AS
SELECT
    (SELECT COUNT(*) FROM wells WHERE status = 'operational') as active_wells,
    (SELECT COUNT(*) FROM capture_facilities WHERE status = 'operational') as active_facilities,
    (SELECT COUNT(*) FROM transport_assets WHERE status = 'operational') as active_transport,
    (SELECT SUM(current_rate_tpd) FROM capture_facilities WHERE status = 'operational') as total_capture_rate,
    (SELECT SUM(co2_injected_tonnes) FROM injection_operations WHERE operation_date = CURRENT_DATE) as today_injected,
    (SELECT COUNT(*) FROM alerts WHERE is_resolved = false) as active_alerts;

COMMENT ON TABLE sensor_data IS 'TimescaleDB hypertable for time-series sensor data from IoT devices';
COMMENT ON TABLE wells IS 'CO2 injection and monitoring wells';
COMMENT ON TABLE capture_facilities IS 'CO2 capture facilities and their operational data';
COMMENT ON TABLE transport_assets IS 'Transportation infrastructure (pipelines, vehicles, etc.)';
COMMENT ON TABLE documents IS 'Document management system for regulatory and operational files';
