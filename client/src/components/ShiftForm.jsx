
import React, { useState } from "react";
import "./ShiftForm.css"; 

const OLCheckInOut = () => {
  const [studentId, setStudentId] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ studentId, shiftType, reason });
    // TODO: Add your form handling logic here
  };

  return (
    <div className="ol-container">
      <header className="ol-header">
        <img src="/ubc-logo.png" alt="UBC Logo" className="ubc-logo" />
        <h1>THE UNIVERSITY OF BRITISH COLUMBIA</h1>
      </header>

      <div className="title-bar">OL SHIFT CHECK IN OUT</div>

      <form className="ol-form" onSubmit={handleSubmit}>
        <label>OL Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <div className="radio-group">
          <label>
            IN
            <input
              type="radio"
              name="shift"
              value="IN"
              onChange={(e) => setShiftType(e.target.value)}
            />
          </label>
          <label>
            OUT
            <input
              type="radio"
              name="shift"
              value="OUT"
              onChange={(e) => setShiftType(e.target.value)}
            />
          </label>
        </div>

        <label>Reason for Shift Deviation (if applicable):</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default OLCheckInOut;
