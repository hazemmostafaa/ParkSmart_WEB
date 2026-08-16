import { useMemo, useState } from 'react';
import { Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChartCard, RevenueChart } from '../components/Charts';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { parkingLots, payments, revenueTrend } from '../data/mockData';
import { PaymentStatus } from '../types/models';
import { formatCurrency, formatDateTime } from '../utils/format';

const statuses: Array<'All' | PaymentStatus> = ['All', 'Completed', 'Pending', 'Failed', 'Refunded'];

export const PaymentsPage = () => {
  const [lotId, setLotId] = useState('All');
  const [status, setStatus] = useState<'All' | PaymentStatus>('All');

  const filtered = useMemo(
    () => payments.filter((payment) => (lotId === 'All' || payment.lotId === lotId) && (status === 'All' || payment.status === status)),
    [lotId, status]
  );

  const completed = payments.filter((payment) => payment.status === 'Completed');
  const failed = payments.filter((payment) => payment.status === 'Failed');
  const refunds = payments.filter((payment) => payment.status === 'Refunded');

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Payments</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Today's Revenue" value={formatCurrency(completed.reduce((sum, payment) => sum + payment.amount, 0))} icon="$" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Transactions" value={payments.length} icon="#" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Successful" value={completed.length} icon="✓" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Failed" value={failed.length} icon="!" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard label="Refunds" value={refunds.length} icon="↩" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <ChartCard title="Revenue Chart">
            <RevenueChart data={revenueTrend} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Parking lot" value={lotId} onChange={(event) => setLotId(event.target.value)}>
                    <MenuItem value="All">All lots</MenuItem>
                    {parkingLots.map((lot) => (
                      <MenuItem key={lot.id} value={lot.id}>
                        {lot.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Payment status" value={status} onChange={(event) => setStatus(event.target.value as PaymentStatus | 'All')}>
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
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        getRowKey={(row) => row.transactionId}
        columns={[
          { key: 'transactionId', label: 'Transaction ID' },
          { key: 'lotId', label: 'Parking Lot' },
          { key: 'spaceNumber', label: 'Space' },
          { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
          { key: 'paymentMethod', label: 'Method' },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          { key: 'timestamp', label: 'Timestamp', render: (row) => formatDateTime(row.timestamp) }
        ]}
      />
    </Stack>
  );
};
