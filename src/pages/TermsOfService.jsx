import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-6 md:px-12 font-sans pb-20 relative overflow-hidden">
      {/* Hiệu ứng ánh sáng nền phía sau */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Nút quay lại trang chủ */}
        <button 
          onClick={() => navigate("/")}
          className="text-xs font-mono tracking-widest text-slate-500 hover:text-teal-400 transition-colors uppercase mb-8 flex items-center gap-2"
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
          <span className="text-xs font-bold tracking-[0.4em] text-teal-400 uppercase font-mono block mb-3">
            Legal & Documentation // 01
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            TERMS OF <span className="text-teal-400">SERVICE</span>
          </h1>
          <p className="text-slate-400 text-sm font-mono mt-4">
            ĐIỀU KHOẢN DỊCH VỤ & GIỚI THIỆU HỆ THỐNG AUTOWASH PRO // CẬP NHẬT MỚI NHẤT 2026
          </p>
        </motion.div>

        {/* NỘI DUNG CHI TIẾT */}
        <div className="space-y-12 text-slate-300 text-sm leading-relaxed font-light">
          
          {/* MỤC GIỚI THIỆU */}
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic flex items-center gap-3">
              <span className="text-teal-400 font-mono text-xs not-italic">[A]</span> Giới Thiệu Hệ Thống
            </h2>
            <p>
              <strong className="text-white">AUTOWASH PRO.</strong> là hệ thống rửa xe tự động thông minh thế hệ mới, ứng dụng công nghệ điều khiển đa điểm không tiếp xúc. Chúng tôi cung cấp cơ sở hạ tầng tự động hóa tối ưu, giúp làm sạch phương tiện giao thông hiệu quả cao, tiết kiệm thời gian và tích hợp hệ thống quản lý số hóa toàn diện cho khách hàng.
            </p>
          </section>

          {/* MỤC QUY ĐỊNH ĐẶT LỊCH */}
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic flex items-center gap-3">
              <span className="text-teal-400 font-mono text-xs not-italic">[B]</span> Quy Định Đặt Lịch & Hủy Ca (Booking)
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Khách hàng có quyền tự do lựa chọn các gói dịch vụ wash từ cơ bản đến VIP thông qua hệ thống thời gian thực.</li>
              <li>Lịch hẹn sau khi được xác nhận (<span className="text-blue-400 font-bold">Confirmed</span>) cần được thực hiện đúng giờ. Quá thời gian quy định 15 phút mà phương tiện chưa vào sảnh, hệ thống tự động đưa đơn về trạng thái chờ xử lý lại.</li>
              <li>Khách hàng có quyền hủy lịch (<span className="text-rose-400 font-bold">Cancel</span>) chủ động ngay trên trang Dashboard cá nhân trước khi ca rửa chuyển sang trạng thái <span className="text-purple-400 font-bold">In Progress</span>.</li>
            </ul>
          </section>

          {/* MỤC TÍCH ĐIỂM THÀNH VIÊN */}
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic flex items-center gap-3">
              <span className="text-teal-400 font-mono text-xs not-italic">[C]</span> Cơ Chế Tích Điểm & Hạng Thành Viên (Tiers)
            </h2>
            <p>
              Mỗi giao dịch hoàn thành trên hệ thống sẽ tự động cộng điểm thưởng (<span className="text-teal-400 font-mono">PointsPerTransaction</span>) trực tiếp vào tài khoản dựa theo gói dịch vụ đã chọn. Số điểm này dùng để xét hạng thành viên (Bạc, Vàng, Platinum) nhằm kích hoạt hệ số nhân điểm (Multiplier) và nhận mã khuyến mãi (Promotions) độc quyền từ quản trị viên.
            </p>
          </section>

          {/* MỤC MIỄN TRỪ TRÁCH NHIỆM */}
          <section className="space-y-4 border-l-2 border-rose-500/40 pl-6 bg-white/[0.01] py-4 rounded-r-xl">
            <h2 className="text-xl font-black tracking-tight text-rose-400 uppercase italic flex items-center gap-3">
              <span className="text-rose-500 font-mono text-xs not-italic">[D]</span> Giới Hạn Trách Nhiệm Về Phương Tiện
            </h2>
            <p className="text-slate-400">
              Hệ thống tự động sử dụng áp lực nước và bọt tuyết chuẩn kỹ thuật cao để xử lý bề mặt vỏ xe. Khách hàng có trách nhiệm tự bảo quản tài sản có giá trị cao bên trong cabin xe. AutoWash Pro không chịu trách nhiệm đối với các hư hỏng có sẵn từ trước, các chi tiết độ chế ngoài thông số nhà sản xuất phương tiện khi đi qua buồng sấy thổi áp lực lớn.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}