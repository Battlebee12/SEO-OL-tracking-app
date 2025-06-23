import React, { useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Reuse existing CSS for perfect match
import { shiftDays } from "../Constants";



const TotalHoursPage = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchID, setSearchID] = useState("");
  const [totals, setTotals] = useState([]);

  const toggleDate = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const selectAllDates = () => {
    setSelectedDates(shiftDays);
  };

  const calculateTotalHours = async () => {
    try {
      const params = {};

      if (searchName) params.name = searchName;
      if (searchID) params.student_id = searchID;
      if (selectedDates.length > 0) params.dates = selectedDates;

      const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/shifts/total-hours`, {
        params,
      });

      // Format response (convert total_minutes to hours)
      const formatted = res.data.map(entry => ({
        name: entry.ol_name,
        id: entry.ol_student_id,
        duration: entry.total_minutes / 60, // convert minutes to hours
      }));

      setTotals(formatted);
    } catch (err) {
      console.error("Error fetching total hours:", err);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <img src="/ubc-logo.png" alt="UBC Logo" className="ubc-logo" />
        <h1>UBC OKANAGAN - TOTAL HOURS</h1>
      </div>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <h2>ADMIN DASHBOARD</h2>
          <ul>
            <li><a href="/admin">VIEW OL SHIFT</a></li>
            <li className="active">TOTAL HOURS</li>
            <li><a href = "/admin/shift-exceptions">SHIFT EXCEPTIONS</a></li>
            <li><a href = "/admin/update-shift">UPDATE SHIFT</a></li>
            <li>GET EXCEL SHEET</li>
          </ul>
        </aside>
       

        <main className="admin-main">
          <div className="main-title">Total Hours Worked</div>

          <div className="search-form">
            <div className="input-row">
              <div>
                <label>Name</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
              </div>
              <div>
                <label>Student ID</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                    placeholder="Enter student ID"
                  />
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "1em" }}>
              <button className="search-btn" onClick={selectAllDates}>Select All Dates</button>
              {shiftDays.map((date) => (
                <label key={date} style={{ marginLeft: "15px" }}>
                  <input
                    type="checkbox"
                    checked={selectedDates.includes(date)}
                    onChange={() => toggleDate(date)}
                  /> {date}
                </label>
              ))}
            </div>

            <button className="search-btn" onClick={calculateTotalHours}>Search</button>
          </div>

          <div className="results">
            <h3>Results</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Total Duration (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {totals.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{entry.name}</td>
                    <td>{entry.id}</td>
                    <td>{entry.duration.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TotalHoursPage;
