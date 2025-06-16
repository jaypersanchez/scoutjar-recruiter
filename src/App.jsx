import React from "react";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import Routers from "./pages/LoginPage";
import AndrewAssistant from "@/components/AndrewAssistant";


export default function App() {

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
      <ErrorBoundary>
        <RouterProvider router={Routers} />
      </ErrorBoundary>
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
