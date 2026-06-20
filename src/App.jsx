import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignalRProvider } from "./contexts/SignalRContext";

// --- LAYOUTS ---
import MainLayout from "./layouts/MainLayout"; // Cho Customer (Header ngang)
import ManagerLayout from "./layouts/ManagerLayout"; // Cho Manager (Sidebar dọc riêng)
import AdminLayout from "./layouts/AdminLayout"; // Cho Admin (Sidebar dọc riêng)
import Profile from "./pages/Profile";

// --- GUARDS (Bảo vệ các tuyến đường) ---
import PublicRoute from "./routes/PublicRoute"; // Chỉ cho người chưa Login
import PrivateRoute from "./routes/PrivateRoute"; // Chỉ cho Customer đã Login
import ManagerRoute from "./routes/ManagerRoute"; // Chỉ cho Manager
import AdminRoute from "./routes/AdminRoute"; // Chỉ cho Admin

// --- PAGES: CUSTOMER ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import CustomerDashboard from "./pages/customer/Dashboard";
import Booking from "./pages/customer/Booking";

// --- PAGES: MANAGER ---
import ManagerDashboard from "./pages/manager/ManagerDashboard";

// --- PAGES: ADMIN ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

// --- PAGES: ERROR (MỚI THÊM) ---
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  return (
    <SignalRProvider>
      <BrowserRouter>
        <Routes>
          {/* ==========================================
            1. LUỒNG CUSTOMER (Dùng MainLayout)
            ========================================== */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="confirm-email" element={<ConfirmEmail />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="privacy" element={<PrivacyPolicy />} />

            {/* CHỈ NGƯỜI CHƯA ĐĂNG NHẬP MỚI VÀO ĐÂY */}
            <Route element={<PublicRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* CHỈ CUSTOMER (ĐÃ LOG IN) MỚI VÀO ĐÂY */}
            <Route element={<PrivateRoute />}>
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="booking" element={<Booking />} />
            </Route>
          </Route>

          {/* ==========================================
            2. LUỒNG MANAGER (Dùng ManagerLayout)
            ========================================== */}
          <Route path="/manager" element={<ManagerRoute />}>
            <Route element={<ManagerLayout />}>
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="profile" element={<Profile />} />
              {/* Thêm các trang quản lý lịch đặt, dịch vụ của Manager ở đây */}
            </Route>
          </Route>

          {/* ==========================================
            3. LUỒNG ADMIN (Dùng AdminLayout)
            ========================================== */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<Profile />} />
              {/* Đã FIX: Bỏ chữ /admin/ đi vì đang nằm trong Route cha /admin rồi */}
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>

          {/* ==========================================
            4. TRANG BÁO LỖI 404 (SỬ DỤNG FUZZY TEXT)
            ========================================== */}
          {/* Route này dành cho code "navigate('/404')" gọi chủ động */}
          <Route path="404" element={<NotFound />} />

          {/* Route này để bắt TẤT CẢ các đường dẫn gõ sai hoặc đi lạc */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SignalRProvider>
  );
}

export default App;
