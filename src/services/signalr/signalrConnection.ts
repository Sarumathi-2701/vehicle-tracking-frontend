import * as signalR from '@microsoft/signalr'
import { VehicleTelemetry, LatLng, VehicleAlert } from '@/types/gps'
import { calculateBearing } from '@/utils/gpsUtils'

type TelemetryCallback = (telemetry: VehicleTelemetry) => void
type AlertCallback = (alert: VehicleAlert) => void

class SignalRConnectionService {
  private hubConnection: signalR.HubConnection | null = null
  private telemetryCallbacks: Set<TelemetryCallback> = new Set()
  private alertCallbacks: Set<AlertCallback> = new Set()
  private simulationInterval: ReturnType<typeof setInterval> | null = null
  private isSimulating: boolean = false
  private isConnected: boolean = false

  // Simulation state for demo vehicles
  private simulationVehicles: Array<{
    vehicleId: string
    name: string
    plate: string
    currentLat: number
    currentLng: number
    targetLat: number
    targetLng: number
    speed: number
    heading: number
    fuel: number
    batteryVolts: number
    ignition: boolean
    odometer: number
    routeIndex: number
    route: LatLng[]
  }> = []

  constructor() {
    this.initSimulationVehicles()
  }

  private initSimulationVehicles() {
    // Bangalore urban routes around MG Road, Indiranagar, Electronic City, Whitefield
    this.simulationVehicles = [
      {
        vehicleId: 'veh-001',
        name: 'Prime Logistics Hauler #101',
        plate: 'KA-01-MJ-4921',
        currentLat: 12.9716,
        currentLng: 77.5946,
        targetLat: 12.9780,
        targetLng: 77.6408,
        speed: 52,
        heading: 75,
        fuel: 82,
        batteryVolts: 24.2,
        ignition: true,
        odometer: 12450.5,
        routeIndex: 0,
        route: [
          { lat: 12.9716, lng: 77.5946 },
          { lat: 12.9750, lng: 77.6050 },
          { lat: 12.9785, lng: 77.6200 },
          { lat: 12.9820, lng: 77.6350 },
          { lat: 12.9780, lng: 77.6408 },
          { lat: 12.9650, lng: 77.6380 },
          { lat: 12.9550, lng: 77.6150 },
          { lat: 12.9716, lng: 77.5946 },
        ],
      },
      {
        vehicleId: 'veh-002',
        name: 'Express Courier Van #42',
        plate: 'KA-03-EX-9912',
        currentLat: 12.9352,
        currentLng: 77.6245,
        targetLat: 12.9180,
        targetLng: 77.6050,
        speed: 44,
        heading: 210,
        fuel: 64,
        batteryVolts: 12.8,
        ignition: true,
        odometer: 48902.0,
        routeIndex: 0,
        route: [
          { lat: 12.9352, lng: 77.6245 },
          { lat: 12.9250, lng: 77.6180 },
          { lat: 12.9180, lng: 77.6050 },
          { lat: 12.9120, lng: 77.5920 },
          { lat: 12.9200, lng: 77.5850 },
          { lat: 12.9352, lng: 77.6245 },
        ],
      },
      {
        vehicleId: 'veh-003',
        name: 'Cold Chain Pharma Truck #12',
        plate: 'KA-05-CC-3321',
        currentLat: 12.9900,
        currentLng: 77.5500,
        targetLat: 13.0100,
        targetLng: 77.5700,
        speed: 68,
        heading: 45,
        fuel: 91,
        batteryVolts: 24.6,
        ignition: true,
        odometer: 8931.2,
        routeIndex: 0,
        route: [
          { lat: 12.9900, lng: 77.5500 },
          { lat: 13.0010, lng: 77.5620 },
          { lat: 13.0100, lng: 77.5700 },
          { lat: 13.0250, lng: 77.5800 },
          { lat: 13.0150, lng: 77.5600 },
          { lat: 12.9900, lng: 77.5500 },
        ],
      },
      {
        vehicleId: 'veh-004',
        name: 'Executive Airport Shuttle #07',
        plate: 'KA-51-AP-7700',
        currentLat: 13.1986,
        currentLng: 77.7066,
        targetLat: 13.1500,
        targetLng: 77.6800,
        speed: 0,
        heading: 180,
        fuel: 48,
        batteryVolts: 12.4,
        ignition: false,
        odometer: 64100.8,
        routeIndex: 0,
        route: [
          { lat: 13.1986, lng: 77.7066 },
          { lat: 13.1500, lng: 77.6800 },
          { lat: 13.0800, lng: 77.6400 },
          { lat: 13.1986, lng: 77.7066 },
        ],
      },
    ]
  }

