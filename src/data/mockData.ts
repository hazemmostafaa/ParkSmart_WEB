import {
  AlertEvent,
  DashboardMetrics,
  MaintenanceIssue,
  NamedValue,
  ParkingLot,
  ParkingSession,
  ParkingSpace,
  Payment,
  Sensor,
  SensorState,
  SessionStatus,
  SpaceStatus,
  SpaceType,
  SystemHealth,
  TimeSeriesPoint
} from '../types/models';
import { percent } from '../utils/format';

const now = new Date();
const isoMinutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();
const pad = (value: number, size = 3) => String(value).padStart(size, '0');

export const parkingLots: ParkingLot[] = [
  {
    id: 'LOT-NORTH',
    name: 'North Parking Lot',
    address: '100 North Gate Road',
    city: 'New Cairo',
    totalSpaces: 420,
    occupied: 374,
    available: 29,
    reserved: 8,
    outOfService: 5,
    sensorFault: 4,
    openingTime: '06:00',
    closingTime: '02:00',
    status: 'Congested'
  },
  {
    id: 'LOT-SOUTH',
    name: 'South Parking Lot',
    address: '24 South Access Avenue',
    city: 'New Cairo',
    totalSpaces: 360,
    occupied: 204,
    available: 130,
    reserved: 17,
    outOfService: 5,
    sensorFault: 4,
    openingTime: '06:00',
    closingTime: '00:00',
    status: 'Healthy'
  },
  {
    id: 'LOT-MAIN',
    name: 'Main Parking Lot',
    address: '1 Central Plaza',
    city: 'New Cairo',
    totalSpaces: 520,
    occupied: 334,
    available: 156,
    reserved: 18,
    outOfService: 7,
    sensorFault: 5,
    openingTime: '05:30',
    closingTime: '02:30',
    status: 'Busy'
  },
  {
    id: 'LOT-VISITOR',
    name: 'Visitor Parking',
    address: '55 Visitor Boulevard',
    city: 'New Cairo',
    totalSpaces: 220,
    occupied: 101,
    available: 107,
    reserved: 6,
    outOfService: 3,
    sensorFault: 3,
    openingTime: '07:00',
    closingTime: '23:00',
    status: 'Healthy'
  },
  {
    id: 'LOT-EMPLOYEE',
    name: 'Employee Parking',
    address: '9 Operations Drive',
    city: 'New Cairo',
    totalSpaces: 280,
    occupied: 113,
    available: 143,
    reserved: 3,
    outOfService: 16,
    sensorFault: 5,
    openingTime: '24 hours',
    closingTime: '24 hours',
    status: 'Service Required'
  }
];

const statusQueue = (lot: ParkingLot): SpaceStatus[] => [
  ...Array(lot.occupied).fill('Occupied'),
  ...Array(lot.available).fill('Available'),
  ...Array(lot.reserved).fill('Reserved'),
  ...Array(lot.outOfService).fill('Out of Service'),
  ...Array(lot.sensorFault).fill('Sensor Fault')
];

