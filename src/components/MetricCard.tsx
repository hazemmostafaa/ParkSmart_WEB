import { ReactNode } from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';

export const MetricCard = ({
  label,
  value,
  helper,
  icon
}: {
  label: string;
  value: string | number;
  helper?: string;
  icon: ReactNode;
}) => (
  <Card className="metric-card">
    <CardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack spacing={0.35}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4">{value}</Typography>
          {helper ? (
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Stack>
        <span className="metric-icon">{icon}</span>
      </Stack>
    </CardContent>
  </Card>
);
