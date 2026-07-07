import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- HÀM XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = () => {
    if (window.confirm("Ông có chắc chắn muốn đăng xuất khỏi tài khoản Admin?")) {
      // Xóa toàn bộ token và thông tin user
      localStorage.clear();
      
      // Báo cho toàn hệ thống biết để update giao diện (Header, Context...)
      window.dispatchEvent(new Event("storage"));
      
      // Đá về trang đăng nhập
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar dọc dành cho Admin - Thêm flex-col và justify-between để ép Logout xuống đáy */}
      <aside className="w-64 bg-[#0a0a0a] p-6 border-r border-white/10 shrink-0 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-black text-rose-500 mb-8 tracking-widest">ADMIN.</h2>
          
          <nav className="flex flex-col gap-2 font-bold text-sm text-slate-400">
            <Link 
              to="/admin/dashboard" 
              className={`px-4 py-3 rounded-xl transition-all ${
                location.pathname.includes('/dashboard') 
                  ? 'bg-white/5 text-indigo-400 border border-white/5 shadow-inner' 
                  : 'hover:text-white hover:bg-white/[0.02]'
              }`}
            >
               System Stats
            </Link>
            
            <Link 
              to="/admin/users" 
              className={`px-4 py-3 rounded-xl transition-all ${
                location.pathname.includes('/users') 
                  ? 'bg-white/5 text-indigo-400 border border-white/5 shadow-inner' 
                  : 'hover:text-white hover:bg-white/[0.02]'
              }`}
            >
               User Management
            </Link>
          </nav>
        </div>

        {/* NÚT ĐĂNG XUẤT NẰM Ở ĐÁY */}
        <button 
          onClick={handleLogout}
          className="text-left px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors mt-auto flex items-center gap-3"
        >
          {/* Icon Logout cho vip */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Log Out
        </button>
      </aside>

      {/* Khu vực nội dung chính */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}