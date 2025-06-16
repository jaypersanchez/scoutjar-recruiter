import { React, useEffect, useState, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export default function AuthProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // On mount, restore user from token if available
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setUser(JSON.parse(storedToken));
    }
  }, []);

  // Sync localStorage whenever `user` changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("token", JSON.stringify(user));

      const isAuthPage = location.pathname === "/auth";
      navigate(isAuthPage ? "/" : location.pathname);
    } else {
      localStorage.removeItem("token");
      navigate("/auth");
    }
  }, [user, location.pathname, navigate]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
