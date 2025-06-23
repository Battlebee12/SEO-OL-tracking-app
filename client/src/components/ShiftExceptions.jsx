import React, { useState } from "react";
import axios from "axios";
import "./ShiftExceptions.css"; // Ensure this CSS file exists and styles match the design
import { shiftDays } from "../Constants";

const ShiftExceptionsPage = () => {
  const [filter, setFilter] = useState("incomplete");
  const [selectedDates, setSelectedDates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);



  const toggleDate = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const selectAllDates = () => {
    setSelectedDates(shiftDays);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = {
        filter,
      };
      if (selectedDates.length > 0) {
        params.dates = selectedDates;
      }

      const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/shifts/shift-exceptions`, {
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
            <li><a href="/admin">VIEW OL SHIFT</a></li>
            <li><a href="/admin/total-hours">TOTAL HOURS</a></li>
            <li className="active">SHIFT EXCEPTIONS</li>
            <li><a href = "/admin/update-shift">UPDATE SHIFT</a></li>
            <li>GET EXCEL SHEET</li>
          </ul>
        </aside>

        <main className="admin-main">
          <div className="main-title">SHIFT EXCEPTIONS</div>
          <form className="search-form" onSubmit={handleSearch}>
            <label>
              Exception Type
              <div className="input-with-icon">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="incomplete">Incomplete Shifts</option>
                  <option value="rsd">Shifts with RSD</option>
                </select>
              </div>
            </label>

            <div style={{ textAlign: "center" }}>
              <button className="search-btn" type="button" onClick={selectAllDates}>Select All Dates</button>
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
                      <td>{shift.sign_out_time ? new Date(shift.sign_out_time).toLocaleString() : "—"}</td>
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

export default ShiftExceptionsPage;
