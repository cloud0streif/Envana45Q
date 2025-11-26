# Envana45Q Platform

A comprehensive Carbon Capture & Storage (CCS) monitoring and management platform for tracking CO₂ capture facilities, transportation networks, and sequestration operations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Envana45Q.git
cd Envana45Q
```

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at **http://localhost:5173**

### Build for Production

```bash
cd frontend
npm run build
```

The production build will be created in the `frontend/dist` directory.

## 📋 What's Included

### CCS Operations Dashboards

#### 1. **Home Dashboard** (`/`)
- Project overview and key metrics
- Quick access to all CCS operations
- Recent activity feed

#### 2. **CO₂ Capture** (`/capture`)
- Monitor AGRU Train #1 and AGRU Train #2
- Capture facility performance metrics
- Real-time sour gas, sweet gas, and CO₂ measurements
- Calibration document tracking with validity status
- Clickable meters showing dependent calibration reports

#### 3. **CO₂ Transport** (`/transport`)
- Pipeline segment monitoring (2 segments, 106 miles total)
- Pump station operations
- Real-time pressure, temperature, and flow measurements
- Capture plant and injection site outlet monitoring
- Transportation network visualization

#### 4. **CO₂ Sequestration** (`/sequestration`)
- Injector well operations (2 wells)
- Monitoring well tracking (2 wells)
- Injection rates and pressures
- Wellbore integrity monitoring
- Calibration reports for all measurement equipment

### Key Features

✅ **Clickable Measurement Cards** - Click any meter to see required calibration reports
✅ **Modal System** - View calibration documents with test dates and expiration dates
✅ **Time Period Selection** - View data by day, week, month, 6 months, year, YTD, or custom range
✅ **Real-time Charts** - Interactive charts using Recharts library
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Mock Data** - Fully functional with realistic mock data
✅ **Document Tracking** - Track calibration reports and compliance documents

## 🎨 Technology Stack

### Frontend
- **React 18+** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Headless UI** for modals and components
- **Heroicons** for icons
- **date-fns** for date formatting
- **Vite** for build tooling

## 📁 Project Structure

```
IOT_Test/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── pages/              # Dashboard pages
│   │   │   ├── Home.tsx        # Main dashboard
│   │   │   ├── Capture.tsx     # Capture facilities
│   │   │   ├── CaptureFacilityDashboard.tsx
│   │   │   ├── Transport.tsx   # Transportation network
│   │   │   ├── PipelineSegmentDashboard.tsx
│   │   │   ├── PumpStationDashboard.tsx
│   │   │   ├── CapturePlantOutletDashboard.tsx
│   │   │   ├── InjectionSiteOutletDashboard.tsx
│   │   │   ├── Sequestration.tsx  # Injection & monitoring
│   │   │   ├── InjectorDashboard.tsx
│   │   │   └── MonitoringDashboard.tsx
│   │   ├── components/
│   │   │   ├── layout/         # Layout components
│   │   │   ├── modals/         # Modal components
│   │   │   └── TransportNetworkMap.tsx
│   │   ├── lib/
│   │   │   └── mock-data/      # Mock data for all dashboards
│   │   ├── App.tsx             # Router configuration
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── backend/                     # FastAPI backend (optional)
├── database/                    # Database schemas
└── README.md
```

## 🎯 Usage Guide

### Navigation Flow

1. **Start at Home** - View project overview
2. **Select Operation Type**:
   - Click "CO₂ CAPTURE" → View and select facilities
   - Click "CO₂ TRANSPORT" → Monitor transport nodes
   - Click "CO₂ SEQUESTRATION" → Manage wells

3. **View Dashboards**:
   - Click on any facility/well/transport node
   - View real-time measurements and charts
   - Click on measurement cards to see calibration reports

4. **Check Calibrations**:
   - Click any meter on a dashboard
   - Modal shows all required calibration documents
   - See test dates, expiration dates, and validity status

### Dashboard Features

#### Measurement Cards
- Display current values with units
- Show validation status (Valid/Not Valid)
- Click to view required calibration reports
- Color-coded borders (teal for valid measurements)

#### Time Period Selector
- Day, Week, Month, 6 Months, Year, YTD
- Custom date range selection
- Updates all charts and calculations

#### Charts
- Interactive line charts
- Multiple y-axes for different units
- Hover tooltips with precise values
- Responsive sizing

## 📚 Documentation

- [Frontend Quick Start](FRONTEND_QUICK_START.md) - Detailed frontend guide
- [CCS Platform Architecture](ccs_platform_architecture.md) - System architecture
- [Capture Section Spec](co2_capture_section_spec.md) - Capture facilities
- [Transport Section Spec](co2_transportation_section_spec.md) - Transportation
- [Injector Dashboard Spec](injector_iot_dashboard_spec.md) - Injector wells
- [Monitoring Dashboard Spec](monitoring_well_iot_dashboard_spec.md) - Monitoring wells

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment

- Development server runs on `http://localhost:5173`
- Hot module replacement (HMR) enabled
- TypeScript type checking

## 🎨 Color Scheme

The platform uses the Envana brand colors:

- **Teal** (#1e7b7d) - Primary color, highlights, valid states
- **Coral** (#E57373) - Secondary color, warnings, transport
- **Brown** (#8B7564) - Text, headings
- **Cream** (#F5F1E8) - Background
- **Sidebar** (#EAE3D5) - Sidebar, cards

## 🚧 Upcoming Features

- Backend API integration
- Real-time data streaming via WebSockets
- User authentication and authorization
- Historical data export (CSV, Excel)
- Advanced analytics and reporting
- Mobile app companion
- Multi-project support
- Role-based access control

## 📝 License

This project is proprietary software for Coastal Bend CCS operations.

## 🤝 Contributing

This is a private repository. For access or questions, contact the project maintainers.

## 📞 Support

For technical support or questions:
- Check the documentation files in the repository
- Review the [FRONTEND_QUICK_START.md](FRONTEND_QUICK_START.md) guide
- Contact the development team

---

**Status**: Production Ready ✅
**Version**: 1.0.0
**Last Updated**: 2025
