import React from "react";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
//import Routers from "./pages/LoginPage";
import Routers from "@/routes/index.jsx"; 

import AndrewAssistant from "@/components/AndrewAssistant";


export default function App() {
console.log("App loaded"); // Confirm App renders at all

  useEffect(() => {
    const clearOnReload = () => {
      if (process.env.NODE_ENV === "development") {
        sessionStorage.removeItem("sso-login");
      }
    };

    window.addEventListener("beforeunload", clearOnReload);
    return () => window.removeEventListener("beforeunload", clearOnReload);
  }, []);

  return (
    <>
      <RouterProvider router={Routers} />
      <AndrewAssistant />
    </>
  );
}

function ErrorBoundary({ children }) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <React.ErrorBoundary
        fallbackRender={({ error }) => (
          <div style={{ color: "red" }}>
            <strong>Routing Error:</strong> {error.message}
          </div>
        )}
      >
        {children}
      </React.ErrorBoundary>
    </React.Suspense>
  );
}
