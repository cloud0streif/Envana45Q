// Mock data for Wells (Injectors and Monitoring)

export interface Well {
  well_id: number
  well_name: string
  well_type: 'injector' | 'monitoring'
  status: 'operational' | 'maintenance' | 'inactive'
  current_rate_tpd?: number
  last_reading?: string
  monitoring_type?: string
}

export const injectorWells: Well[] = [
  {
    well_id: 1,
    well_name: 'Injector Well #1',
    well_type: 'injector',
    status: 'operational',
    current_rate_tpd: 150,
    last_reading: '2 min ago',
  },
  {
    well_id: 2,
    well_name: 'Injector Well #2',
    well_type: 'injector',
    status: 'maintenance',
    current_rate_tpd: 0,
    last_reading: '1 hour ago',
  },
]

export const monitoringWells: Well[] = [
  {
    well_id: 3,
    well_name: 'Monitoring Well #1',
    well_type: 'monitoring',
    status: 'operational',
    monitoring_type: 'Pressure Monitoring',
    last_reading: '2 min ago',
  },
  {
    well_id: 4,
    well_name: 'Monitoring Well #2',
    well_type: 'monitoring',
    status: 'operational',
    monitoring_type: 'Geochemical Monitoring',
    last_reading: '5 min ago',
  },
]
