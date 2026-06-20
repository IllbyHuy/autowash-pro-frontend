import { Outlet, Link, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar dọc dành cho Admin */}
      <aside className="w-64 bg-[#0a0a0a] p-6 border-r border-white/10 shrink-0">
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
      </aside>

      {/* Khu vực nội dung chính */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}