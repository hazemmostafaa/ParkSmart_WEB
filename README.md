# ParkSmart - Smart Parking IoT Control Center

ParkSmart is a polished, frontend-only supervisor demo for a Smart Parking IoT Management System. It is designed for presentations where supervisors need to quickly understand parking occupancy, sensor health, payments, maintenance, alerts, and data-flow readiness.

## Frontend-Only Architecture

This version intentionally does not include a backend, database, authentication, SQL Server, SSIS integration, payment API, or real IoT connection.

The app runs entirely in React with simulated local data:

- React + TypeScript + Vite
- Material UI
- React Router
- Recharts
- React Icons
- Dedicated mock data under `src/data/mockData.ts`
- Shared model types under `src/types/models.ts`

## How To Install

```bash
npm install
```

## How To Run

```bash
npm run dev
```

Then open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Build Check

```bash
npx tsc --noEmit
npm run build
```

## Mock Data

All operational data is generated locally in `src/data/mockData.ts`. The demo includes:

- 1,800 parking spaces across five lots
- Parking lot occupancy and availability
- Sensor status, battery, signal, firmware, and alerts
- Payment transactions and revenue trends
- Maintenance issues
- Alerts and events
- Business-friendly system health pipeline

The data is kept centralized so it can later be replaced by real API calls without redesigning the UI.

## Future Integration Points

The current mock data layer can be replaced with services that connect to:

- SQL Server or staging-derived REST APIs
- Real IoT sensor feeds
- Payment providers
- Maintenance workflows
- Operational alert/event streams

For this supervisor demo, those integrations are intentionally not implemented.
