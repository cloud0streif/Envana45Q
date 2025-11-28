import { MapPinIcon, BuildingOffice2Icon, CircleStackIcon } from '@heroicons/react/24/solid'

interface TransportNetworkMapProps {
  highlightNode?: 'capture' | 'segment1' | 'pump' | 'segment2' | 'injection'
}

export function TransportNetworkMap({ highlightNode }: TransportNetworkMapProps) {
  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg p-6 border-2 border-gray-300 shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        PIPELINE ROUTE MAP
      </h3>

      <div className="relative w-full h-[300px] bg-gradient-to-br from-green-50 via-amber-50 to-blue-50 rounded border border-gray-300 overflow-hidden">
        <svg viewBox="0 0 800 300" className="w-full h-full">
          <defs>
            {/* Pipeline pattern */}
            <pattern id="pipeline-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#4B5563" opacity="0.3"/>
            </pattern>
            {/* Road pattern */}
            <pattern id="road-pattern" x="0" y="0" width="10" height="4" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="10" height="4" fill="#9CA3AF"/>
              <rect x="0" y="1.5" width="10" height="1" fill="#FFF" opacity="0.5"/>
            </pattern>
          </defs>

          {/* Map Grid Lines */}
          <g opacity="0.1">
            {[...Array(8)].map((_, i) => (
              <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="300" stroke="#374151" strokeWidth="1" />
            ))}
            {[...Array(4)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 75} x2="800" y2={i * 75} stroke="#374151" strokeWidth="1" />
            ))}
          </g>

          {/* Terrain Features */}
          {/* Water body (river) */}
          <path
            d="M 0 180 Q 200 160, 400 180 T 800 170"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="25"
            opacity="0.4"
          />
          <path
            d="M 0 180 Q 200 160, 400 180 T 800 170"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="15"
            opacity="0.5"
          />

          {/* Highway/Road */}
          <path
            d="M 50 240 L 750 220"
            stroke="#6B7280"
            strokeWidth="8"
            opacity="0.3"
          />
          <path
            d="M 50 240 L 750 220"
            stroke="#D1D5DB"
            strokeWidth="6"
            opacity="0.4"
            strokeDasharray="15,10"
          />

          {/* Pipeline Underground Route - Segment 1 */}
          <g>
            {/* Pipeline shadow/underground effect */}
            <line
              x1="120" y1="152" x2="360" y2="152"
              stroke="#000" strokeWidth="10" opacity="0.1"
            />
            {/* Main pipeline */}
            <line
              x1="120" y1="150" x2="360" y2="150"
              stroke={highlightNode === 'segment1' ? '#DC2626' : '#6B7280'}
              strokeWidth={highlightNode === 'segment1' ? '8' : '6'}
            />
            {/* Pipeline markers */}
            <line
              x1="120" y1="150" x2="360" y2="150"
              stroke={highlightNode === 'segment1' ? '#FCA5A5' : '#D1D5DB'}
              strokeWidth="3"
              strokeDasharray="5,10"
            />
            {/* Distance marker */}
            <rect x="220" y="135" width="60" height="20" fill="#FFF" stroke="#D1D5DB" strokeWidth="1" rx="3"/>
            <text x="250" y="148" fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">
              53 mi
            </text>
          </g>

          {/* Pipeline Underground Route - Segment 2 */}
          <g>
            {/* Pipeline shadow/underground effect */}
            <line
              x1="440" y1="152" x2="680" y2="152"
              stroke="#000" strokeWidth="10" opacity="0.1"
            />
            {/* Main pipeline */}
            <line
              x1="440" y1="150" x2="680" y2="150"
              stroke={highlightNode === 'segment2' ? '#DC2626' : '#6B7280'}
              strokeWidth={highlightNode === 'segment2' ? '8' : '6'}
            />
            {/* Pipeline markers */}
            <line
              x1="440" y1="150" x2="680" y2="150"
              stroke={highlightNode === 'segment2' ? '#FCA5A5' : '#D1D5DB'}
              strokeWidth="3"
              strokeDasharray="5,10"
            />
            {/* Distance marker */}
            <rect x="530" y="135" width="60" height="20" fill="#FFF" stroke="#D1D5DB" strokeWidth="1" rx="3"/>
            <text x="560" y="148" fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">
              53 mi
            </text>
          </g>

          {/* Capture Plant - Map Pin Style */}
          <g transform="translate(80, 150)">
            {/* Pin shadow */}
            <ellipse cx="0" cy="35" rx="12" ry="4" fill="#000" opacity="0.2"/>
            {/* Pin body */}
            <path
              d="M 0,-25 C -12,-25 -20,-15 -20,0 C -20,12 0,30 0,30 C 0,30 20,12 20,0 C 20,-15 12,-25 0,-25 Z"
              fill={highlightNode === 'capture' ? '#0D9488' : '#6B7280'}
              stroke="#FFF"
              strokeWidth="2"
              filter={highlightNode === 'capture' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'}
            />
            {/* Pin center dot */}
            <circle cx="0" cy="-8" r="8" fill="#FFF" opacity="0.9"/>
            <circle cx="0" cy="-8" r="5" fill={highlightNode === 'capture' ? '#0F766E' : '#374151'}/>
          </g>
          <g transform="translate(80, 195)">
            <rect x="-45" y="-12" width="90" height="22" fill="#FFF" fillOpacity="0.95" stroke="#D1D5DB" strokeWidth="1" rx="4"/>
            <text x="0" y="2" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="bold">
              Capture Plant
            </text>
          </g>

          {/* Pump Station - Map Pin Style */}
          <g transform="translate(400, 150)">
            {/* Pin shadow */}
            <ellipse cx="0" cy="35" rx="12" ry="4" fill="#000" opacity="0.2"/>
            {/* Pin body */}
            <path
              d="M 0,-25 C -12,-25 -20,-15 -20,0 C -20,12 0,30 0,30 C 0,30 20,12 20,0 C 20,-15 12,-25 0,-25 Z"
              fill={highlightNode === 'pump' ? '#0D9488' : '#6B7280'}
              stroke="#FFF"
              strokeWidth="2"
              filter={highlightNode === 'pump' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'}
            />
            {/* Pin center - pump icon representation */}
            <rect x="-6" y="-14" width="12" height="12" rx="2" fill="#FFF" opacity="0.9"/>
            <rect x="-4" y="-12" width="8" height="8" rx="1" fill={highlightNode === 'pump' ? '#0F766E' : '#374151'}/>
          </g>
          <g transform="translate(400, 195)">
            <rect x="-50" y="-12" width="100" height="22" fill="#FFF" fillOpacity="0.95" stroke="#D1D5DB" strokeWidth="1" rx="4"/>
            <text x="0" y="2" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="bold">
              Pump Station #1
            </text>
          </g>

          {/* Injection Site - Map Pin Style */}
          <g transform="translate(720, 150)">
            {/* Pin shadow */}
            <ellipse cx="0" cy="35" rx="12" ry="4" fill="#000" opacity="0.2"/>
            {/* Pin body */}
            <path
              d="M 0,-25 C -12,-25 -20,-15 -20,0 C -20,12 0,30 0,30 C 0,30 20,12 20,0 C 20,-15 12,-25 0,-25 Z"
              fill={highlightNode === 'injection' ? '#0D9488' : '#6B7280'}
              stroke="#FFF"
              strokeWidth="2"
              filter={highlightNode === 'injection' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'}
            />
            {/* Pin center - downward arrow */}
            <circle cx="0" cy="-8" r="8" fill="#FFF" opacity="0.9"/>
            <path d="M 0,-12 L 0,-2 M -3,-5 L 0,-2 L 3,-5" stroke={highlightNode === 'injection' ? '#0F766E' : '#374151'} strokeWidth="2" fill="none" strokeLinecap="round"/>
          </g>
          <g transform="translate(720, 195)">
            <rect x="-45" y="-12" width="90" height="22" fill="#FFF" fillOpacity="0.95" stroke="#D1D5DB" strokeWidth="1" rx="4"/>
            <text x="0" y="2" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="bold">
              Injection Site
            </text>
          </g>

          {/* Map Legend */}
          <g transform="translate(20, 270)">
            <rect width="220" height="25" fill="#FFF" fillOpacity="0.95" stroke="#D1D5DB" strokeWidth="1" rx="4"/>
            <text x="10" y="17" fill="#374151" fontSize="10" fontWeight="600">
              Total Distance: 106 mi • Ø 16"
            </text>
          </g>

          {/* Compass Rose */}
          <g transform="translate(760, 30)">
            <circle cx="0" cy="0" r="20" fill="#FFF" fillOpacity="0.9" stroke="#D1D5DB" strokeWidth="1"/>
            <path d="M 0,-15 L 3,0 L 0,15 L -3,0 Z" fill="#DC2626"/>
            <text x="0" y="-20" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="bold">N</text>
          </g>
        </svg>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">
          {highlightNode === 'capture' && 'Viewing: Capture Plant Outlet'}
          {highlightNode === 'segment1' && 'Viewing: Pipeline Segment #1'}
          {highlightNode === 'pump' && 'Viewing: Pump Station #1'}
          {highlightNode === 'segment2' && 'Viewing: Pipeline Segment #2'}
          {highlightNode === 'injection' && 'Viewing: Injection Site Outlet'}
          {!highlightNode && 'CO₂ Transportation Network Overview'}
        </span>
      </div>
    </div>
  )
}
