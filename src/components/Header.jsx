import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader"; // Import Loader ma trận Hex9

export default function Header() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLoading(true); // Bật hiệu ứng tổ ong
    
    // Giả lập hệ thống xử lý trong 1.2s rồi chuyển sang form Login
    setTimeout(() => {
      setIsLoading(false); // Tắt loading để lần sau quay lại Header vẫn bấm được
      navigate('/login');
    }, 1200); 
  };

  return (
    <>
      {/* Bật PageLoader đè lên trên tất cả nếu isLoading là true */}
      {isLoading && <PageLoader />}

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 mix-blend-difference text-white">
        <div className="text-2xl font-black tracking-tighter uppercase italic text-teal-400">
          AUTOWASH PRO.
        </div>
        
        <nav className="hidden md:flex gap-10 text-[11px] font-bold tracking-widest uppercase opacity-80">
          <a href="/" className="hover:text-teal-400 transition-colors">Home</a>
          <a href="#services" className="hover:text-teal-400 transition-colors">Wash Services</a>
          <a href="#tiers" className="hover:text-teal-400 transition-colors">Membership Tiers</a>
        </nav>
        
        {/* Nút Login của bạn - đã thêm onClick */}
        <button 
          onClick={handleLoginClick}
          className="group flex items-center gap-3 px-6 py-2 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-tighter hover:bg-teal-400 hover:text-white transition-all"
        >
          Login Account
          <span className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full group-hover:bg-white group-hover:text-black transition-colors">
            →
          </span>
        </button>
      </header>
    </>
  );
}