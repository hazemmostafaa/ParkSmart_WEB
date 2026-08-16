import { Card, CardContent, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { NamedValue, TimeSeriesPoint } from '../types/models';

const sensorColors = ['#0FB9AF', '#EF4444', '#F59E0B', '#7C3AED'];

export const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <div className="chart-box">{children}</div>
    </CardContent>
  </Card>
);

export const OccupancyChart = ({ data }: { data: TimeSeriesPoint[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#D9E3EF" />
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="occupied" stackId="1" stroke="#071F3D" fill="#071F3D" fillOpacity={0.9} />
      <Area type="monotone" dataKey="available" stackId="1" stroke="#0FB9AF" fill="#0FB9AF" fillOpacity={0.8} />
    </AreaChart>
  </ResponsiveContainer>
);

export const SensorHealthChart = ({ data }: { data: NamedValue[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
        {data.map((entry, index) => (
          <Cell key={entry.name} fill={sensorColors[index % sensorColors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export const RevenueChart = ({ data }: { data: NamedValue[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#D9E3EF" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#0FB9AF" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
