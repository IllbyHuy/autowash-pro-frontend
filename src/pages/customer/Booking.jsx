import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import PageLoader from "../../components/PageLoader";

export default function Booking() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [promotions, setPromotions] = useState([]); // STATE MỚI ĐỂ CHỨA PROMO

  // State cho form đặt lịch
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedPromo, setSelectedPromo] = useState(""); // Lưu ID mã giảm giá
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const myUserId = localStorage.getItem("userId");

        if (!myUserId) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // GỌI 3 API: Xe, Dịch vụ, và MÃ GIẢM GIÁ
        const [vehiclesRes, washesRes, promosRes] = await Promise.all([
          axios.get(`https://smart-car-wash-system-be.onrender.com/api/vehicles/customer/${myUserId}`, { headers }).catch(() => null),
          axios.get(`https://smart-car-wash-system-be.onrender.com/api/washes`, { headers }).catch(() => null),
          axios.get(`https://smart-car-wash-system-be.onrender.com/api/promotions`, { headers }).catch(() => null), // Lấy Promo
        ]);

        if (vehiclesRes?.data) {
          const cars = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : vehiclesRes.data.data || [];
          setVehicles(cars);
          if (cars.length > 0) setSelectedVehicle(cars[0].id); 
        }

        if (washesRes?.data) {
          const washList = Array.isArray(washesRes.data) ? washesRes.data : washesRes.data.data || [];
          setServices(washList);
          if (washList.length > 0) setSelectedService(washList[0].id);
        }

        // Xử lý dữ liệu Promo (Lọc ra mấy cái đang Active)
        if (promosRes?.data) {
          const promoList = Array.isArray(promosRes.data) ? promosRes.data : promosRes.data.data || [];
          setPromotions(promoList.filter(p => p.isActive)); 
        }

      } catch (error) {
        console.error("Lỗi lấy dữ liệu Booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      const myUserId = localStorage.getItem("userId");
      
      const combinedDateTime = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();

      const payload = {
        customerId: myUserId,
        vehicleId: selectedVehicle,
        serviceId: selectedService,
        // NẾU CÓ CHỌN PROMO THÌ TRUYỀN ID, KHÔNG THÌ TRUYỀN NULL NHƯ YÊU CẦU CỦA BE
        promoId: selectedPromo !== "" ? selectedPromo : null, 
        scheduledTime: combinedDateTime,
        paymentMethod: 0, 
        staffNotes: "" 
      };

      await axios.post("https://smart-car-wash-system-be.onrender.com/api/booking", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Đặt lịch rửa xe thành công mỹ mãn! Hẹn gặp bạn tại AutoWash Pro! 🎉");
      navigate("/dashboard");

    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      alert(error.response?.data?.message || "Đặt lịch thất bại. Vui lòng kiểm tra lại ngày giờ!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}

      <div className="min-h-screen bg-[#050505] text-white pt-24 px-6 md:px-12 font-sans relative overflow-hidden pb-20">
        
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-teal-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="flex items-center gap-4 mb-10">
            <Link to="/dashboard" className="text-slate-500 hover:text-teal-400 transition-colors bg-[#111] w-10 h-10 flex items-center justify-center rounded-xl border border-white/5">
              ←
            </Link>
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic text-white">NEW BOOKING.</h1>
              <p className="text-teal-500 font-mono text-sm tracking-widest mt-1">SELECT SERVICE & TIME</p>
            </div>
          </div>

          <form onSubmit={handleBooking} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* CỘT TRÁI: DANH SÁCH DỊCH VỤ */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-white/10 pb-4">1. Select Wash Service</h2>
              <div className="space-y-4">
                {services.map((svc, index) => (
                  <motion.div 
                    key={svc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedService(svc.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                      selectedService === svc.id 
                        ? "bg-teal-500/10 border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.15)]" 
                        : "bg-[#111] border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{svc.name}</h3>
                      <span className="text-teal-400 font-mono font-bold">{svc.basePrice?.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{svc.description}</p>
                    <div className="flex gap-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-white/5 text-slate-300">⏱ {svc.estimatedDurationMinutes} MINS</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-amber-500/10 text-amber-400">★ +{svc.pointsPerTransaction} PTS</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CỘT PHẢI: CHỌN XE VÀ NGÀY GIỜ */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-white/10 pb-4">2. Vehicle & Schedule</h2>
              
              <div className="bg-[#111] border border-white/5 p-8 rounded-2xl space-y-6">
                
                {/* Chọn xe */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Select Vehicle</label>
                  {vehicles.length === 0 ? (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
                      Bạn chưa có xe nào. Vui lòng quay lại Dashboard để thêm xe!
                    </div>
                  ) : (
                    <select 
                      required
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl px-4 py-4 outline-none focus:border-teal-500 appearance-none font-bold"
                    >
                      <option value="" disabled>-- Chọn xe của bạn --</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.licensePlate} - {v.brand} {v.model}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Date</label>
                    <input type="date" required value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl px-4 py-4 outline-none focus:border-teal-500 [color-scheme:dark]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Time</label>
                    <input type="time" required value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl px-4 py-4 outline-none focus:border-teal-500 [color-scheme:dark]" />
                  </div>
                </div>

                {/* KHU VỰC CHỌN KHUYẾN MÃI (MỚI) */}
                <div className="space-y-2">
                  <label className="text-[11px] text-amber-500 uppercase tracking-widest font-bold flex justify-between">
                    <span>Promotion Code</span>
                    <span>🏷️</span>
                  </label>
                  <select 
                    value={selectedPromo}
                    onChange={(e) => setSelectedPromo(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-amber-500/20 text-white rounded-xl px-4 py-4 outline-none focus:border-amber-500 appearance-none font-bold transition-all"
                  >
                    <option value="">-- Không dùng mã giảm giá --</option>
                    {promotions.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.promoName} (Giảm {p.discountPercent > 0 ? `${p.discountPercent}%` : `${p.discountAmount?.toLocaleString('vi-VN')}đ`})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button 
                    type="submit"
                    disabled={isSubmitting || vehicles.length === 0}
                    className="w-full bg-teal-500 text-black py-4 rounded-xl font-black text-sm tracking-widest hover:bg-teal-400 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                  >
                    {isSubmitting ? "PROCESSING..." : "CONFIRM BOOKING"}
                  </button>
                </div>

              </div>
            </div>

          </form>

        </div>
      </div>
    </>
  );
}