import { useNavigate } from "react-router-dom";
import "./styles/RoleSelection.css";

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <div className="role-card">
        <h2 className="role-title">Select Your Role</h2>
        <button onClick={() => navigate("/citizen-login")} className="role-button citizen">
          Citizen
        </button>
        <button onClick={() => navigate("/employee-login")} className="role-button employee">
          Employee (GRO / LME)
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;
