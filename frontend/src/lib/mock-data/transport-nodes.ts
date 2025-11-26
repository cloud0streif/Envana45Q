// Mock data for CO2 Transportation Nodes

export interface TransportNode {
  node_id: number
  node_type: 'capture_plant_outlet' | 'pipeline_segment' | 'pump_station' | 'injection_site_outlet'
  node_name: string
  node_order: number
  status: 'operational' | 'warning' | 'offline'
  current_metrics: {
    [key: string]: {
      value: number
      unit: string
      status?: 'normal' | 'warning' | 'alert'
    }
  }
}

export const transportNodes: TransportNode[] = [
  {
    node_id: 1,
    node_type: 'capture_plant_outlet',
    node_name: 'Capture Plant Outlet',
    node_order: 1,
    status: 'operational',
    current_metrics: {
      mass_rate: { value: 150.5, unit: 't/hr' },
      pressure: { value: 125.3, unit: 'bar' },
    },
  },
  {
    node_id: 2,
    node_type: 'pipeline_segment',
    node_name: 'Pipeline Segment #1',
    node_order: 2,
    status: 'operational',
    current_metrics: {
      segment_length: { value: 53, unit: 'mi' },
      diameter: { value: 16, unit: 'in' },
      peak_emission_24hr: { value: 0.00, unit: 'ppm', status: 'normal' },
      inlet_pressure: { value: 125.3, unit: 'bar' },
      outlet_pressure: { value: 85.1, unit: 'bar' },
    },
  },
  {
    node_id: 3,
    node_type: 'pump_station',
    node_name: 'Pump Station #1',
    node_order: 3,
    status: 'operational',
    current_metrics: {
      mass_rate: { value: 150.2, unit: 't/hr' },
      inlet_pressure: { value: 85.1, unit: 'bar' },
      outlet_pressure: { value: 125.8, unit: 'bar' },
    },
  },
  {
    node_id: 4,
    node_type: 'pipeline_segment',
    node_name: 'Pipeline Segment #2',
    node_order: 4,
    status: 'operational',
    current_metrics: {
      segment_length: { value: 53, unit: 'mi' },
      diameter: { value: 16, unit: 'in' },
      peak_emission_24hr: { value: 0.00, unit: 'ppm', status: 'normal' },
      inlet_pressure: { value: 125.8, unit: 'bar' },
      outlet_pressure: { value: 124.8, unit: 'bar' },
    },
  },
  {
    node_id: 5,
    node_type: 'injection_site_outlet',
    node_name: 'Injection Site Outlet',
    node_order: 5,
    status: 'operational',
    current_metrics: {
      mass_rate: { value: 150.1, unit: 't/hr' },
      pressure: { value: 124.8, unit: 'bar' },
    },
  },
]

// Get node route based on type
export function getNodeRoute(node: TransportNode): string {
  switch (node.node_type) {
    case 'capture_plant_outlet':
      return `/transport/capture-plant-outlet`
    case 'pipeline_segment':
      return `/transport/pipeline-segment/${node.node_order === 2 ? '1' : '2'}`
    case 'pump_station':
      return `/transport/pump-station-1`
    case 'injection_site_outlet':
      return `/transport/injection-site-outlet`
    default:
      return '/transport'
  }
}

// Get status color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'operational':
      return 'green'
    case 'warning':
      return 'yellow'
    case 'offline':
      return 'red'
    case 'normal':
      return 'green'
    case 'alert':
      return 'red'
    default:
      return 'gray'
  }
}
