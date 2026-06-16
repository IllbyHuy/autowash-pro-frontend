import { Outlet } from "react-router-dom";

export default function ManagerLayout() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans">
      {/* Sidebar dọc dành cho Manager */}
      <aside className="w-64 bg-slate-950 p-6 border-r border-slate-800">
        <h2 className="text-xl font-black text-teal-400 mb-8 tracking-widest">MANAGER.</h2>
        <nav className="flex flex-col gap-4 font-bold text-sm text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
          <span className="hover:text-white cursor-pointer transition-colors">Manage Bookings</span>
        </nav>
      </aside>
      
      {/* Khu vực nội dung chính */}
      <main className="flex-1 p-10">
        <Outlet /> {/* <-- Bắt buộc phải có Outlet */}
      </main>
    </div>
  );
}