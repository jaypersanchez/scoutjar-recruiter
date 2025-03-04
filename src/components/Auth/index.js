import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import scoutjarLogo from '../../assets/images/scoutjar_logo_transparent.png'; // Import the logo
import '../../App.css'; // Ensure App.css is applied

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
    <div className="auth-container">
      <div className="auth-content">
        {/* Logo beside the title */}
        <div className="auth-header">
          <img src={scoutjarLogo} alt="ScoutJar Logo" className="auth-logo" />
          <h1>Sign in to ScoutJar</h1>
        </div>

        <p>Select your role:</p>

        <div className="role-selection">
          <button 
            onClick={() => setRole("scout")} 
            className={`role-button ${role === "scout" ? "selected" : ""}`}
          >
            Talent Scout
          </button>
          <button 
            onClick={() => setRole("talent")} 
            className={`role-button ${role === "talent" ? "selected" : ""}`}
          >
            Talent
          </button>
        </div>

        <div className="auth-buttons">
          <button className="social-login google" onClick={handleSignIn}>
            <FaGoogle /> Sign in with Google
          </button>
          <button className="social-login linkedin" onClick={handleSignIn}>
            <FaLinkedin /> Sign in with LinkedIn
          </button>
          <button className="social-login twitter" onClick={handleSignIn}>
            <FaTwitter /> Sign in with X
          </button>
          <button className="social-login instagram" onClick={handleSignIn}>
            <FaInstagram /> Sign in with Instagram
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
