import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-6 md:px-12 font-sans pb-20 relative overflow-hidden">
      {/* Hiệu ứng ánh sáng nền phía sau */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        <button 
          onClick={() => navigate("/")}
          className="text-xs font-mono tracking-widest text-slate-500 hover:text-rose-400 transition-colors uppercase mb-8 flex items-center gap-2"
        >
          ← Back to Infrastructure
        </button>

        {/* TIÊU ĐỀ BIỂU DIỄN NỔI BẬT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-white/10 pb-10"
        >
          <span className="text-xs font-bold tracking-[0.4em] text-rose-400 uppercase font-mono block mb-3">
            Legal & Documentation // 02
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            PRIVACY <span className="text-rose-400">POLICY</span>
          </h1>
          <p className="text-slate-400 text-sm font-mono mt-4">
            CHÍNH SÁCH BẢO MẬT DỮ LIỆU PHƯƠNG TIỆN & KHÁCH HÀNG // AUTOWASH PRO INFRASTRUCTURE
          </p>
        </motion.div>

        {/* NỘI DUNG CHI TIẾT */}
        <div className="space-y-12 text-slate-300 text-sm leading-relaxed font-light">
          
          {/* THU THẬP THÔNG TIN */}
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic flex items-center gap-3">
              <span className="text-rose-400 font-mono text-xs not-italic">[1]</span> Dữ Liệu Chúng Tôi Thu Thập
            </h2>
            <p> Để đảm bảo quy trình vận hành tự động không bị sai lệch đơn hàng, hệ thống thu thập các thông tin sau:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 font-mono text-xs">
              <li>Thông tin tài khoản: Email, Tên định danh (để hiển thị lời chào trên Dashboard).</li>
              <li>Thông tin phương tiện (My Garage): Biển số xe (License Plate), Loại xe (Sedan, SUV...), Thương hiệu, Dòng xe và Màu sắc sơn xe.</li>
              <li>Lịch sử giao dịch: Số tiền thanh toán, Thời gian hẹn rửa xe và Lịch sử biến động điểm tích lũy (Point Logs).</li>
            </ul>
          </section>

          {/* MỤC ĐÍCH SỬ DỤNG */}
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic flex items-center gap-3">
              <span className="text-rose-400 font-mono text-xs not-italic">[2]</span> Mục Đích Đồng Bộ Hóa Thời Gian Thực
            </h2>
            <p>
              Mọi thông tin về Biển số xe và Gói rửa của ông được Backend đồng bộ trực tiếp xuống phần cứng tại sảnh rửa. Trạm rửa sẽ đọc Biển số xe để đối chiếu trạng thái đơn hàng trùng khớp, chuyển đổi từ <span className="text-amber-400 font-bold">Confirmed</span> sang <span className="text-purple-400 font-bold">In Progress</span> một cách chính xác mà không cần nhân viên can thiệp thủ công.
            </p>
          </section>

          {/* BẢO MẬT AN TOÀN */}
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic flex items-center gap-3">
              <span className="text-rose-400 font-mono text-xs not-italic">[3]</span> Cam Kết Bảo Mật An Ninh Hệ Thống
            </h2>
            <p>
              Chúng tôi mã hóa toàn bộ dữ liệu Token kết nối giữa Client ứng dụng React và Server thông qua giao thức bảo mật cao. AutoWash Pro cam kết không chia sẻ dữ liệu Gara xe, Email hay lịch trình di chuyển, tần suất rửa xe của ông cho bất kỳ bên thứ ba nào vì mục đích thương mại bẩn.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}