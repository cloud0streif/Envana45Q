import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { Home } from './pages/Home'
import { Capture } from './pages/Capture'
import { Transport } from './pages/Transport'
import { Sequestration } from './pages/Sequestration'
import { IoTDashboard } from './pages/IoTDashboard'
import { InjectorDashboard } from './pages/InjectorDashboard'
import { MonitoringDashboard } from './pages/MonitoringDashboard'
import { CapturePlantOutletDashboard } from './pages/CapturePlantOutletDashboard'
import { InjectionSiteOutletDashboard } from './pages/InjectionSiteOutletDashboard'
import { PipelineSegmentDashboard } from './pages/PipelineSegmentDashboard'
import { PumpStationDashboard } from './pages/PumpStationDashboard'
import { CaptureFacilityDashboard } from './pages/CaptureFacilityDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/capture/facility/:id" element={<CaptureFacilityDashboard />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/transport/capture-plant-outlet" element={<CapturePlantOutletDashboard />} />
            <Route path="/transport/pipeline-segment/:segmentId" element={<PipelineSegmentDashboard />} />
            <Route path="/transport/pump-station-1" element={<PumpStationDashboard />} />
            <Route path="/transport/injection-site-outlet" element={<InjectionSiteOutletDashboard />} />
            <Route path="/sequestration" element={<Sequestration />} />
            <Route path="/iot/injector/:id" element={<InjectorDashboard />} />
            <Route path="/iot/monitoring/:id" element={<MonitoringDashboard />} />
            <Route path="/iot/:id" element={<IoTDashboard />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
