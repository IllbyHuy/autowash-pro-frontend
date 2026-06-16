import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";

export default function Header() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("Customer");
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để biết đang ở trang nào

  // Kiểm tra trạng thái đăng nhập mỗi khi component render
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("role") || "Customer");
    };

    // Lắng nghe tín hiệu
    window.addEventListener("storage", checkAuth);
    // Gọi lần đầu
    checkAuth();

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleAuthAction = () => {
    setIsLoading(true);

    setTimeout(() => {
      if (isLoggedIn) {
        // --- LOGOUT LOGIC TRỌN VẸN ---
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        
        window.dispatchEvent(new Event("storage")); // Báo cho toàn app biết
        setIsLoggedIn(false);
        setIsLoading(false);
        navigate("/"); // Về trang chủ
      } else {
        // --- LOGIN LOGIC ---
        setIsLoading(false);
        navigate("/login");
      }
    }, 1200);
  };

  // Hàm tạo link dựa theo Role
  const getBasePath = () => {
    if (userRole === "Admin") return "/admin";
    if (userRole === "Manager") return "/manager";
    return ""; // Customer không có tiền tố
  };

  const basePath = getBasePath();
  const dashboardLink = `${basePath}/dashboard`;
  const profileLink = `${basePath}/profile`;

  // Hàm check Active trang hiện tại
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isLoading && <PageLoader />}

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 mix-blend-difference text-white">
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter uppercase italic text-teal-400"
        >
          AUTOWASH PRO.
        </Link>

        <nav className="hidden md:flex gap-10 text-[11px] font-bold tracking-widest uppercase opacity-80">
          <Link 
            to="/" 
            className={`transition-colors hover:text-teal-400 ${isActive("/") ? "text-teal-400 opacity-100" : ""}`}
          >
            Home
          </Link>
          <a href="#services" className="hover:text-teal-400 transition-colors">
            Wash Services
          </a>
          
          {/* Hiện Menu riêng nếu Đã Đăng Nhập */}
          {isLoggedIn && (
            <>
              <Link
                to={dashboardLink}
                className={`transition-colors hover:text-teal-400 ${isActive(dashboardLink) ? "text-teal-400 opacity-100" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to={profileLink}
                className={`transition-colors hover:text-teal-400 ${isActive(profileLink) ? "text-teal-400 opacity-100" : ""}`}
              >
                Profile
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={handleAuthAction}
          className={`group flex items-center gap-3 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-tighter transition-all ${
            isLoggedIn
              ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
              : "bg-white text-black hover:bg-teal-400 hover:text-white"
          }`}
        >
          {isLoggedIn ? "Log Out" : "Login Account"}
          <span className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full group-hover:bg-white group-hover:text-black transition-colors">
            {isLoggedIn ? "×" : "→"}
          </span>
        </button>
      </header>
    </>
  );
}