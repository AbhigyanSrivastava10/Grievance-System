import { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import { collection, addDoc, query, where, getDocs, } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";

function CreateGrievance() {
  const [activeTab, setActiveTab] = useState("create");
  const [issueType, setIssueType] = useState("");
  const [issueSubType, setIssueSubType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [files, setFiles] = useState([]);
  const [confirmation, setConfirmation] = useState("");
  const [previousGrievances, setPreviousGrievances] = useState([]);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    

    const fetchPreviousGrievances = async () => {
      const q = query(collection(db, "grievances"), where("userId", "==", user.uid));
      console.log(user.uid);
      console.log(user.displayName);
      const querySnapshot = await getDocs(q);
      setPreviousGrievances(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchPreviousGrievances();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedFileUrls = [];

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const fileRef = ref(storage, `grievances/${user.uid}/${Date.now()}-${files[i].name}`);
        await uploadBytes(fileRef, files[i]);
        const url = await getDownloadURL(fileRef);
        uploadedFileUrls.push(url);
      }
    }

    const grievanceData = {
      userId: user.uid,
      issueType,
      issueSubType,
      description,
      location,
      address,
      documents: uploadedFileUrls,
      status: "Unassigned",
      createdAt: new Date(),
    };

    await addDoc(collection(db, "grievances"), grievanceData);

    setConfirmation("Grievance submitted successfully!");
    setIssueType("");
    setIssueSubType("");
    setDescription("");
    setLocation("");
    setAddress("");
    setFiles([]);
  };
  

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to sign out?");
    if (!confirmLogout) return;
    try {
      await signOut(auth);
      navigate("/citizen-login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="create-grievance-container">
      <h1>Citizen Dashboard</h1>
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-button">
          Sign Out
        </button>
      </div>
      <div className="tab-buttons">
        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          Create Grievance
        </button>
        <button
          className={activeTab === "previous" ? "active" : ""}
          onClick={() => setActiveTab("previous")}
        >
          Previous Grievances
        </button>
      </div>

      {activeTab === "create" && (
        <>
          <h2>Create Grievance</h2>
          {confirmation && <p className="confirmation">{confirmation}</p>}
          <form onSubmit={handleSubmit} className="grievance-form">
            <label>Issue Type:</label>
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
              <option value="">Select Type</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Water Issue">Water Issue</option>
              <option value="Electricity">Electricity</option>
            </select>

            <label>Issue Sub Type:</label>
            <input type="text" value={issueSubType} onChange={(e) => setIssueSubType(e.target.value)} required />

            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label>Upload Documents/Images:</label>
            <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />

            <label>Location:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            

            <label>Address:</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </>
      )}

      {activeTab === "previous" && (
        <>
          <h2>Your Previous Grievances</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {previousGrievances.map(grievance => (
                <tr key={grievance.id}>
                  <td>{grievance.issueType}</td>
                  <td>{grievance.description}</td>
                  <td>{grievance.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default CreateGrievance;
