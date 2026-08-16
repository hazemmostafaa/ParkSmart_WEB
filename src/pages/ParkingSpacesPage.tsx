import { useMemo, useState } from 'react';
import { Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DataTable } from '../components/DataTable';
import { ParkingSpaceTile } from '../components/ParkingSpaceTile';
import { StatusBadge } from '../components/StatusBadge';
import { parkingLots, parkingSpaces, sensors } from '../data/mockData';
import { ParkingSpace, SpaceStatus, SpaceType } from '../types/models';
import { formatDateTime } from '../utils/format';

const statuses: Array<'All' | SpaceStatus> = ['All', 'Available', 'Occupied', 'Reserved', 'Out of Service', 'Sensor Fault'];
const types: Array<'All' | SpaceType> = ['All', 'Regular', 'VIP', 'Accessible', 'Electric Vehicle Charging', 'Motorcycle', 'Family Parking'];

export const ParkingSpacesPage = () => {
  const [lotId, setLotId] = useState('All');
  const [zone, setZone] = useState('All');
  const [status, setStatus] = useState<'All' | SpaceStatus>('All');
  const [type, setType] = useState<'All' | SpaceType>('All');
  const [selected, setSelected] = useState<ParkingSpace | null>(null);

  const filtered = useMemo(
    () =>
      parkingSpaces.filter(
        (space) =>
          (lotId === 'All' || space.lotId === lotId) &&
          (zone === 'All' || space.zoneName === zone) &&
          (status === 'All' || space.currentStatus === status) &&
          (type === 'All' || space.spaceType === type)
      ),
    [lotId, zone, status, type]
  );

  const zones = Array.from(new Set(parkingSpaces.filter((space) => lotId === 'All' || space.lotId === lotId).map((space) => space.zoneName)));
  const selectedSensor = selected ? sensors.find((sensor) => sensor.sensorId === selected.sensorId) : undefined;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Parking Spaces</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Parking lot" value={lotId} onChange={(event) => setLotId(event.target.value)}>
                <MenuItem value="All">All lots</MenuItem>
                {parkingLots.map((lot) => (
                  <MenuItem key={lot.id} value={lot.id}>
                    {lot.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Zone" value={zone} onChange={(event) => setZone(event.target.value)}>
                <MenuItem value="All">All zones</MenuItem>
                {zones.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Status" value={status} onChange={(event) => setStatus(event.target.value as SpaceStatus | 'All')}>
                {statuses.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Space type" value={type} onChange={(event) => setType(event.target.value as SpaceType | 'All')}>
                {types.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} xl={8}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Visual Space Grid</Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing {Math.min(filtered.length, 320)} of {filtered.length} spaces
                </Typography>
              </Stack>
              <div className="space-grid large">
                {filtered.slice(0, 320).map((space) => (
                  <ParkingSpaceTile
                    key={space.spaceId}
                    space={space}
                    selected={selected?.spaceId === space.spaceId}
                    onClick={setSelected}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} xl={4}>
          <Card className="detail-card">
            <CardContent>
              <Typography variant="h6">Space Detail</Typography>
              {selected ? (
                <Stack spacing={1.2} sx={{ mt: 2 }}>
                  <Typography variant="h3">{selected.spaceNumber}</Typography>
                  <Typography color="text.secondary">
                    {selected.zoneName} / Floor {selected.floor} / {selected.lotId}
                  </Typography>
                  <StatusBadge status={selected.currentStatus} />
                  <Typography>Space ID: {selected.spaceId}</Typography>
                  <Typography>Space Type: {selected.spaceType}</Typography>
                  <Typography>Session Status: {selected.sessionStatus}</Typography>
                  <Typography>Sensor Status: {selectedSensor?.status}</Typography>
                  <Typography>Last Update: {selectedSensor ? formatDateTime(selectedSensor.lastSeen) : '-'}</Typography>
                  <Typography>Current Parking Session: {selected.sessionStatus === 'Active' ? 'Active vehicle session' : 'No active session'}</Typography>
                  <Typography>Maintenance Status: {selected.currentStatus === 'Out of Service' ? 'Maintenance required' : 'No open maintenance flag'}</Typography>
                </Stack>
              ) : (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  Select a space tile to inspect status, sensor health, session state, and maintenance context.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DataTable
        rows={filtered.slice(0, 120)}
        getRowKey={(row) => row.spaceId}
        onRowClick={setSelected}
        columns={[
          { key: 'spaceId', label: 'SpaceID' },
          { key: 'zoneId', label: 'ZoneID' },
          { key: 'spaceNumber', label: 'Space Number' },
          { key: 'spaceType', label: 'Type' },
          { key: 'currentStatus', label: 'Current Status', render: (row) => <StatusBadge status={row.currentStatus} /> },
          { key: 'sessionStatus', label: 'Session Status' }
        ]}
      />
    </Stack>
  );
};
