import { Link, useParams } from 'react-router-dom';
import { Alert, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { MdChevronLeft } from 'react-icons/md';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { ParkingSpaceTile } from '../components/ParkingSpaceTile';
import { StatusBadge } from '../components/StatusBadge';
import { alerts, getLotById, maintenanceIssues, parkingSpaces, payments, sensors } from '../data/mockData';
import { formatCurrency, formatDateTime, percent } from '../utils/format';

export const ParkingLotDetailPage = () => {
  const { id = '' } = useParams();
  const lot = getLotById(id);

  if (!lot) {
    return <Alert severity="error">Parking lot not found.</Alert>;
  }

  const lotSpaces = parkingSpaces.filter((space) => space.lotId === lot.id);
  const lotSensors = sensors.filter((sensor) => sensor.lotId === lot.id);
  const lotAlerts = alerts.filter((alert) => alert.location.includes(lot.name)).slice(0, 6);
  const lotMaintenance = maintenanceIssues.filter((issue) => issue.lotId === lot.id).slice(0, 6);
  const lotPayments = payments.filter((payment) => payment.lotId === lot.id).slice(0, 6);

  return (
    <Stack spacing={3}>
      <Button component={Link} to="/parking-lots" startIcon={<MdChevronLeft />} sx={{ alignSelf: 'flex-start' }}>
        Parking Lots
      </Button>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
        <div>
          <Typography variant="h4">{lot.name}</Typography>
          <Typography color="text.secondary">
            {lot.address}, {lot.city}
          </Typography>
        </div>
        <StatusBadge status={lot.status} />
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Occupancy" value={`${percent(lot.occupied, lot.totalSpaces)}%`} helper={`${lot.occupied} of ${lot.totalSpaces}`} icon="%" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Available Spaces" value={lot.available} helper={`${lot.reserved} reserved`} icon="P" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Sensor Health" value={lotSensors.filter((sensor) => sensor.status === 'Online').length} helper={`${lotSensors.filter((sensor) => sensor.status !== 'Online').length} need attention`} icon="S" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Payment Activity" value={formatCurrency(lotPayments.reduce((sum, payment) => sum + payment.amount, 0))} helper="Recent transactions" icon="$" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Visual Parking-Space Map
          </Typography>
          <div className="space-grid large">
            {lotSpaces.slice(0, 180).map((space) => (
              <ParkingSpaceTile key={space.spaceId} space={space} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Events
              </Typography>
              <DataTable
                rows={lotAlerts}
                getRowKey={(row) => row.id}
                columns={[
                  { key: 'message', label: 'Event' },
                  { key: 'severity', label: 'Severity', render: (row) => <StatusBadge status={row.severity} /> }
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Maintenance Issues
              </Typography>
              <DataTable
                rows={lotMaintenance}
                getRowKey={(row) => row.issueId}
                columns={[
                  { key: 'issueType', label: 'Issue' },
                  { key: 'priority', label: 'Priority', render: (row) => <StatusBadge status={row.priority} /> },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Activity
              </Typography>
              <DataTable
                rows={lotPayments}
                getRowKey={(row) => row.transactionId}
                columns={[
                  { key: 'transactionId', label: 'ID' },
                  { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
                  { key: 'timestamp', label: 'Time', render: (row) => formatDateTime(row.timestamp) }
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
