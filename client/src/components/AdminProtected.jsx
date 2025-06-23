import React, { useState, useEffect } from "react";
import "./AdminDashboard.css"; // Ensure this CSS file exists and styles match the design

const AdminProtected = ({ children }) => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const correctPassword = "ubcadmin2025"; 

  useEffect(() => {
    const isAllowed = localStorage.getItem("adminAccess") === "true";
    if (isAllowed) {
      setAccessGranted(true);
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (passwordInput === correctPassword) {
      localStorage.setItem("adminAccess", "true");
      setAccessGranted(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!accessGranted) {
    return (
      <div className="admin-login">
        <h2>Admin Access Only</h2>
        <input
          type="password"
          placeholder="Enter Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handlePasswordSubmit}>Enter</button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtected;
