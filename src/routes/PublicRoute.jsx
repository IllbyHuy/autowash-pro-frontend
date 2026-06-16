import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");

  // Nếu đã có token, thì không cho vào Login/Register, đẩy về Dashboard
  return token ? <Navigate to="/dashboard" /> : <Outlet />;
}

