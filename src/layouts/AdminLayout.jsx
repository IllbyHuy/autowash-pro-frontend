import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Sidebar dọc dành cho Admin */}
      <aside className="w-64 bg-[#0a0a0a] p-6 border-r border-white/10">
        <h2 className="text-xl font-black text-rose-500 mb-8 tracking-widest">ADMIN.</h2>
        <nav className="flex flex-col gap-4 font-bold text-sm text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">System Stats</span>
          <span className="hover:text-white cursor-pointer transition-colors">User Management</span>
        </nav>
      </aside>

      {/* Khu vực nội dung chính */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}