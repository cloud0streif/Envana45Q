// Mock data for Transport Assets

export interface Pipeline {
  pipeline_id: number
  asset_name: string
  length_km: number
  diameter_inches: number
  status: 'operational' | 'maintenance' | 'inactive'
  current_flow_tpd: number
  pressure_bar: number
}

export interface VehicleFleet {
  fleet_type: 'truck' | 'rail'
  vehicle_count: number
  active_count: number
  maintenance_count: number
  idle_count: number
  total_capacity_tpd: number
}

export const pipelines: Pipeline[] = [
  {
    pipeline_id: 1,
    asset_name: 'Pipeline 1 (Main Line)',
    length_km: 45,
    diameter_inches: 16,
    status: 'operational',
    current_flow_tpd: 600,
    pressure_bar: 120,
  },
  {
    pipeline_id: 2,
    asset_name: 'Pipeline 2 (Secondary)',
    length_km: 25,
    diameter_inches: 12,
    status: 'operational',
    current_flow_tpd: 350,
    pressure_bar: 115,
  },
]

export const vehicleFleets: VehicleFleet[] = [
  {
    fleet_type: 'truck',
    vehicle_count: 12,
    active_count: 8,
    maintenance_count: 2,
    idle_count: 2,
    total_capacity_tpd: 240,
  },
  {
    fleet_type: 'rail',
    vehicle_count: 6,
    active_count: 4,
    maintenance_count: 1,
    idle_count: 1,
    total_capacity_tpd: 180,
  },
]
