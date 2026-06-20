import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function ManagerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Đăng xuất khỏi tài khoản Quản lý?")) return;
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar dọc dành cho Manager */}
      <aside className="w-64 bg-[#0a0a0a] p-6 border-r border-white/10 flex flex-col justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-black text-teal-400 mb-8 tracking-widest uppercase">Manager.</h2>
          <nav className="flex flex-col gap-2 font-bold text-sm text-slate-400">
            <Link 
              to="/manager/dashboard" 
              className={`px-4 py-3 rounded-xl transition-all ${
                location.pathname.includes('/dashboard') 
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-inner' 
                  : 'hover:text-white hover:bg-white/[0.02]'
              }`}
            >
               Overview Stats
            </Link>
            
            {/* Nếu ông có làm thêm trang Quản lý xe/nhân viên thì gắn link vào đây */}
          </nav>
        </div>

        {/* Nút Đăng xuất an toàn */}
        <button 
          onClick={handleLogout}
          className="text-left px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          ← Log Out
        </button>
      </aside>
      
      {/* Khu vực nội dung chính */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto custom-scrollbar">
        <Outlet />
      </main>
    </div>
  );
}