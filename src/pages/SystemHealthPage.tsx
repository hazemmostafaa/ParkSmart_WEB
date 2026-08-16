import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { MdArrowDownward, MdCheckCircle } from 'react-icons/md';
import { StatusBadge } from '../components/StatusBadge';
import { systemHealth } from '../data/mockData';
import { formatDateTime } from '../utils/format';

export const SystemHealthPage = () => (
  <Stack spacing={3}>
    <Typography variant="h4">System Health</Typography>
    <Card>
      <CardContent>
        <Typography variant="h6">Business Data Flow</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
          A supervisor-friendly view of data readiness from source loading through IoT parking operations.
        </Typography>
        <div className="pipeline">
          {systemHealth.map((stage, index) => (
            <div className="pipeline-stage-wrap" key={stage.stage}>
              <Card className="pipeline-stage">
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{stage.stage}</Typography>
                      <MdCheckCircle className="pipeline-check" />
                    </Stack>
                    <Typography color="text.secondary">{stage.description}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <StatusBadge status={stage.status} />
                      <Typography variant="caption" color="text.secondary">
                        Last synchronization: {formatDateTime(stage.lastSync)}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              {index < systemHealth.length - 1 ? <MdArrowDownward className="pipeline-arrow" /> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Grid container spacing={2}>
      {systemHealth.map((stage) => (
        <Grid item xs={12} md={6} xl={3} key={stage.stage}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">{stage.stage}</Typography>
                <StatusBadge status={stage.status} />
                <Typography variant="body2" color="text.secondary">
                  {stage.description}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Stack>
);
