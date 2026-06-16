import { Navigate, Outlet } from "react-router-dom";
export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return (token && role === "Admin") ? <Outlet /> : <Navigate to="/login" replace />;
}