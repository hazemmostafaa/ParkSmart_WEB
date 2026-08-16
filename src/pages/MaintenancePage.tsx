import { useMemo, useState } from 'react';
import { Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { maintenanceIssues, parkingLots } from '../data/mockData';
import { MaintenanceStatus, Priority } from '../types/models';
import { formatDateTime } from '../utils/format';

const priorities: Array<'All' | Priority> = ['All', 'Critical', 'High', 'Medium', 'Low'];
const statuses: Array<'All' | MaintenanceStatus> = ['All', 'Open', 'In Progress', 'Completed'];

export const MaintenancePage = () => {
  const [priority, setPriority] = useState<'All' | Priority>('All');
  const [status, setStatus] = useState<'All' | MaintenanceStatus>('All');
  const [lotId, setLotId] = useState('All');

  const filtered = useMemo(
    () =>
      maintenanceIssues.filter(
        (issue) =>
          (priority === 'All' || issue.priority === priority) &&
          (status === 'All' || issue.status === status) &&
          (lotId === 'All' || issue.lotId === lotId)
      ),
    [priority, status, lotId]
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Maintenance</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Open Issues" value={maintenanceIssues.filter((issue) => issue.status === 'Open').length} icon="O" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Critical" value={maintenanceIssues.filter((issue) => issue.priority === 'Critical').length} icon="!" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="In Progress" value={maintenanceIssues.filter((issue) => issue.status === 'In Progress').length} icon="…" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard label="Completed" value={maintenanceIssues.filter((issue) => issue.status === 'Completed').length} icon="✓" />
        </Grid>
      </Grid>

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
              <TextField select fullWidth label="Priority" value={priority} onChange={(event) => setPriority(event.target.value as Priority | 'All')}>
                {priorities.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Status" value={status} onChange={(event) => setStatus(event.target.value as MaintenanceStatus | 'All')}>
                {statuses.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <DataTable
        rows={filtered}
        getRowKey={(row) => row.issueId}
        columns={[
          { key: 'issueId', label: 'Issue ID' },
          { key: 'lotId', label: 'Parking Lot' },
          { key: 'spaceNumber', label: 'Space' },
          { key: 'issueType', label: 'Issue Type' },
          { key: 'priority', label: 'Priority', render: (row) => <StatusBadge status={row.priority} /> },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          { key: 'created', label: 'Created', render: (row) => formatDateTime(row.created) },
          { key: 'assignedTo', label: 'Assigned To' },
          { key: 'lastUpdated', label: 'Last Updated', render: (row) => formatDateTime(row.lastUpdated) }
        ]}
      />
    </Stack>
  );
};
