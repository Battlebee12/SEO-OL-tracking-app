// src/Home.jsx
import React from "react";
import { Link } from "react-router-dom"; 
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>THE UNIVERSITY OF BRITISH COLUMBIA</h1>
      </nav>
      <div className="button-section">

        {/* Link wrapper for shift tracker */}
        <Link to="/shift" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card">
            <h2>OL SHIFT CHECK IN OUT</h2>
            <p>FOR OL'S ONLY</p>
          </div>
        </Link>

        {/* Link wrapper for admin dashboard */}
        <Link to="/pshifts" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card">
            <h2>VIEW PAST SHIFTS</h2>
            <p>View Past Shifts</p>
          </div>
        </Link>
        
      </div>
    </div>
  );
};


export default Home;
