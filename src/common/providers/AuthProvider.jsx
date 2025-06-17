//import { Page404 } from "@/common/components/layouts/Page404";
import { useEffect, useState, createContext } from "react";
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
  /*useEffect(() => {
    if (user) {
      localStorage.setItem("token", JSON.stringify(user));

      const isAuthPage = location.pathname === "/recruiter";
      //navigate(isAuthPage ? "/" : location.pathname);
      navigate("/recruiter/dashboard", { replace: true });
    } else {
      localStorage.removeItem("token");
      navigate("/recruiter/login");
    }
  }, [user, location.pathname, navigate]);*/
  useEffect(() => {
  if (user) {
    const isOnAuthPage = [
      "/recruiter/login",
      "/recruiter/reset-password",
      "/recruiter/reset-password/:token"
    ].some(authPath => location.pathname.startsWith(authPath));

    if (isOnAuthPage) {
      navigate("/recruiter/dashboard", { replace: true });
    }
  } else {
    if (!location.pathname.startsWith("/recruiter/login")) {
      navigate("/recruiter/login", { replace: true });
    }
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
