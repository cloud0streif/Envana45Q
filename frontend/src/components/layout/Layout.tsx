import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  BeakerIcon,
  CircleStackIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { SignalIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState<string[]>(['ccs'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const isActive = (path: string) => location.pathname === path
  const isInSection = (paths: string[]) => paths.some(path => location.pathname.startsWith(path))

  return (
    <div className="flex h-screen bg-envana-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-envana-sidebar flex flex-col shadow-lg">
        {/* Logo Section */}
        <div className="p-6 border-b border-envana-sidebar-hover">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-envana-teal to-envana-coral rounded-full flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-envana-brown">Coastal Bend</h1>
              <p className="text-xs text-envana-brown-light">CCS Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* CCS Dashboard */}
          <Link
            to="/"
            className={`block px-6 py-3 text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-envana-brown bg-envana-sidebar-hover'
                : 'text-envana-brown-light hover:bg-envana-sidebar-hover hover:text-envana-brown'
            }`}
          >
            <div className="flex items-center">
              <HomeIcon className="h-5 w-5 mr-3" />
              CCS Dashboard
            </div>
          </Link>

          {/* Abatement Section */}
          <div className="mt-4">
            <button
              onClick={() => toggleSection('ccs')}
              className="w-full px-6 py-2 text-xs font-semibold text-envana-brown-light uppercase tracking-wider text-left"
            >
              Abatement
            </button>

            {expandedSections.includes('ccs') && (
              <div className="space-y-1">
                <Link
                  to="/capture"
                  className={`block px-6 py-2.5 text-sm font-medium transition-colors ${
                    isActive('/capture') || isInSection(['/capture'])
                      ? 'text-envana-brown bg-envana-sidebar-active border-l-4 border-envana-coral'
                      : 'text-envana-brown-light hover:bg-envana-sidebar-hover hover:text-envana-brown pl-7'
                  }`}
                >
                  <div className="flex items-center">
                    <BeakerIcon className="h-4 w-4 mr-3" />
                    Carbon Capture
                  </div>
                </Link>

                <Link
                  to="/transport"
                  className={`block px-6 py-2.5 text-sm font-medium transition-colors ${
                    isActive('/transport') || isInSection(['/transport'])
                      ? 'text-envana-brown bg-envana-sidebar-active border-l-4 border-envana-coral'
                      : 'text-envana-brown-light hover:bg-envana-sidebar-hover hover:text-envana-brown pl-7'
                  }`}
                >
                  <div className="flex items-center">
                    <SignalIcon className="h-4 w-4 mr-3" />
                    Transport
                  </div>
                </Link>

                <Link
                  to="/sequestration"
                  className={`block px-6 py-2.5 text-sm font-medium transition-colors ${
                    isActive('/sequestration') || isInSection(['/sequestration', '/iot'])
                      ? 'text-envana-brown bg-envana-sidebar-active border-l-4 border-envana-coral'
                      : 'text-envana-brown-light hover:bg-envana-sidebar-hover hover:text-envana-brown pl-7'
                  }`}
                >
                  <div className="flex items-center">
                    <CircleStackIcon className="h-4 w-4 mr-3" />
                    Storage
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Icons */}
        <div className="p-4 border-t border-envana-sidebar-hover">
          <div className="flex items-center justify-around">
            <button className="p-2 rounded-full bg-envana-teal text-white hover:bg-envana-teal-dark transition-colors">
              <div className="w-8 h-8 flex items-center justify-center text-xs font-bold">
                FCCM
              </div>
            </button>
            <button className="p-2 text-envana-brown-light hover:text-envana-brown transition-colors">
              <SparklesIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-envana-brown-light hover:text-envana-brown transition-colors">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-envana-brown-light hover:text-envana-brown transition-colors">
              <UserCircleIcon className="h-5 w-5" />
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
