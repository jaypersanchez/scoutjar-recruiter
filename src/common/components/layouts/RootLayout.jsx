import { Outlet, Navigate } from "react-router-dom";

export default function RootLayout() {
  // if (true) {
  //   return <Navigate to="/auth" />;
  // }

  return (
    <>
      <Outlet />
    </>
  );
}
