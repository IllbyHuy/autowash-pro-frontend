import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // 🛑 NẾU ĐÃ CÓ TOKEN: Đá về đúng Dashboard của từng Role
  if (token) {
    if (userRole === "Admin") return <Navigate to="/admin/dashboard" replace />;
    if (userRole === "Manager") return <Navigate to="/manager/dashboard" replace />;
    
    // Nếu là Customer thì về trang của khách
    return <Navigate to="/dashboard" replace />;
  }

  // CHƯA CÓ TOKEN: Cho phép vào trang Login / Register
  return <Outlet />;
}