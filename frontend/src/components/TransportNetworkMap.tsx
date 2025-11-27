import { MapPinIcon, BuildingOffice2Icon, CircleStackIcon } from '@heroicons/react/24/solid'

interface TransportNetworkMapProps {
  highlightNode?: 'capture' | 'segment1' | 'pump' | 'segment2' | 'injection'
}

export function TransportNetworkMap({ highlightNode }: TransportNetworkMapProps) {
  return (
    <div className="bg-gradient-to-br from-envana-sidebar to-envana-cream rounded-lg p-6 border-2 border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">TRANSPORTATION NETWORK MAP</h3>

      <div className="relative w-full h-[200px]">
        <svg viewBox="0 0 800 200" className="w-full h-full">
          {/* Pipeline Route */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#6B7280" />
            </marker>
          </defs>

          {/* Segment 1: Capture Plant to Pump Station */}
          <line
            x1="120"
            y1="100"
            x2="340"
            y2="100"
            stroke={highlightNode === 'segment1' ? '#e57373' : '#9CA3AF'}
            strokeWidth={highlightNode === 'segment1' ? '6' : '4'}
            strokeDasharray={highlightNode === 'segment1' ? '0' : '8,4'}
            markerEnd="url(#arrowhead)"
          />
          <text x="200" y="80" fill="#374151" fontSize="12" fontWeight="bold" textAnchor="middle">
            Pipeline #1
          </text>
          <text x="200" y="95" fill="#6B7280" fontSize="11" textAnchor="middle">
            53 mi
          </text>

          {/* Segment 2: Pump Station to Injection Site */}
          <line
            x1="460"
            y1="100"
            x2="680"
            y2="100"
            stroke={highlightNode === 'segment2' ? '#e57373' : '#9CA3AF'}
            strokeWidth={highlightNode === 'segment2' ? '6' : '4'}
            strokeDasharray={highlightNode === 'segment2' ? '0' : '8,4'}
            markerEnd="url(#arrowhead)"
          />
          <text x="550" y="80" fill="#374151" fontSize="12" fontWeight="bold" textAnchor="middle">
            Pipeline #2
          </text>
          <text x="550" y="95" fill="#6B7280" fontSize="11" textAnchor="middle">
            53 mi
          </text>

          {/* Capture Plant */}
          <g transform="translate(80, 100)">
            <circle
              r="20"
              fill={highlightNode === 'capture' ? '#1e7b7d' : '#8B7564'}
              opacity={highlightNode === 'capture' ? '1' : '0.7'}
              stroke="#1F2937"
              strokeWidth="2"
            />
            <circle r="22" fill="none" stroke={highlightNode === 'capture' ? '#1e7b7d' : 'transparent'} strokeWidth="3" opacity="0.5" />
          </g>
          <text x="80" y="140" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="bold">
            Capture Plant
          </text>
          <text x="80" y="153" textAnchor="middle" fill="#6B7280" fontSize="10">
            Outlet
          </text>

          {/* Pump Station */}
          <g transform="translate(400, 100)">
            <rect
              x="-18"
              y="-18"
              width="36"
              height="36"
              rx="4"
              fill={highlightNode === 'pump' ? '#1e7b7d' : '#8B7564'}
              opacity={highlightNode === 'pump' ? '1' : '0.7'}
              stroke="#1F2937"
              strokeWidth="2"
            />
            <rect
              x="-20"
              y="-20"
              width="40"
              height="40"
              rx="4"
              fill="none"
              stroke={highlightNode === 'pump' ? '#1e7b7d' : 'transparent'}
              strokeWidth="3"
              opacity="0.5"
            />
          </g>
          <text x="400" y="140" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="bold">
            Pump Station #1
          </text>
          <text x="400" y="153" textAnchor="middle" fill="#6B7280" fontSize="10">
            Compression
          </text>

          {/* Injection Site */}
          <g transform="translate(720, 100)">
            <polygon
              points="0,-22 21,11 -21,11"
              fill={highlightNode === 'injection' ? '#1e7b7d' : '#8B7564'}
              opacity={highlightNode === 'injection' ? '1' : '0.7'}
              stroke="#1F2937"
              strokeWidth="2"
            />
            <polygon
              points="0,-24 23,13 -23,13"
              fill="none"
              stroke={highlightNode === 'injection' ? '#1e7b7d' : 'transparent'}
              strokeWidth="3"
              opacity="0.5"
            />
          </g>
          <text x="720" y="140" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="bold">
            Injection Site
          </text>
          <text x="720" y="153" textAnchor="middle" fill="#6B7280" fontSize="10">
            Outlet
          </text>

          {/* Legend */}
          <g transform="translate(300, 180)">
            <text x="0" y="0" fill="#6B7280" fontSize="10" fontWeight="bold">
              Total Distance: 106 mi | 16" internal diameter
            </text>
          </g>
        </svg>

        {/* Location Icons Overlay (using Heroicons) */}
        <div className="absolute top-[50%] left-[10%] -translate-x-1/2 -translate-y-1/2">
          <BuildingOffice2Icon
            className={`h-6 w-6 ${highlightNode === 'capture' ? 'text-envana-teal' : 'text-envana-brown-light'}`}
          />
        </div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          <CircleStackIcon
            className={`h-6 w-6 ${highlightNode === 'pump' ? 'text-envana-teal' : 'text-envana-brown-light'}`}
          />
        </div>
        <div className="absolute top-[50%] left-[90%] -translate-x-1/2 -translate-y-1/2">
          <MapPinIcon
            className={`h-6 w-6 ${highlightNode === 'injection' ? 'text-envana-teal' : 'text-envana-brown-light'}`}
          />
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        {highlightNode === 'capture' && '📍 Current Location: Capture Plant Outlet'}
        {highlightNode === 'segment1' && '📍 Current Location: Pipeline Segment #1'}
        {highlightNode === 'pump' && '📍 Current Location: Pump Station #1'}
        {highlightNode === 'segment2' && '📍 Current Location: Pipeline Segment #2'}
        {highlightNode === 'injection' && '📍 Current Location: Injection Site Outlet'}
        {!highlightNode && '📍 Transportation Network Overview'}
      </div>
    </div>
  )
}
