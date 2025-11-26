# Frontend Quick Start Guide

## 🎉 Frontend Build Complete!

The CCS Platform frontend is ready to test! All pages, modals, and navigation are implemented with mock data.

---

## What's Been Built

### ✅ Pages
1. **Home Page** (`/`) - Project overview dashboard with key metrics
2. **CO₂ Capture** (`/capture`) - Facilities and performance monitoring
3. **CO₂ Transport** (`/transport`) - Pipeline and vehicle fleet tracking
4. **CO₂ Sequestration** (`/sequestration`) - Injection and monitoring wells
5. **IoT Dashboard** (`/iot/:id`) - Real-time asset monitoring (template)

### ✅ Components
- **Layout** - Header with navigation tabs
- **Modal System** - Overlay modals using Headless UI
- **Mock Data** - Wells, facilities, pipelines, vehicle fleets

### ✅ Features
- Multi-page navigation with React Router
- Modal overlay system for selecting assets
- Click-through navigation from modals to IoT dashboards
- Responsive design with Tailwind CSS
- Document upload UI (placeholder)
- Performance metrics visualizations

---

## How to Run the Frontend

### Step 1: Install Dependencies

```bash
cd /home/ondrej/IOT_Test/frontend
npm install
```

This will install the new dependencies:
- `react-router-dom` - Routing
- `@headlessui/react` - Modal components
- `@heroicons/react` - Icons
- `date-fns-tz` - Timezone support
- `clsx` - Class name utility

### Step 2: Start Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## User Experience Flow

### Navigation Flow

```
Home Page
├── Click "CO₂ Capture" → Capture Page
│   ├── Click "View Facilities" → Modal opens
│   │   └── Click "View Dashboard" → IoT Dashboard (/iot/facility-1)
│   └── Click "View Performance" → Performance Modal
│
├── Click "CO₂ Transport" → Transport Page
│   ├── Click "View Pipelines" → Modal opens
│   │   └── Click "View Dashboard" → IoT Dashboard (/iot/pipeline-1)
│   └── Click "View Fleet" → Vehicle Fleet Modal
│
└── Click "CO₂ Sequestration" → Sequestration Page
    ├── Click "View Operations" (Injection) → Modal opens
    │   └── Click "View Dashboard" → IoT Dashboard (/iot/well-1)
    ├── Click "View Operations" (Monitoring) → Modal opens
    │   └── Click "View Dashboard" → IoT Dashboard (/iot/well-3)
    └── Click "Upload Document" → Document Upload Modal
```

### Testing Checklist

- [ ] Navigate to all pages from Home
- [ ] Open modals on each page
- [ ] Click through to IoT dashboards from modals
- [ ] Test back navigation
- [ ] Verify modal close functionality (X button and outside click)
- [ ] Check responsive layout on different screen sizes

---

## Mock Data Available

### Wells (Sequestration Page)
- **Injector Wells**: 2 wells
  - Injector Well #1: Operational, 150 t/day
  - Injector Well #2: Maintenance, 0 t/day
- **Monitoring Wells**: 2 wells
  - Monitoring Well #1: Pressure Monitoring
  - Monitoring Well #2: Geochemical Monitoring

### Capture Facilities (Capture Page)
- **Facility A**: Amine-based, 500 t/day capacity, 90% efficiency
- **Facility B**: Membrane, 300 t/day capacity, 92% efficiency

### Transport Assets (Transport Page)
- **Pipelines**: 2 pipelines
  - Pipeline 1: 45 km, 16", 600 t/day
  - Pipeline 2: 25 km, 12", 350 t/day
- **Vehicle Fleets**:
  - Trucks: 12 vehicles (8 active, 2 maintenance, 2 idle)
  - Rail: 6 vehicles (4 active, 1 maintenance, 1 idle)

---

## Known Limitations (To Be Implemented)

1. **Real-time Charts** - IoT Dashboard has placeholder for BME280 charts
2. **Backend API** - All data is currently mock data
3. **Authentication** - Login/logout buttons are placeholders
4. **Document Upload** - Shows alert, doesn't save files
5. **Maps** - Pipeline network and vehicle tracking maps are placeholders
6. **Performance Charts** - Capture performance has simple bar chart (static)

---

## Next Steps

### Option 1: Enhance Frontend
- Integrate existing BME280 charts into IoT Dashboard
- Add real-time data updates (when backend is ready)
- Implement actual document upload with preview
- Add search and filter functionality
- Create data export functionality

### Option 2: Build Backend
- Create API endpoints to serve real data
- Implement authentication
- Set up database connections
- Add MQTT integration for real-time updates

### Option 3: Refine UX
- Add loading states
- Improve error handling
- Add toast notifications
- Enhance mobile responsive design
- Add dark mode support

---

## File Structure

```
frontend/src/
├── pages/
│   ├── Home.tsx              # Landing page with overview
│   ├── Capture.tsx           # CO₂ capture facilities
│   ├── Transport.tsx         # Transport assets
│   ├── Sequestration.tsx     # Injection and monitoring wells
│   └── IoTDashboard.tsx      # Real-time monitoring template
├── components/
│   ├── layout/
│   │   └── Layout.tsx        # Main layout with nav
│   └── modals/
│       └── Modal.tsx         # Reusable modal component
├── lib/
│   └── mock-data/
│       ├── wells.ts          # Well data
│       ├── facilities.ts     # Capture facility data
│       └── transport.ts      # Pipeline and vehicle data
├── App.tsx                   # Router setup
└── main.tsx                  # Entry point
```

---

## Troubleshooting

### Issue: npm install fails
**Solution**: Make sure you're in the frontend directory:
```bash
cd /home/ondrej/IOT_Test/frontend
```

### Issue: Port 5173 already in use
**Solution**: Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

### Issue: Icons not showing
**Solution**: Heroicons may need to be installed:
```bash
npm install @heroicons/react@^2.0.18
```

### Issue: Modals not opening
**Solution**: Check that Headless UI is installed:
```bash
npm install @headlessui/react@^1.7.17
```

---

## Screenshots of Key Features

### Home Page
- Project overview cards
- Key metrics (CO₂ captured, active wells, status)
- Three main operation cards (Capture, Transport, Sequestration)
- Recent activity feed

### Modal System
- Overlay with dimmed background
- Smooth animations (fade in/out)
- Close on outside click or X button
- Wells/facilities list with "View Dashboard" buttons

### IoT Dashboard
- Asset-specific header
- Operational status banner
- Real-time metrics cards
- Sensor data display
- Alerts and notifications
- Action buttons (Export, Report, History)

---

## Questions?

Refer to:
- `ccs_platform_architecture.md` - Full architecture specification
- `REDESIGN_PROGRESS.md` - Overall project progress
- React Router docs: https://reactrouter.com
- Headless UI docs: https://headlessui.com
- Heroicons: https://heroicons.com

---

**Status**: Frontend prototype complete ✅
**Next**: Test user experience, then build backend APIs
