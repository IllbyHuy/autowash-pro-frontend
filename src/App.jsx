import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Giữ nguyên các import cũ của bạn
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Header from "./components/Header"; // Nếu bạn có thanh menu

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
            </>
          }
        />

        {/* Đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Khu vực thành viên */}
        <Route
          path="/dashboard"
          element={
            <>
              <Header />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/booking"
          element={
            <>
              <Header />
              <Booking />
            </>
          }
        />
      </Routes>
    </Router>
  );
}
