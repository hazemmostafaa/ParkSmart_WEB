import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AlertsPage } from './pages/AlertsPage';
import { DashboardPage } from './pages/DashboardPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ParkingLotDetailPage } from './pages/ParkingLotDetailPage';
import { ParkingLotsPage } from './pages/ParkingLotsPage';
import { ParkingSpacesPage } from './pages/ParkingSpacesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { SensorsPage } from './pages/SensorsPage';
import { SystemHealthPage } from './pages/SystemHealthPage';

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<DashboardPage />} />
      <Route path="/parking-lots" element={<ParkingLotsPage />} />
      <Route path="/parking-lots/:id" element={<ParkingLotDetailPage />} />
      <Route path="/parking-spaces" element={<ParkingSpacesPage />} />
      <Route path="/sensors" element={<SensorsPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/system-health" element={<SystemHealthPage />} />
      <Route path="*" element={<DashboardPage />} />
    </Route>
  </Routes>
);

export default App;
