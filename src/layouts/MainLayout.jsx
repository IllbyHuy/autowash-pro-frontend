import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    // Bắt buộc phải có bg-black ở đây để nền web màu đen
    <div className="min-h-screen bg-black text-white w-full overflow-hidden">
      <Header />
      
      {/* Khu vực chứa nội dung các trang (Home, Dashboard...) */}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}