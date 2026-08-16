import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { parkingLots } from '../data/mockData';
import { percent } from '../utils/format';

export const ParkingLotsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('occupancy');
  const navigate = useNavigate();

  const lots = useMemo(() => {
    const normalized = search.toLowerCase();
    return parkingLots
      .filter((lot) => status === 'All' || lot.status === status)
      .filter((lot) => `${lot.name} ${lot.address} ${lot.city}`.toLowerCase().includes(normalized))
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'available') return b.available - a.available;
        return percent(b.occupied, b.totalSpaces) - percent(a.occupied, a.totalSpaces);
      });
  }, [search, status, sort]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Parking Lots</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Search lots" value={search} onChange={(event) => setSearch(event.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
                  {['All', 'Healthy', 'Busy', 'Congested', 'Service Required'].map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort</InputLabel>
                <Select label="Sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                  <MenuItem value="occupancy">Highest occupancy</MenuItem>
                  <MenuItem value="available">Most available</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <DataTable
        rows={lots}
        getRowKey={(row) => row.id}
        onRowClick={(row) => navigate(`/parking-lots/${row.id}`)}
        columns={[
          { key: 'id', label: 'Lot ID' },
          { key: 'name', label: 'Lot Name' },
          { key: 'address', label: 'Address' },
          { key: 'city', label: 'City' },
          { key: 'totalSpaces', label: 'Total' },
          { key: 'occupied', label: 'Occupied' },
          { key: 'available', label: 'Available' },
          { key: 'occupancy', label: 'Occupancy', render: (row) => `${percent(row.occupied, row.totalSpaces)}%` },
          { key: 'openingTime', label: 'Opening' },
          { key: 'closingTime', label: 'Closing' },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </Stack>
  );
};
