# 🛰️ GPS Vehicle Tracking & Fleet Telematics System

An enterprise-grade GPS based vehicle tracking application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Leaflet** (OpenStreetMap), **Zustand**, and **Vite**.

## ✨ Key Features

- **Live Real-Time Map Tracking**: Live vehicle movements, dynamic map center tracking, status indicators (moving, idle, stopped, offline), speedometers, route trails, and interactive vehicle popups.
- **Real-Time GPS Simulation Engine**: Embedded realistic telemetry simulator with live coordinate drift, bearing calculation, speed changes, fuel/battery consumption, and SignalR integration.
- **Fleet Management**: Comprehensive vehicle inventory, driver assignments, license plate, VIN, GPS device IMEI, status filtering, and modal CRUD operations.
- **Trip History & Playback**: Historic trip logs with route replay slider, stop durations, peak speed, and distance calculations.
- **Alerts & Geofencing**: Real-time violation alerts for overspeeding, geofence breaches, SOS, and maintenance warnings.
- **Analytics & Reports**: Fleet mileage breakdown, idle hours, fuel economy metrics, and data export.
- **Modern Dark UI**: Designed with Tailwind CSS v4, sleek glassmorphism, responsive navigation, and status badges.

## 📁 Project Architecture

```
gps-vehicle-tracking/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── tables/
│   │   └── map/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── vehicles/
│   │   ├── tracking/
│   │   ├── trips/
│   │   ├── alerts/
│   │   ├── reports/
│   │   └── settings/
│   ├── hooks/
│   ├── services/
│   │   ├── api/
│   │   ├── signalr/
│   │   └── storage/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   ├── main.tsx
│   └── vite-env.d.ts
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run in development mode**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```
