import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Talent from "./components/Talent";
import RecruiterDashboard from "./components/TalentScout/RecruiterDashboard";
import Header from "./components/Header";
import AuthPage from "./components/Auth";

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="App">
      {/* Show Header only if NOT on the AuthPage */}
      {location.pathname !== "/talent-scout" && <Header />}
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/talent-scout"
          element={
            <Layout>
              <RecruiterDashboard />
            </Layout>
          }
        />
        <Route
          path="/talent"
          element={
            <Layout>
              <Talent />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
