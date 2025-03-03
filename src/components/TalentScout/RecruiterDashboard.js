import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import scoutjarLogo from '../../assets/images/scoutjar_logo_header_bg.png';
import RecruiterSidebar from './RecruiterSidebar';

function RecruiterDashboard({ user }) {
  return (
    <div className="recruiter-dashboard">
      {/* Recruiter-Specific Header (Full Width at the Top) */}
      <nav className="navbar">
        <div className="logo">
          <img src={scoutjarLogo} alt="ScoutJar Logo" className="scoutjar-logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="#">Messages</Link></li>
          <li><Link to="#">Profile</Link></li>
          <li><Link to="/">Sign Out</Link></li>
        </ul>
      </nav>

      {/* Main Content Wrapper: Sidebar + Recruiter Content */}
      <div className="dashboard-wrapper">
        <RecruiterSidebar />

        {/* Main Recruiter Content */}
        <div className="recruiter-content">
          <h1>Welcome, Recruiter!</h1>
          <p>{user ? `Hello, ${user.displayName}` : "Loading..."}</p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
