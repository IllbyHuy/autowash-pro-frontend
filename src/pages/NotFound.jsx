import { useNavigate } from "react-router-dom";
import FuzzyText from "../components/FuzzyText"; // Đường dẫn trỏ tới file vừa tạo ở Bước 1

export default function NotFound() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleReturn = () => {
    // Check role để trả về đúng đầu não, tránh bị lỗi kẹt trang
    if (role === "Admin" || role === "Manager") {
      navigate("/admin/dashboard");
    } else if (role === "Customer") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-sans px-4 overflow-hidden">
      
      {/* COMPONENT FUZZY TEXT 404 */}
      <div className="flex justify-center items-center h-[200px] md:h-[300px]">
        <FuzzyText 
          baseIntensity={0.2} 
          hoverIntensity={0.8} 
          enableHover={true}
          glitchMode={true}          // Bật chế độ giật lag ngẫu nhiên
          glitchInterval={3000}      // 3 giây giật 1 lần
          color="#f43f5e"            // Màu rose-500 cho ngầu
          fontSize="clamp(6rem, 20vw, 15rem)"
          fontWeight={900}
        >
          404
        </FuzzyText>
      </div>

      <h2 className="text-xl font-bold mt-2 uppercase tracking-widest text-slate-200 z-10 relative">
        KHÔNG CÓ QUYỀN TRUY CẬP
      </h2>
      
      <p className="text-slate-500 text-xs mt-2 text-center max-w-sm font-mono z-10 relative">
        Bạn đang cố tình truy cập vào phân hệ không thuộc quyền hạn hoặc trang không tồn tại.
      </p>
      
      <button 
        onClick={handleReturn} 
        className="mt-10 z-10 relative bg-white text-black font-black px-8 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        ← RETURN TO SAFETY
      </button>

    </div>
  );
}