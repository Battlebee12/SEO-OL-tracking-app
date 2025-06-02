// src/Home.jsx
import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>THE UNIVERSITY OF BRITISH COLUMBIA</h1>
      </nav>
      <div className="button-section">
        <div className="card">
          <h2>OL SHIFT CHECK IN OUT</h2>
          <p>FOR OL'S ONLY</p>
        </div>
        <div className="card">
          <h2>GROUP WALK INS</h2>
          <p>FOR ADDING NEW STUDENTS TO GROUPS</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
