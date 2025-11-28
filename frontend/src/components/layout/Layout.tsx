import { Link, useLocation } from 'react-router-dom'
import {
  QuestionMarkCircleIcon,
  UserCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path
  const isInSection = (paths: string[]) => paths.some(path => location.pathname.startsWith(path))

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col shadow-lg border-r border-gray-200">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center justify-between pl-4 pr-0 py-0 rounded-full border-2 border-orange-400 hover:border-orange-500 transition-colors">
            <h1 className="text-base font-semibold text-gray-800">Coastal Bend</h1>
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 via-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {/* Cargo Dashboard - Placeholder */}
          <button className="w-full text-left block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            Cargo Dashboard
          </button>

          {/* Carbon Capture & Storage - Active Link */}
          <Link
            to="/"
            className={`block px-6 py-3 text-base font-medium transition-colors ${
              isActive('/') || isInSection(['/capture', '/transport', '/sequestration'])
                ? 'text-orange-600 bg-orange-50'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Carbon Capture & Storage
          </Link>

          {/* Emissions Intensity - Placeholder */}
          <button className="w-full text-left block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            Emissions Intensity
          </button>

          {/* Compliance - Placeholder */}
          <button className="w-full text-left block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            Compliance
          </button>
        </nav>

        {/* Bottom Icons */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-around">
            <button className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 text-white hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 flex items-center justify-center text-xs font-bold">
                FCCM
              </div>
            </button>
            <button className="p-2 text-amber-500 hover:text-amber-600 transition-colors">
              <SparklesIcon className="h-6 w-6" />
            </button>
            <button className="p-2 text-orange-500 hover:text-orange-600 transition-colors">
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <UserCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
