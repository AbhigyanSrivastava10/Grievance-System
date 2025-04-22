import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import "./styles/ManageGrievances.css";

function GRODashboard() {
  const [unassigned, setUnassigned] = useState([]);
  const [allGrievances, setAllGrievances] = useState([]);
  const [analytics, setAnalytics] = useState({
    issueTypeCount: {},
    avgResolutionTime: 0,
    totalResolved: 0
  });
  const [activeTab, setActiveTab] = useState("unassigned");

  useEffect(() => {
    const fetchData = async () => {
      const qUnassigned = query(
        collection(db, "grievances"),
        where("status", "==", "Unassigned")
      );
      const unassignedSnap = await getDocs(qUnassigned);
      const unassignedData = unassignedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUnassigned(unassignedData);

      const allSnap = await getDocs(collection(db, "grievances"));
      const allData = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllGrievances(allData);

      const resolvedGrievances = allData.filter(g => g.status === "resolved");
      const totalResolved = resolvedGrievances.length;

      const totalDays = resolvedGrievances.reduce((sum, g) => {
        const created = g.createdAt?.toDate?.() || new Date(g.createdAt);
        const resolved = g.resolvedAt?.toDate?.() || new Date(g.resolvedAt);
        const diff = (resolved - created) / (1000 * 3600 * 24);
        return sum + diff;
      }, 0);
      const avgResolutionTime = totalResolved > 0 ? (totalDays / totalResolved).toFixed(1) : 0;

      const issueTypeCount = {};
      allData.forEach(g => {
        const type = g.issueType || "Other";
        issueTypeCount[type] = (issueTypeCount[type] || 0) + 1;
      });

      setAnalytics({ issueTypeCount, avgResolutionTime, totalResolved });
    };

    fetchData();
  }, []);

  const handleAssign = async (grievanceId, lmeUID) => {
    const grievanceRef = doc(db, "grievances", grievanceId);
    await updateDoc(grievanceRef, {
      assignedTo: lmeUID,
      status: "Assigned"
    });
   

    setUnassigned(prev => prev.filter(g => g.id !== grievanceId));
  };

  return (
    <div className="gro-dashboard-container">
      <h2>GRO Dashboard</h2>

      {/* Tab Navigation */}
      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "unassigned" ? "active" : ""}`}
          onClick={() => setActiveTab("unassigned")}
        >
          Unassigned Grievances
        </button>
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Grievances
        </button>
      </div>

      {/* Unassigned Grievances Section*/}
      {activeTab === "unassigned" && (
        <section>
          <h3>Unassigned Grievances</h3>
          <table>
            <thead>
              <tr>
                <th>Issue Type</th>
                <th>Description</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {unassigned.map(grievance => (
                <tr key={grievance.id}>
                  <td>{grievance.issueType}</td>
                  <td>{grievance.description}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleAssign(grievance.id, prompt("Enter LME UID to assign"))
                      }
                    >
                      Assign to LME
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* All Grievances Section */}
      {activeTab === "all" && (
        <section>
          <h3>All Grievances</h3>
          <table>
            <thead>
              <tr>
                <th>Issue</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Resolved</th>
              </tr>
            </thead>
            <tbody>
              {allGrievances.map(grievance => (
                <tr key={grievance.id}>
                  <td>{grievance.issueType}</td>
                  <td>{grievance.status}</td>
                  <td>{grievance.assignedTo || "None"}</td>
                  <td>{grievance.createdAt?.toDate?.().toLocaleDateString?.() || "-"}</td>
                  <td>{grievance.resolvedAt?.toDate?.().toLocaleDateString?.() || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Analytics Section */}
      <section className="analytics">
        <h3>Analytics</h3>
        <p><strong>Total Resolved:</strong> {analytics.totalResolved}</p>
        <p><strong>Average Resolution Time:</strong> {analytics.avgResolutionTime} days</p>
        <h4>Issue Type Breakdown</h4>
        <ul>
          {Object.entries(analytics.issueTypeCount).map(([type, count]) => (
            <li key={type}>
              {type}: {count}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default GRODashboard;
