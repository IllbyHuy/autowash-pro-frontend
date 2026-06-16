import { Navigate, Outlet } from "react-router-dom";
export default function PrivateRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return (token && role === "Customer") ? <Outlet /> : <Navigate to="/login" replace />;
}