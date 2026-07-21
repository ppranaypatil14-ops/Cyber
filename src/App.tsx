import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import HomePage from "./pages/Home";
import OverviewDashboard from "./pages/Overview";
import LiveAlerts from "./pages/Alerts";
import SecurityTestingLab from "./pages/TestingLab";
import AttackInvestigation from "./pages/Investigation";
import MitreAttack from "./pages/MitreAttack";
import Copilot from "./pages/Copilot";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AttackDashboard } from "./pages/AttackDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Homepage — no sidebar/topnav */}
        <Route path="/" element={<HomePage />} />
        
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard — wrapped with sidebar + topnav layout */}
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<OverviewDashboard />} />
          <Route path="attack-correlation" element={<AttackDashboard />} />
          <Route path="alerts" element={<LiveAlerts />} />
          <Route path="lab" element={<SecurityTestingLab />} />
          <Route path="investigation" element={<AttackInvestigation />} />
          <Route path="profile" element={<Profile />} />
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
