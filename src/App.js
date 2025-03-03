import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { FaGoogle, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import Talent from './components/Talent';
import TalentScout from './components/TalentScout';

function AuthPage() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (role === "scout") {
      navigate("/talent-scout");
    } else if (role === "talent") {
      navigate("/talent");
    }
  };

  return (
    <section className="auth-section">
      <h2>Sign in to ScoutJar</h2>
      <p>Select your role:</p>
      <div className="role-selection">
        <button onClick={() => setRole("scout")} className={role === "scout" ? "selected" : ""}>Talent Scout</button>
        <button onClick={() => setRole("talent")} className={role === "talent" ? "selected" : ""}>Talent</button>
      </div>
      <div className="social-login-buttons">
        <button className="social-login google" onClick={handleSignIn}><FaGoogle /> Sign in with Google</button>
        <button className="social-login linkedin" onClick={handleSignIn}><FaLinkedin /> Sign in with LinkedIn</button>
        <button className="social-login twitter" onClick={handleSignIn}><FaTwitter /> Sign in with X</button>
        <button className="social-login instagram" onClick={handleSignIn}><FaInstagram /> Sign in with Instagram</button>
      </div>
    </section>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="logo">ScoutJar</div>
          <ul className="nav-links">
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Jobs</a></li>
            <li><a href="#">Messages</a></li>
            <li><a href="#">Profile</a></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/talent-scout" element={<TalentScout />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
