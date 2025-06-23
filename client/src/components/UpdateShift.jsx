// src/AdminDashboard.jsx
import React, { useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
// Convert ISO string to datetime-local format (local time, no Z)
function formatForDatetimeLocal(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

const AdminDashboard = () => {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [gid, setGid] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editShift, setEditShift] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const params = {};
      if (studentId) params.student_id = studentId;
      if (date) params.date = date;
      if (name) params.name = name;
      if (gid) params.gid = gid;

      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/shifts/admin`,
        {
          params,
        }
      );

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
            <li>
              <a href="/admin/total-hours">TOTAL HOURS</a>
            </li>
            <li>
              <a href="/admin/shift-exceptions">SHIFT EXCEPTIONS</a>
            </li>
            <li className="active"><a href = "/admin/update-shift">UPDATE SHIFT</a></li>
            <li>GET EXCEL SHEET</li>
          </ul>
        </aside>

        <main className="admin-main">
          <div className="main-title">OL SHIFT DATA</div>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-row">
              <label>
                OL Student ID
                <div className="input-with-icon">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>
              </label>

              <label>
                OL Name
                <div className="input-with-icon">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </label>
              <label>
                OL Group No.
                <div className="input-with-icon">
                  <input
                    type="text"
                    value={gid}
                    onChange={(e) => setGid(e.target.value)}
                  />
                </div>
              </label>
            </div>

            <label>
              Date
              <div className="input-with-icon">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
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
                    <th>Duration</th>
                    <th>Group No.</th>
                    <th>Edit</th>
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
                      <td>
                        {shift.duration_minutes !== null
                          ? `${shift.duration_minutes} min`
                          : "—"}
                      </td>
                      <td>{shift.group_no}</td>
                      <td>
                        <button onClick={() => setEditShift(shift)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {editShift && (
            <div className="edit-form">
              <h3>Edit Shift</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await axios.put(
                      `${process.env.REACT_APP_API_BASE}/api/shifts/${editShift.id}`,
                      editShift
                    );
                    alert("Shift updated successfully!");
                    setEditShift(null);
                    handleSearch(); // refresh results
                  } catch (err) {
                    console.error("Update failed:", err);
                    alert("Failed to update shift.");
                  }
                }}
              >
                <label>
                  OL Name:
                  <input
                    type="text"
                    value={editShift.ol_name}
                    onChange={(e) =>
                      setEditShift({ ...editShift, ol_name: e.target.value })
                    }
                  />
                </label>

                <label>
                  Student ID:
                  <input
                    type="number"
                    value={editShift.ol_student_id}
                    onChange={(e) =>
                      setEditShift({
                        ...editShift,
                        ol_student_id: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Sign In:
                  <input
                    type="datetime-local"
                    value={formatForDatetimeLocal(editShift.sign_in_time)}
                    onChange={(e) =>
                      setEditShift({
                        ...editShift,
                        sign_in_time: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </label>

                <label>
                  Sign Out:
                  <input
                    type="datetime-local"
                    value={formatForDatetimeLocal(editShift.sign_out_time)}
                    onChange={(e) =>
                      setEditShift({
                        ...editShift,
                        sign_out_time: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      })
                    }
                  />
                </label>

                <label>
                  RSD:
                  <input
                    type="text"
                    value={editShift.rsd || ""}
                    onChange={(e) =>
                      setEditShift({
                        ...editShift,
                        rsd: e.target.value || null,
                      })
                    }
                  />
                </label>

                <label>
                  Group No:
                  <input
                    type="number"
                    value={editShift.group_no || ""}
                    onChange={(e) =>
                      setEditShift({ ...editShift, group_no: e.target.value })
                    }
                  />
                </label>

                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditShift(null)}>
                  Cancel
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
