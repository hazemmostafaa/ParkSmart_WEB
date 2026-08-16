import { useMemo, useState } from 'react';
import { Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { alerts, parkingLots } from '../data/mockData';
import { AlertEvent, Severity } from '../types/models';
import { formatDateTime } from '../utils/format';

const severities: Array<'All' | Severity> = ['All', 'Critical', 'High', 'Medium', 'Low', 'Info'];
const statuses: Array<'All' | AlertEvent['status']> = ['All', 'Open', 'Acknowledged', 'Resolved'];

export const AlertsPage = () => {
  const [severity, setSeverity] = useState<'All' | Severity>('All');
  const [status, setStatus] = useState<'All' | AlertEvent['status']>('All');
  const [location, setLocation] = useState('All');

  const filtered = useMemo(
    () =>
      alerts.filter(
        (alert) =>
          (severity === 'All' || alert.severity === severity) &&
          (status === 'All' || alert.status === status) &&
          (location === 'All' || alert.location.includes(location))
      ),
    [severity, status, location]
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Alerts & Events</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Critical" value={alerts.filter((alert) => alert.severity === 'Critical').length} icon="!" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="High" value={alerts.filter((alert) => alert.severity === 'High').length} icon="H" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Open" value={alerts.filter((alert) => alert.status === 'Open').length} icon="O" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Acknowledged" value={alerts.filter((alert) => alert.status === 'Acknowledged').length} icon="A" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Resolved" value={alerts.filter((alert) => alert.status === 'Resolved').length} icon="✓" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Severity" value={severity} onChange={(event) => setSeverity(event.target.value as Severity | 'All')}>
                {severities.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Status" value={status} onChange={(event) => setStatus(event.target.value as AlertEvent['status'] | 'All')}>
                {statuses.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Location" value={location} onChange={(event) => setLocation(event.target.value)}>
                <MenuItem value="All">All locations</MenuItem>
                {parkingLots.map((lot) => (
                  <MenuItem key={lot.id} value={lot.name}>
                    {lot.name}
                  </MenuItem>
                ))}
                <MenuItem value="Sensor Feed">Sensor Feed</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <DataTable
        rows={filtered}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'timestamp', label: 'Timestamp', render: (row) => formatDateTime(row.timestamp) },
          { key: 'type', label: 'Event Type' },
          { key: 'location', label: 'Location' },
          { key: 'message', label: 'Message' },
          { key: 'severity', label: 'Severity', render: (row) => <StatusBadge status={row.severity} /> },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </Stack>
  );
};
