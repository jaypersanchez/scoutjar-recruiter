import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import scoutjarLogo from "../../assets/images/scoutjar_logo_header_bg.png";

function Header() {
  const location = useLocation();
  const navigate = useNavigate(); // For redirection

  // Handle Sign Out
  const handleSignOut = () => {
    // Clear session data
    localStorage.removeItem("user"); // If using local storage
    sessionStorage.clear(); // If using session storage

    // Redirect to AuthPage (Main Sign-in Screen)
    navigate("/auth", { replace: true });

    // Force a full reload to clear state and display AuthPage
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src={scoutjarLogo}
          alt="ScoutJar Logo"
          className="scoutjar-logo"
          onClick={() => navigate("/")}
        />
      </div>
      <ul className="nav-links">
        {location.pathname === "/talent-scout" ? (
          // Recruiter Page: Show only Profile and Sign Out
          <>
            <li>
              <span>Messages</span>
            </li>
            <li>
              <span>Profile</span>
            </li>
            <li>
              <button onClick={handleSignOut} className="signout-button">
                Sign Out
              </button>
            </li>
          </>
        ) : (
          // Regular Pages: Show Full Navigation
          <>
            {location.pathname !== "/" && (
              <li>
                <span onClick={() => navigate("/")}>Back to Main</span>
              </li>
            )}
            {location.pathname !== "/talent" && (
              <li>
                <span onClick={() => navigate("/talent")}>Talent</span>
              </li>
            )}
            {location.pathname !== "/talent-scout" && (
              <li>
                <span onClick={() => navigate("/talent-scout")}>
                  Talent Scout
                </span>
              </li>
            )}
            <li>
              <span>Jobs</span>
            </li>
            <li>
              <span>Messages</span>
            </li>
            <li>
              <span>Profile</span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
