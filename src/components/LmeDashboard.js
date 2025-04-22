import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import "./styles/LmeDashboard.css";

function LmeDashboard() {
  const [grievances, setGrievances] = useState([]);
  const user = auth.currentUser;
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchGrievances = async () => {
      if (!user) return;
      const q = query(
        collection(db, "grievances"),
        where("assignedTo", "==", user.uid),
        where("status", "in", ["Assigned", "In Progress", "Resolved"])
      );
      const snapshot = await getDocs(q);
      setGrievances(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchGrievances();
  }, [user]);

  const handleStatusChange = async (grievanceId, newStatus) => {
    const grievanceRef = doc(db, "grievances", grievanceId);

    const updateData =
      newStatus === "Resolved"
        ? { status: newStatus, resolvedAt: Timestamp.now() }
        : { status: newStatus };

    await updateDoc(grievanceRef, updateData);

    setGrievances((prev) =>
      prev.map((g) =>
        g.id === grievanceId
          ? {
              ...g,
              status: newStatus,
              ...(newStatus === "Resolved" && { resolvedAt: new Date().toISOString() }),
            }
          : g
      )
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } else {
      return new Date(timestamp).toLocaleString();
    }
  };
  const filteredGrievances = selectedStatus
    ? grievances.filter((g) => g.status === selectedStatus)
    : grievances;


    
  return (
    <div className="lme-dashboard-container">
      <h2>Your Assigned Grievances</h2>
      <div className="filter-container">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Issue Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Resolved At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredGrievances.map((grievance) => (
            <tr key={grievance.id}>
              <td>{grievance.issueType}</td>
              <td>{grievance.description}</td>
              <td>{grievance.status}</td>
              <td>{formatDate(grievance.resolvedAt)}</td>
              <td>
                {grievance.status === "Assigned" && (
                  <button onClick={() => handleStatusChange(grievance.id, "In Progress")}>
                    Start Progress
                  </button>
                )}
                {grievance.status === "In Progress" && (
                  <button onClick={() => handleStatusChange(grievance.id, "Resolved")}>
                    Mark Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LmeDashboard;