  public async startConnection(): Promise<void> {
    const hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5000/hubs/telemetry'

    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(signalR.LogLevel.Warning)
        .build()

      this.hubConnection.on('ReceiveTelemetry', (telemetry: VehicleTelemetry) => {
        this.notifyTelemetry(telemetry)
      })

      this.hubConnection.on('ReceiveAlert', (alert: VehicleAlert) => {
        this.notifyAlert(alert)
      })

      await this.hubConnection.start()
      this.isConnected = true
      console.log('SignalR Hub Connected successfully.')
    } catch {
      console.info('Live SignalR Hub unavailable. Activating high-precision GPS simulation mode.')
      this.startLocalSimulation()
    }
  }

  public startLocalSimulation(): void {
    if (this.isSimulating) return
    this.isSimulating = true

    let tick = 0
    this.simulationInterval = setInterval(() => {
      tick++

      // Pick vehicles and drift them along their routes
      this.simulationVehicles.forEach((veh) => {
        if (!veh.ignition) {
          // Send idle/stopped telemetry occasionally
          const telemetry: VehicleTelemetry = {
            vehicleId: veh.vehicleId,
            location: {
              lat: veh.currentLat,
              lng: veh.currentLng,
              heading: veh.heading,
              speedKmh: 0,
              timestamp: new Date().toISOString(),
              address: 'Terminal Parking Bay, Bangalore North',
              satellitesCount: 14,
            },
            ignition: false,
            batteryVolts: veh.batteryVolts,
            batteryPercent: 94,
            fuelLevelPercent: veh.fuel,
            engineTempCelsius: 38,
            odometerKm: veh.odometer,
            isOverspeeding: false,
            isGeofenceViolated: false,
          }
          this.notifyTelemetry(telemetry)
          return
        }

        const target = veh.route[veh.routeIndex]
        const step = 0.00065 // Roughly 60-70 km/h simulation step

        const dLat = target.lat - veh.currentLat
        const dLng = target.lng - veh.currentLng
        const dist = Math.sqrt(dLat * dLat + dLng * dLng)

        if (dist < 0.001) {
          // Switch to next waypoint in path
          veh.routeIndex = (veh.routeIndex + 1) % veh.route.length
        } else {
          const ratio = Math.min(1, step / dist)
          veh.currentLat += dLat * ratio
          veh.currentLng += dLng * ratio
          veh.heading = calculateBearing(
            { lat: veh.currentLat - dLat * ratio, lng: veh.currentLng - dLng * ratio },
            { lat: veh.currentLat, lng: veh.currentLng }
          )
          veh.odometer += 0.04
        }

        // Slight speed fluctuations
        const baseSpeed = veh.vehicleId === 'veh-001' ? 58 : 68
        veh.speed = Math.max(20, Math.min(95, baseSpeed + Math.sin(tick / 3) * 15))

        const isOverspeeding = veh.speed > 80

        const telemetry: VehicleTelemetry = {
          vehicleId: veh.vehicleId,
          location: {
            lat: veh.currentLat,
            lng: veh.currentLng,
            heading: veh.heading,
            speedKmh: Math.round(veh.speed),
            timestamp: new Date().toISOString(),
            satellitesCount: 16,
            accuracyMeters: 2.5,
            address: `Transit Corridor near Sector ${((tick % 8) + 1)}, Bangalore`,
          },
          ignition: true,
          batteryVolts: Number((veh.batteryVolts + Math.random() * 0.2 - 0.1).toFixed(1)),
          batteryPercent: 98,
          fuelLevelPercent: Math.max(10, Math.round(veh.fuel - (tick * 0.005) % 10)),
          engineTempCelsius: 88 + Math.round(Math.sin(tick) * 4),
          odometerKm: Number(veh.odometer.toFixed(1)),
          isOverspeeding,
          isGeofenceViolated: false,
        }

        this.notifyTelemetry(telemetry)

        // Occasionally fire an alert if overspeeding
        if (isOverspeeding && tick % 12 === 0) {
          this.notifyAlert({
            id: `alt-${Date.now()}-${veh.vehicleId}`,
            vehicleId: veh.vehicleId,
            vehicleName: veh.name,
            plateNumber: veh.plate,
            type: 'overspeed',
            severity: 'warning',
            message: `${veh.name} reached ${Math.round(veh.speed)} km/h (Limit: 80 km/h)`,
            timestamp: new Date().toISOString(),
            location: { lat: veh.currentLat, lng: veh.currentLng },
            isAcknowledged: false,
          })
        }
      })
    }, 2500)
  }

  public subscribeTelemetry(callback: TelemetryCallback): () => void {
    this.telemetryCallbacks.add(callback)
    return () => {
      this.telemetryCallbacks.delete(callback)
    }
  }

  public subscribeAlerts(callback: AlertCallback): () => void {
    this.alertCallbacks.add(callback)
    return () => {
      this.alertCallbacks.delete(callback)
    }
  }

  private notifyTelemetry(telemetry: VehicleTelemetry) {
    this.telemetryCallbacks.forEach((cb) => cb(telemetry))
  }

  private notifyAlert(alert: VehicleAlert) {
    this.alertCallbacks.forEach((cb) => cb(alert))
  }

  public stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval)
      this.simulationInterval = null
    }
    this.isSimulating = false
  }

  public async stopConnection(): Promise<void> {
    this.stopSimulation()
    if (this.hubConnection) {
      await this.hubConnection.stop()
      this.isConnected = false
    }
  }
}

export const signalRService = new SignalRConnectionService()
export default signalRService