const shuffledStatuses = (lot: ParkingLot) => {
  const queue = statusQueue(lot);
  const result = [...queue];
  for (let index = 0; index < result.length; index += 1) {
    const swapIndex = (index * 37 + 17) % result.length;
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

const spaceTypeFor = (index: number, floor: number): SpaceType => {
  if (floor === 1 && index <= 24) return 'VIP';
  if (index % 29 === 0) return 'Accessible';
  if (index % 23 === 0) return 'Electric Vehicle Charging';
  if (index % 19 === 0) return 'Family Parking';
  if (index % 17 === 0) return 'Motorcycle';
  return 'Regular';
};

const sessionStatusFor = (status: SpaceStatus): SessionStatus => {
  if (status === 'Occupied') return 'Active';
  if (status === 'Reserved') return 'Reserved';
  if (status === 'Available') return 'Idle';
  return 'Blocked';
};

export const parkingSpaces: ParkingSpace[] = parkingLots.flatMap((lot, lotIndex) => {
  const statuses = shuffledStatuses(lot);
  const zones = ['A', 'B', 'C', 'D', 'E'];
  return Array.from({ length: lot.totalSpaces }, (_, index) => {
    const floor = Math.floor(index / Math.ceil(lot.totalSpaces / 3)) + 1;
    const zoneName = zones[index % zones.length];
    const currentStatus = statuses[index];
    const spaceId = lotIndex * 10000 + index + 1;
    return {
      spaceId,
      lotId: lot.id,
      zoneId: `${lot.id}-Z${zoneName}`,
      zoneName: `Zone ${zoneName}`,
      floor,
      spaceNumber: `${zoneName}-${pad(index + 1)}`,
      spaceType: spaceTypeFor(index + 1, floor),
      currentStatus,
      sessionStatus: sessionStatusFor(currentStatus),
      sensorId: `S-${pad(spaceId, 4)}`
    };
  });
});

const sensorStateFor = (index: number, space: ParkingSpace): SensorState => {
  if (space.currentStatus === 'Sensor Fault') return 'Fault';
  if (index % 43 === 0) return 'Offline';
  if (index % 67 === 0) return 'Warning';
  return 'Online';
};

export const sensors: Sensor[] = parkingSpaces.map((space, index) => {
  const status = sensorStateFor(index + 1, space);
  const lowBattery = index % 61 === 0 || status === 'Warning';
  const battery = status === 'Offline' ? 0 : lowBattery ? 14 + (index % 10) : 64 + (index % 34);
  return {
    sensorId: space.sensorId,
    lotId: space.lotId,
    spaceId: space.spaceId,
    spaceNumber: space.spaceNumber,
    status,
    battery,
    lastSeen: isoMinutesAgo(status === 'Online' ? index % 12 : 45 + (index % 480)),
    signal: status === 'Offline' ? 0 : status === 'Fault' ? 21 : 66 + (index % 30),
    firmware: `v${2 + (index % 2)}.${7 + (index % 3)}.${index % 9}`,
    alert:
      status === 'Fault'
        ? 'Occupancy sensor fault detected'
        : status === 'Offline'
          ? 'No communication from device'
          : lowBattery
            ? 'Battery below operating threshold'
            : 'No active alert'
  };
});

const paymentMethods: Payment['paymentMethod'][] = ['Visa', 'MasterCard', 'Mobile Wallet', 'QR Code', 'Cash'];
const paymentStatuses: Payment['status'][] = ['Completed', 'Completed', 'Completed', 'Completed', 'Pending', 'Failed', 'Refunded'];

export const payments: Payment[] = Array.from({ length: 96 }, (_, index) => {
  const lot = parkingLots[index % parkingLots.length];
  const lotSpaces = parkingSpaces.filter((space) => space.lotId === lot.id);
  const space = lotSpaces[(index * 13) % lotSpaces.length];
  return {
    transactionId: `TX-${pad(9100 + index, 5)}`,
    lotId: lot.id,
    spaceNumber: space.spaceNumber,
    amount: 18 + (index % 9) * 7,
    paymentMethod: paymentMethods[index % paymentMethods.length],
    status: paymentStatuses[index % paymentStatuses.length],
    timestamp: isoMinutesAgo(index * 8 + 3)
  };
});

const issueTypes = [
  'Sensor malfunction',
  'Barrier issue',
  'Payment terminal issue',
  'Parking-space sensor battery',
  'Network connectivity',
  'Lighting issue'
];
const assignees = ['Mona Adel', 'Karim Fouad', 'Nadine Sami', 'Omar Hassan', 'Salma Youssef'];

export const maintenanceIssues: MaintenanceIssue[] = Array.from({ length: 34 }, (_, index) => {
  const lot = parkingLots[index % parkingLots.length];
  const lotSpaces = parkingSpaces.filter((space) => space.lotId === lot.id);
  const space = lotSpaces[(index * 31) % lotSpaces.length];
  const status = index % 5 === 0 ? 'Completed' : index % 3 === 0 ? 'In Progress' : 'Open';
  return {
    issueId: `M-${pad(700 + index, 4)}`,
    lotId: lot.id,
    spaceNumber: space.spaceNumber,
    issueType: issueTypes[index % issueTypes.length],
    priority: index % 11 === 0 ? 'Critical' : index % 4 === 0 ? 'High' : index % 2 === 0 ? 'Medium' : 'Low',
    status,
    created: isoMinutesAgo(120 + index * 63),
    assignedTo: assignees[index % assignees.length],
    lastUpdated: isoMinutesAgo(index * 17 + 8)
  };
});

export const alerts: AlertEvent[] = [
  ['Sensor S-1042 offline', 'Sensor', 'North Parking Lot / A-118', 'High', 'Open', 4],
  ['North Lot occupancy above 90%', 'Occupancy', 'North Parking Lot', 'Critical', 'Open', 7],
  ['Payment terminal failed', 'Payment', 'Main Parking Lot / Terminal 03', 'High', 'Acknowledged', 12],
  ['Maintenance issue opened', 'Maintenance', 'Employee Parking / D-044', 'Medium', 'Open', 18],
  ['Parking Space 104 changed to occupied', 'Space', 'Visitor Parking / B-104', 'Info', 'Resolved', 22],
  ['Sensor battery below 15%', 'Sensor', 'South Parking Lot / C-212', 'Medium', 'Open', 31],
  ['Barrier response latency elevated', 'Access', 'Main Parking Lot / East Gate', 'Low', 'Acknowledged', 44],
  ['Refund issued after failed payment', 'Payment', 'North Parking Lot / C-088', 'Low', 'Resolved', 58],
  ['Lighting maintenance due', 'Maintenance', 'Employee Parking / Floor 2', 'Medium', 'Open', 73],
  ['Sensor feed delay detected', 'System', 'Sensor Feed', 'Low', 'Acknowledged', 95]
].map(([message, type, location, severity, status, minutes], index) => ({
  id: `A-${pad(index + 1, 3)}`,
  message: String(message),
  type: String(type),
  location: String(location),
  severity: severity as AlertEvent['severity'],
  status: status as AlertEvent['status'],
  timestamp: isoMinutesAgo(Number(minutes))
}));

export const parkingSessions: ParkingSession[] = parkingSpaces
  .filter((space) => space.currentStatus === 'Occupied')
  .slice(0, 120)
  .map((space, index) => ({
    sessionId: `PS-${pad(5000 + index, 5)}`,
    lotId: space.lotId,
    spaceNumber: space.spaceNumber,
    plateNumber: `${['ABC', 'NCP', 'TRK', 'EV'][index % 4]}-${pad(100 + index, 4)}`,
    startedAt: isoMinutesAgo(12 + index * 4),
    durationMinutes: 12 + index * 4,
    status: 'Active'
  }));

export const systemHealth: SystemHealth[] = [
  ['Source / Landing', 'Operational source extracts are arriving on schedule.', 'Healthy', 3],
  ['Data Processing', 'Validation and business rules are processing normally.', 'Healthy', 5],
  ['Staging', 'Parking lot, space, zone, employee, and maintenance staging are current.', 'Healthy', 7],
  ['Sensor Feed', 'Sensor status area is simulated until staging is completed.', 'Healthy', 1],
  ['Payment Feed', 'Payment monitoring is simulated until staging is completed.', 'Healthy', 2],
  ['IoT Parking Operations', 'Supervisor operations view is refreshed from demo data.', 'Healthy', 1],
  ['Supervisor Dashboard', 'Presentation dashboard is ready.', 'Healthy', 0]
].map(([stage, description, status, minutes]) => ({
  stage: String(stage),
  description: String(description),
  status: status as SystemHealth['status'],
  lastSync: isoMinutesAgo(Number(minutes))
}));

export const occupancyTrend: TimeSeriesPoint[] = Array.from({ length: 24 }, (_, index) => {
  const hour = (now.getHours() - 23 + index + 24) % 24;
  const occupied = Math.round(740 + Math.sin(index / 2.4) * 180 + index * 13);
  return {
    label: `${pad(hour, 2)}:00`,
    occupied: Math.min(1380, occupied),
    available: 1800 - Math.min(1380, occupied)
  };
});

export const revenueTrend: NamedValue[] = Array.from({ length: 12 }, (_, index) => ({
  name: `${pad((now.getHours() - 11 + index + 24) % 24, 2)}:00`,
  value: 680 + (index % 5) * 220 + index * 75
}));

export const sensorHealthChart: NamedValue[] = [
  { name: 'Online', value: sensors.filter((sensor) => sensor.status === 'Online').length },
  { name: 'Offline', value: sensors.filter((sensor) => sensor.status === 'Offline').length },
  { name: 'Warning', value: sensors.filter((sensor) => sensor.status === 'Warning').length },
  { name: 'Fault', value: sensors.filter((sensor) => sensor.status === 'Fault').length }
];

export const dashboardMetrics: DashboardMetrics = {
  totalSpaces: parkingLots.reduce((sum, lot) => sum + lot.totalSpaces, 0),
  occupied: parkingLots.reduce((sum, lot) => sum + lot.occupied, 0),
  available: parkingLots.reduce((sum, lot) => sum + lot.available, 0),
  occupancyPercent: percent(
    parkingLots.reduce((sum, lot) => sum + lot.occupied, 0),
    parkingLots.reduce((sum, lot) => sum + lot.totalSpaces, 0)
  ),
  sensorsOnline: sensors.filter((sensor) => sensor.status === 'Online').length,
  sensorsOffline: sensors.filter((sensor) => sensor.status === 'Offline').length,
  sensorsWarning: sensors.filter((sensor) => sensor.status === 'Warning').length,
  sensorsFault: sensors.filter((sensor) => sensor.status === 'Fault').length,
  lowBattery: sensors.filter((sensor) => sensor.battery > 0 && sensor.battery < 20).length,
  openMaintenanceIssues: maintenanceIssues.filter((issue) => issue.status !== 'Completed').length,
  todayRevenue: payments.filter((payment) => payment.status === 'Completed').reduce((sum, payment) => sum + payment.amount, 0),
  transactionsToday: payments.length,
  failedPayments: payments.filter((payment) => payment.status === 'Failed').length
};

export const getLotById = (id: string) => parkingLots.find((lot) => lot.id === id);

export const getLotName = (id: string) => getLotById(id)?.name || id;
