// src/AdminDashboard.jsx
import React, { useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = {};
      if (studentId) params.student_id = studentId;
      if (date) params.date = date;
      if (name) params.name = name;

      const res = await axios.get("http://localhost:5005/api/shifts/admin", {
        params,
      });

      setResults(res.data);
    } catch (err) {
      console.error("Error fetching shifts:", err);
      alert("Failed to fetch shift data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <img src="/ubc-logo.png" alt="UBC Logo" className="ubc-logo" />
        <h1>THE UNIVERSITY OF BRITISH COLUMBIA</h1>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <h2>ADMIN DASHBOARD</h2>
          <ul>
            <li className="active">VIEW OL SHIFT</li>
            <li>FIND STUDENT</li>
            <li>EDIT STUDENT</li>
            <li>GET EXCEL SHEET</li>
          </ul>
        </aside>

        <main className="admin-main">
          <div className="main-title">OL SHIFT DATA</div>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-row">
              <label>
                OL Student ID
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </label>
              <label>
                OL Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {results.length > 0 && (
            <div className="results">
              <h3>Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Sign In</th>
                    <th>Sign Out</th>
                    <th>RSD</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((shift) => (
                    <tr key={shift.id}>
                      <td>{shift.ol_name}</td>
                      <td>{shift.ol_student_id}</td>
                      <td>{new Date(shift.sign_in_time).toLocaleString()}</td>
                      <td>
                        {shift.sign_out_time
                          ? new Date(shift.sign_out_time).toLocaleString()
                          : "—"}
                      </td>
                      <td>{shift.rsd || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
