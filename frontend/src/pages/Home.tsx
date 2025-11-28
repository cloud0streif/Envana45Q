import { Link } from 'react-router-dom'
import {
  BeakerIcon,
  CircleStackIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { SignalIcon } from '@heroicons/react/24/solid'

export function Home() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Carbon Capture & Sequestration</h1>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-envana-coral to-envana-coral-light hover:from-envana-coral-dark hover:to-envana-coral text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all">
          <span className="text-xl">+</span>
          <span>CCS PROJECT</span>
        </button>
      </div>

      {/* Project Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Coastal Bend LNG - CCS #1</h2>
        <p className="text-gray-600 mt-1">Markets & Credits; 45Q: $85/t (Geologic)</p>
      </div>

      {/* CCS Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CO2 Capture */}
        <Link
          to="/capture"
          className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-all group cursor-pointer border border-gray-200 hover:border-envana-teal"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-envana-sidebar rounded-full p-6 group-hover:bg-envana-sidebar-hover transition-colors">
              <BeakerIcon className="h-16 w-16 text-envana-teal" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-envana-brown group-hover:text-envana-teal transition-colors">
              CO₂ CAPTURE
            </h3>
            <p className="mt-3 text-gray-600">
              Monitor capture facilities and performance metrics
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-500 w-full">
              <div className="flex justify-between">
                <span>Active Facilities:</span>
                <span className="font-semibold text-envana-brown">2</span>
              </div>
              <div className="flex justify-between">
                <span>Total Capacity:</span>
                <span className="font-semibold text-envana-brown">800 t/day</span>
              </div>
              <div className="flex justify-between">
                <span>Current Rate:</span>
                <span className="font-semibold text-envana-brown">725 t/day</span>
              </div>
            </div>
            <button className="mt-6 bg-envana-teal text-white px-6 py-2 rounded-lg group-hover:bg-envana-teal-dark transition-colors font-medium w-full">
              View Details →
            </button>
          </div>
        </Link>

        {/* CO2 Transport */}
        <Link
          to="/transport"
          className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-all group cursor-pointer border border-gray-200 hover:border-envana-coral"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-envana-sidebar rounded-full p-6 group-hover:bg-envana-sidebar-hover transition-colors">
              <SignalIcon className="h-16 w-16 text-envana-coral" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-envana-brown group-hover:text-envana-coral transition-colors">
              CO₂ TRANSPORT
            </h3>
            <p className="mt-3 text-gray-600">
              Track pipeline network operations
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-500 w-full">
              <div className="flex justify-between">
                <span>Pipeline Segments:</span>
                <span className="font-semibold text-envana-brown">2</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pipeline Length:</span>
                <span className="font-semibold text-envana-brown">106 mi</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Injection Site Delivery:</span>
                <span className="font-semibold text-envana-brown">3,602 t/day</span>
              </div>
            </div>
            <button className="mt-6 bg-envana-coral text-white px-6 py-2 rounded-lg group-hover:bg-envana-coral-dark transition-colors font-medium w-full">
              View Details →
            </button>
          </div>
        </Link>

        {/* CO2 Storage */}
        <Link
          to="/sequestration"
          className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-all group cursor-pointer border border-gray-200 hover:border-envana-teal"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-envana-sidebar rounded-full p-6 group-hover:bg-envana-sidebar-hover transition-colors">
              <CircleStackIcon className="h-16 w-16 text-envana-teal" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-envana-brown group-hover:text-envana-teal transition-colors">
              CO₂ STORAGE
            </h3>
            <p className="mt-3 text-gray-600">
              Manage injection and monitoring well operations
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-500 w-full">
              <div className="flex justify-between">
                <span>Injector Wells:</span>
                <span className="font-semibold text-envana-brown">2</span>
              </div>
              <div className="flex justify-between">
                <span>Monitoring Wells:</span>
                <span className="font-semibold text-envana-brown">2</span>
              </div>
              <div className="flex justify-between">
                <span>Total Injected:</span>
                <span className="font-semibold text-envana-brown">12,450 t</span>
              </div>
            </div>
            <button className="mt-6 bg-envana-teal text-white px-6 py-2 rounded-lg group-hover:bg-envana-teal-dark transition-colors font-medium w-full">
              View Details →
            </button>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-envana-brown mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Injector Well #1 - Operational</p>
                <p className="text-xs text-gray-500">150 t/day injection rate</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">2 minutes ago</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-envana-sidebar rounded-full p-2">
                <CheckCircleIcon className="h-5 w-5 text-envana-coral" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Facility A - Performance Update</p>
                <p className="text-xs text-gray-500">90% efficiency, 450 t/day output</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">15 minutes ago</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 rounded-full p-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Injector Well #2 - Maintenance Mode</p>
                <p className="text-xs text-gray-500">Scheduled maintenance in progress</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
