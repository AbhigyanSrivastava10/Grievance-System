import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./components/RoleSelection";
import CitizenLogin from "./components/CitizenLogin";
import CitizenSignUp from "./components/CitizenSignUp";
import EmployeeLogin from "./components/EmployeeLogin";
import CreateGrievance from "./components/CreateGrievance";
import GRODashboard from "./components/ManageGrievances";
import LmeDashboard from "./components/LmeDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/citizen-login" element={<CitizenLogin />} />
        <Route path="/Employee-login" element={<EmployeeLogin />} />
        <Route path="/register" element={<CitizenSignUp />} />
        <Route path="/create-grievance" element={<CreateGrievance />} />
        <Route path="/manage-grievances" element={<GRODashboard />} />
        <Route path="/pending-grievances" element={<LmeDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
