import { Navigate, Outlet } from "react-router-dom";

export default function ManagerRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Sau này lúc Login BE trả về role gì thì lưu vô đây

  // 1. Chưa đăng nhập -> Đuổi ra trang Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Đã đăng nhập nhưng KHÔNG phải Manager -> Đá về trang Home của khách
  if (role !== "Manager") {
    return <Navigate to="/" replace />;
  }

  // 3. Đúng là Manager -> Cho vào làm việc
  return <Outlet />;
}