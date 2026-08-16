import { useMemo, useState } from 'react';
import { Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChartCard, SensorHealthChart } from '../components/Charts';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { parkingLots, sensorHealthChart, sensors } from '../data/mockData';
import { SensorState } from '../types/models';
import { formatDateTime } from '../utils/format';

const sensorStatuses: Array<'All' | SensorState> = ['All', 'Online', 'Offline', 'Warning', 'Fault'];

export const SensorsPage = () => {
  const [lotId, setLotId] = useState('All');
  const [status, setStatus] = useState<'All' | SensorState>('All');
  const [battery, setBattery] = useState('All');

  const filtered = useMemo(
    () =>
      sensors.filter(
        (sensor) =>
          (lotId === 'All' || sensor.lotId === lotId) &&
          (status === 'All' || sensor.status === status) &&
          (battery === 'All' || sensor.battery < 20)
      ),
    [lotId, status, battery]
  );

  const offline = sensors.filter((sensor) => sensor.status === 'Offline');
  const lowBattery = sensors.filter((sensor) => sensor.battery > 0 && sensor.battery < 20);
  const faults = sensors.filter((sensor) => sensor.status === 'Fault');

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Sensor Status</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Total Sensors" value={sensors.length} icon="S" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Online" value={sensors.filter((sensor) => sensor.status === 'Online').length} icon="✓" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Offline" value={offline.length} icon="!" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Warning/Fault" value={sensors.filter((sensor) => sensor.status === 'Warning' || sensor.status === 'Fault').length} icon="△" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Low Battery" value={lowBattery.length} icon="%" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <ChartCard title="Sensor Health Chart">
            <SensorHealthChart data={sensorHealthChart} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField select fullWidth label="Parking lot" value={lotId} onChange={(event) => setLotId(event.target.value)}>
                    <MenuItem value="All">All lots</MenuItem>
                    {parkingLots.map((lot) => (
                      <MenuItem key={lot.id} value={lot.id}>
                        {lot.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField select fullWidth label="Status" value={status} onChange={(event) => setStatus(event.target.value as SensorState | 'All')}>
                    {sensorStatuses.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField select fullWidth label="Battery" value={battery} onChange={(event) => setBattery(event.target.value)}>
                    <MenuItem value="All">All battery levels</MenuItem>
                    <MenuItem value="Low">Low battery only</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Offline Sensors
              </Typography>
              <DataTable
                rows={offline.slice(0, 8)}
                getRowKey={(row) => row.sensorId}
                columns={[
                  { key: 'sensorId', label: 'Sensor' },
                  { key: 'spaceNumber', label: 'Space' },
                  { key: 'lastSeen', label: 'Last Seen', render: (row) => formatDateTime(row.lastSeen) }
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Low Battery
              </Typography>
              <DataTable
                rows={lowBattery.slice(0, 8)}
                getRowKey={(row) => row.sensorId}
                columns={[
                  { key: 'sensorId', label: 'Sensor' },
                  { key: 'battery', label: 'Battery', render: (row) => `${row.battery}%` },
                  { key: 'signal', label: 'Signal', render: (row) => `${row.signal}%` }
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Fault List
              </Typography>
              <DataTable
                rows={faults.slice(0, 8)}
                getRowKey={(row) => row.sensorId}
                columns={[
                  { key: 'sensorId', label: 'Sensor' },
                  { key: 'spaceNumber', label: 'Space' },
                  { key: 'alert', label: 'Alert' }
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DataTable
        rows={filtered.slice(0, 220)}
        getRowKey={(row) => row.sensorId}
        columns={[
          { key: 'sensorId', label: 'Sensor ID' },
          { key: 'lotId', label: 'Parking Lot' },
          { key: 'spaceNumber', label: 'Space' },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          { key: 'battery', label: 'Battery', render: (row) => `${row.battery}%` },
          { key: 'lastSeen', label: 'Last Seen', render: (row) => formatDateTime(row.lastSeen) },
          { key: 'signal', label: 'Signal', render: (row) => `${row.signal}%` },
          { key: 'firmware', label: 'Firmware' },
          { key: 'alert', label: 'Alert' }
        ]}
      />
    </Stack>
  );
};
