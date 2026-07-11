import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import OverviewDashboard from "./pages/Overview";
import LiveAlerts from "./pages/Alerts";
import SecurityTestingLab from "./pages/TestingLab";
import AttackInvestigation from "./pages/Investigation";
import MitreAttack from "./pages/MitreAttack";
import Copilot from "./pages/Copilot";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<OverviewDashboard />} />
          <Route path="alerts" element={<LiveAlerts />} />
          <Route path="lab" element={<SecurityTestingLab />} />
          <Route path="investigation" element={<AttackInvestigation />} />
          <Route path="mitre" element={<MitreAttack />} />
          <Route path="copilot" element={<Copilot />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
