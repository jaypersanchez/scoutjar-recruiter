import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import Routers from "./routes";
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
      <RouterProvider router={Routers} />
      <AndrewAssistant />
    </>
  );
}
