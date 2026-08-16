import { Chip } from '@mui/material';
import { HealthStatus, MaintenanceStatus, PaymentStatus, SensorState, Severity, SpaceStatus } from '../types/models';

type StatusValue = SpaceStatus | SensorState | PaymentStatus | MaintenanceStatus | Severity | HealthStatus | string;

const colorFor = (status: StatusValue): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
  const value = status.toLowerCase();
  if (['available', 'online', 'completed', 'healthy', 'resolved', 'low', 'info'].includes(value)) return 'success';
  if (['occupied', 'busy', 'acknowledged', 'medium', 'pending', 'in progress', 'warning'].includes(value)) return 'warning';
  if (['critical', 'high', 'failed', 'fault', 'offline', 'out of service', 'sensor fault', 'attention'].includes(value)) return 'error';
  if (['reserved', 'open', 'refunded', 'congested'].includes(value)) return 'info';
  return 'default';
};

export const StatusBadge = ({ status }: { status: StatusValue }) => (
  <Chip size="small" label={status} color={colorFor(status)} variant="filled" />
);
