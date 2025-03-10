import { RouterProvider } from "react-router-dom";
import Routers from "./routes";

export default function App() {
  return (
    <>
      <RouterProvider router={Routers} />
    </>
  );
}
