export type SpaceStatus = 'Available' | 'Occupied' | 'Reserved' | 'Out of Service' | 'Sensor Fault';
export type SessionStatus = 'Idle' | 'Active' | 'Reserved' | 'Closed' | 'Blocked';
export type SpaceType = 'Regular' | 'VIP' | 'Accessible' | 'Electric Vehicle Charging' | 'Motorcycle' | 'Family Parking';
export type SensorState = 'Online' | 'Offline' | 'Warning' | 'Fault';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';
export type MaintenanceStatus = 'Open' | 'In Progress' | 'Completed';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type HealthStatus = 'Healthy' | 'Warning' | 'Attention';

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  city: string;
  totalSpaces: number;
  occupied: number;
  available: number;
  reserved: number;
  outOfService: number;
  sensorFault: number;
  openingTime: string;
  closingTime: string;
  status: 'Healthy' | 'Busy' | 'Congested' | 'Service Required';
}

export interface ParkingSpace {
  spaceId: number;
  lotId: string;
  zoneId: string;
  zoneName: string;
  floor: number;
  spaceNumber: string;
  spaceType: SpaceType;
  currentStatus: SpaceStatus;
  sessionStatus: SessionStatus;
  sensorId: string;
}

export interface Sensor {
  sensorId: string;
  lotId: string;
  spaceId: number;
  spaceNumber: string;
  status: SensorState;
  battery: number;
  lastSeen: string;
  signal: number;
  firmware: string;
  alert: string;
}

export interface Payment {
  transactionId: string;
  lotId: string;
  spaceNumber: string;
  amount: number;
  paymentMethod: 'Visa' | 'MasterCard' | 'Mobile Wallet' | 'QR Code' | 'Cash';
  status: PaymentStatus;
  timestamp: string;
}

export interface MaintenanceIssue {
  issueId: string;
  lotId: string;
  spaceNumber: string;
  issueType: string;
  priority: Priority;
  status: MaintenanceStatus;
  created: string;
  assignedTo: string;
  lastUpdated: string;
}

export interface AlertEvent {
  id: string;
  message: string;
  type: string;
  location: string;
  severity: Severity;
  status: 'Open' | 'Acknowledged' | 'Resolved';
  timestamp: string;
}

export interface ParkingSession {
  sessionId: string;
  lotId: string;
  spaceNumber: string;
  plateNumber: string;
  startedAt: string;
  durationMinutes: number;
  status: 'Active' | 'Completed';
}

export interface SystemHealth {
  stage: string;
  description: string;
  status: HealthStatus;
  lastSync: string;
}

export interface DashboardMetrics {
  totalSpaces: number;
  occupied: number;
  available: number;
  occupancyPercent: number;
  sensorsOnline: number;
  sensorsOffline: number;
  sensorsWarning: number;
  sensorsFault: number;
  lowBattery: number;
  openMaintenanceIssues: number;
  todayRevenue: number;
  transactionsToday: number;
  failedPayments: number;
}

export interface TimeSeriesPoint {
  label: string;
  occupied: number;
  available: number;
}

export interface NamedValue {
  name: string;
  value: number;
}
