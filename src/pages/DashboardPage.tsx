import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import {
  MdBuild,
  MdChevronRight,
  MdEvent,
  MdLocalParking,
  MdPayments,
  MdSensors
} from 'react-icons/md';
import {
  alerts,
  dashboardMetrics,
  maintenanceIssues,
  occupancyTrend,
  parkingLots,
  payments,
  revenueTrend,
  sensorHealthChart
} from '../data/mockData';
import { ChartCard, OccupancyChart, RevenueChart, SensorHealthChart } from '../components/Charts';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, formatDateTime, formatNumber } from '../utils/format';

export const DashboardPage = () => {
  const [pulse] = useState(0);
  const metrics = useMemo(
    () => ({
      ...dashboardMetrics,
      occupied: dashboardMetrics.occupied + pulse,
      available: dashboardMetrics.available - pulse
    }),
    [pulse]
  );

  const criticalAlerts = alerts.filter((alert) => ['Critical', 'High'].includes(alert.severity)).slice(0, 5);
  const recentPayments = payments.slice(0, 7);
  const openMaintenance = maintenanceIssues.filter((issue) => issue.status !== 'Completed').slice(0, 7);

  return (
    <Stack spacing={3}>
      <section className="dashboard-hero">
        <Stack spacing={2} sx={{ maxWidth: 820 }}>
          <img
  src={`${import.meta.env.BASE_URL}parksmart-logo.svg`}
  alt="ParkSmart"
  className="hero-logo"
/>
          <Typography variant="h3">Smart Parking IoT Control Center</Typography>
          <Typography variant="h6" color="text.secondary">
            Real-time supervisor view for occupancy, sensor health, payments, maintenance, and active events.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <StatusBadge status="Healthy" />
            <StatusBadge status="Prototype" />
            <StatusBadge status="Simulated IoT Data" />
          </Stack>
        </Stack>
      </section>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Total Parking Spaces" value={formatNumber(metrics.totalSpaces)} helper="Demo environment capacity" icon={<MdLocalParking />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Occupied" value={formatNumber(metrics.occupied)} helper={`${metrics.occupancyPercent}% occupancy`} icon={<MdLocalParking />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Available" value={formatNumber(metrics.available)} helper="Available now" icon={<MdLocalParking />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Occupancy %" value={`${metrics.occupancyPercent}%`} helper="Across all lots" icon={<MdChevronRight />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Sensors Online" value={formatNumber(metrics.sensorsOnline)} helper="Live telemetry" icon={<MdSensors />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Sensors Offline" value={formatNumber(metrics.sensorsOffline)} helper={`${metrics.sensorsFault} fault states`} icon={<MdSensors />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Open Maintenance" value={formatNumber(metrics.openMaintenanceIssues)} helper="Requires action" icon={<MdBuild />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Today's Revenue" value={formatCurrency(metrics.todayRevenue)} helper={`${metrics.transactionsToday} transactions`} icon={<MdPayments />} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} xl={7}>
          <ChartCard title="Parking Occupancy - Last 24 Hours">
            <OccupancyChart data={occupancyTrend} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6} xl={2.5}>
          <ChartCard title="Sensor Health">
            <SensorHealthChart data={sensorHealthChart} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6} xl={2.5}>
          <ChartCard title="Payment Revenue">
            <RevenueChart data={revenueTrend} />
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {parkingLots.map((lot) => (
          <Grid item xs={12} md={6} xl={2.4} key={lot.id}>
            <Card className="lot-card">
              <CardContent>
                <Stack spacing={1.4}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{lot.name}</Typography>
                    <StatusBadge status={lot.status} />
                  </Stack>
                  <div className="occupancy-bar">
                    <span style={{ width: `${(lot.occupied / lot.totalSpaces) * 100}%` }} />
                  </div>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{lot.occupied} occupied</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lot.available} available
                    </Typography>
                  </Stack>
                  <Button component={Link} to={`/parking-lots/${lot.id}`} endIcon={<MdChevronRight />} size="small">
                    View lot
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Alerts</Typography>
                <MdEvent />
              </Stack>
              <DataTable
                rows={criticalAlerts}
                getRowKey={(row) => row.id}
                columns={[
                  { key: 'message', label: 'Alert' },
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
                Recent Payments
              </Typography>
              <DataTable
                rows={recentPayments}
                getRowKey={(row) => row.transactionId}
                columns={[
                  { key: 'transactionId', label: 'ID' },
                  { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
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
                Maintenance
              </Typography>
              <DataTable
                rows={openMaintenance}
                getRowKey={(row) => row.issueId}
                columns={[
                  { key: 'issueType', label: 'Issue' },
                  { key: 'priority', label: 'Priority', render: (row) => <StatusBadge status={row.priority} /> },
                  { key: 'lastUpdated', label: 'Updated', render: (row) => formatDateTime(row.lastUpdated) }
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box />
    </Stack>
  );
};
