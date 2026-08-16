import { NavLink, Outlet } from 'react-router-dom';
import { AppBar, Box, Chip, Stack, Toolbar, Typography } from '@mui/material';
import {
  MdDashboard,
  MdEvent,
  MdHealthAndSafety,
  MdLocalParking,
  MdPayments,
  MdSensors,
  MdSettingsInputComponent
} from 'react-icons/md';
import { FaWrench } from 'react-icons/fa6';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <MdDashboard /> },
  { to: '/parking-lots', label: 'Parking Lots', icon: <MdLocalParking /> },
  { to: '/parking-spaces', label: 'Parking Spaces', icon: <MdSettingsInputComponent /> },
  { to: '/sensors', label: 'Sensor Status', icon: <MdSensors /> },
  { to: '/payments', label: 'Payments', icon: <MdPayments /> },
  { to: '/maintenance', label: 'Maintenance', icon: <FaWrench /> },
  { to: '/alerts', label: 'Alerts & Events', icon: <MdEvent /> },
  { to: '/system-health', label: 'System Health', icon: <MdHealthAndSafety /> }
];

export const Layout = () => (
  <Box className="app-layout">
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/parksmart-logo.svg" alt="ParkSmart" />
      </div>
      <div className="demo-pill">SMART PARKING IoT - DEMO</div>
      <Typography variant="caption" className="demo-note">
        Data shown is simulated for demonstration purposes.
      </Typography>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
    <Box className="workspace">
      <AppBar position="sticky" className="topbar" elevation={0}>
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
            <img src="/parksmart-mark.svg" alt="" className="topbar-mark" />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                Parking Operations - Healthy
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                Last updated: Just now
              </Typography>
            </Box>
          </Stack>
          <Chip label="Prototype - Simulated IoT Data" color="secondary" />
        </Toolbar>
      </AppBar>
      <main className="page-content">
        <Outlet />
      </main>
    </Box>
  </Box>
);
