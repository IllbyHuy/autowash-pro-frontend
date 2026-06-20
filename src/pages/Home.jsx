import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // QUAN TRỌNG: Import useNavigate
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

import videoSrc from "../assets/autowash.mp4";
import CountUp from "../components/CountUp";
import RotatingText from "../components/RotatingText";
import TrueFocus from "../components/TrueFocus";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [services, setServices] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [activePromo, setActivePromo] = useState(null);
  const navigate = useNavigate();

  // --- HÀM ĐIỀU HƯỚNG THÔNG MINH ---
  const handleSmartAction = (customerPath) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Chưa đăng nhập -> Đá qua trang Login
    if (!token) {
      navigate("/login");
      return;
    }

    // Đã đăng nhập
    if (role === "Customer") {
      navigate(customerPath); // Tùy ngữ cảnh mà qua /booking hoặc /dashboard
    } else if (role === "Admin" || role === "Manager") {
      navigate("/admin/dashboard"); // Admin thì bắt về phòng làm việc
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [washesRes, tiersRes, promosRes] = await Promise.all([
          axios
            .get(`https://smart-car-wash-system-be.onrender.com/api/washes`)
            .catch(() => null),
          axios
            .get(`https://smart-car-wash-system-be.onrender.com/api/tiers`)
            .catch(() => null),
          axios
            .get(`https://smart-car-wash-system-be.onrender.com/api/promotions`)
            .catch(() => null),
        ]);

        if (washesRes?.data) {
          const data = Array.isArray(washesRes.data)
            ? washesRes.data
            : washesRes.data.data || [];
          setServices(data.slice(0, 3));
        }

        if (tiersRes?.data) {
          const data = Array.isArray(tiersRes.data)
            ? tiersRes.data
            : tiersRes.data.data || [];
          data.sort((a, b) => a.minPoints - b.minPoints);
          setTiers(data.slice(0, 3));
        }

        if (promosRes?.data) {
          const data = Array.isArray(promosRes.data)
            ? promosRes.data
            : promosRes.data.data || [];
          const bestPromo = data.find(
            (p) => p.isActive && p.discountPercent > 0,
          );
          if (bestPromo) setActivePromo(bestPromo);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Home:", error);
      }
    };

    fetchPublicData();
  }, []);

  const displayServices =
    services.length > 0
      ? services
      : [
          {
            id: "01",
            name: "Standard Auto Wash",
            description: "Chu trình rửa bọt tuyết tiêu chuẩn.",
            basePrice: 50000,
            estimatedDurationMinutes: 15,
          },
          {
            id: "02",
            name: "Premium Care Combo",
            description: "Bao gồm Standard Wash + phủ bóng Wax.",
            basePrice: 150000,
            estimatedDurationMinutes: 25,
          },
          {
            id: "03",
            name: "Ultimate Detailing VIP",
            description: "Quy trình làm sạch tối thượng.",
            basePrice: 350000,
            estimatedDurationMinutes: 50,
          },
        ];

  const displayTiers =
    tiers.length > 0
      ? tiers
      : [
          {
            name: "Silver Tier",
            minPoints: 0,
            multiplierBonus: 1.0,
            description: "Hỗ trợ đặt lịch cơ bản.",
          },
          {
            name: "Gold Tier",
            minPoints: 500,
            multiplierBonus: 1.2,
            description: "Ưu tiên PriorityLevel, quà sinh nhật.",
          },
          {
            name: "Platinum VIP",
            minPoints: 1500,
            multiplierBonus: 1.5,
            description: "Phục vụ phòng chờ hạng thương gia.",
          },
        ];

  const tierColors = [
    "border-slate-800 bg-slate-900/40 text-slate-300",
    "border-yellow-500/30 bg-yellow-500/[0.02] text-yellow-500",
    "border-teal-400/50 bg-teal-400/[0.03] text-teal-400",
  ];

  return (
    <>
      <div className="w-full bg-white font-sans antialiased text-slate-900 selection:bg-teal-500 selection:text-white relative">
        {/* ── SECTION 1: HERO BACKGROUND VIDEO ────────────────── */}
        <div className="relative w-full h-screen overflow-hidden bg-black">
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 pointer-events-none"
          />

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
            <span className="text-xs font-bold tracking-[0.4em] text-teal-500 uppercase mb-4 animate-pulse italic">
              Next-Gen Automation
            </span>

            <h1 className="flex flex-col items-center leading-[0.85]">
              <span className="text-7xl md:text-[9rem] font-black tracking-tighter text-white uppercase italic">
                SMART
              </span>
              <span className="text-6xl md:text-[7.5rem] font-black tracking-tighter text-teal-500 uppercase italic">
                WASH SYSTEM
              </span>
            </h1>

            <p className="mt-8 text-white/40 font-mono text-[10px] tracking-[0.2em] uppercase">
              Precision Engineering // Automated Infrastructure
            </p>
          </div>
        </div>

        {/* ── SECTION 2: WASH SERVICES ────────────────── */}
        <section
          id="services"
          className="py-32 px-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 bg-white"
        >
          <div>
            <div className="w-12 h-1 bg-teal-500 mb-8"></div>
            <h2 className="text-6xl font-black tracking-tighter leading-tight mb-10 uppercase">
              Automated systems <br />
              that{" "}
              <span className="text-teal-500 italic underline decoration-wavy">
                maximize shine
              </span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md font-normal">
              Trải nghiệm quy trình chăm sóc xe không tiếp xúc chuẩn kỹ thuật
              cao. Thời gian tối ưu, bọt tuyết đa điểm đánh bật mọi vết bẩn cứng
              đầu trên Vehicle của bạn.
            </p>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 font-bold">
                ★
              </div>
              <div>
                <p className="font-bold text-sm">Hệ Thống Tích Điểm Tự Động</p>
                <p className="text-xs text-slate-400 uppercase">
                  Nhận thưởng Points tương thích thời gian thực
                </p>
              </div>
            </div>

            {/* THÊM ONCLICK DẪN ĐẾN ĐẶT LỊCH */}
            <button
              onClick={() => handleSmartAction("/booking")}
              className="inline-block bg-slate-950 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-teal-500 transition-colors shadow-xl"
            >
              Book Appointment Now <span>→</span>
            </button>
          </div>

          <div className="space-y-6 pt-6">
            {displayServices.map((service, index) => (
              <div
                key={service.id || index}
                onClick={() => handleSmartAction("/booking")} // CLICK THẺ DỊCH VỤ CŨNG QUA ĐẶT LỊCH LUÔN
                className="group relative bg-slate-50 border border-slate-100 p-8 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-300 hover:bg-slate-950 hover:text-white hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="max-w-md pr-4">
                  <span className="font-mono text-xs text-teal-500 font-bold">
                    SERVICE 0{index + 1} — {service.estimatedDurationMinutes}{" "}
                    MINS
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight mt-1 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 line-clamp-2">
                    {service.description ||
                      "Dịch vụ rửa xe tự động chất lượng cao."}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-3 shrink-0">
                  <span className="text-2xl font-black tracking-tight text-slate-950 group-hover:text-teal-400">
                    {service.basePrice?.toLocaleString("vi-VN")}đ
                  </span>
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-black font-bold group-hover:bg-teal-400 group-hover:border-teal-400 group-hover:text-white transition-colors">
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: MEMBERSHIP TIERS ────────────────── */}
        <section className="bg-slate-950 text-white py-32 border-y border-slate-900">
          <div className="text-center mb-20">
            <span className="text-xs font-mono tracking-widest text-teal-400 uppercase">
              Loyal Program
            </span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mt-2 flex justify-center items-center text-white">
              <span className="shrink-0">Membership</span>
              <span className="inline-flex justify-start text-left pl-5 w-[380px] md:w-[480px] text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 shrink-0 overflow-hidden">
                <RotatingText
                  texts={["Tier System", "Rank Matrix", "Level Engine"]}
                  mainClassName="overflow-hidden py-1 justify-start text-left flex-nowrap"
                  staggerFrom={"last"}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-120%", opacity: 0 }}
                  staggerDuration={0.025}
                  splitBy="characters"
                  splitLevelClassName="overflow-hidden whitespace-nowrap"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                  elementLevelClassName="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400"
                />
              </span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-sm mx-auto text-sm">
              Tích lũy LifetimePoints qua mỗi lần rửa để nâng cấp Rank và hưởng
              point multiplier cực khủng.
            </p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-10">
            {displayTiers.map((tier, index) => (
              <div
                key={tier.id || index}
                className={`p-8 border rounded-3xl flex flex-col justify-between h-72 transition-all hover:border-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] ${tierColors[index % 3]}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">
                      {tier.name}
                    </h3>
                    <span className="px-3 py-1 text-[10px] font-mono font-bold bg-white/10 text-white rounded-full">
                      x{tier.multiplierBonus || 1.0} PTS
                    </span>
                  </div>
                  <p className="text-xs text-slate-300/80 leading-relaxed font-mono mt-4">
                    {tier.description || "Hưởng đặc quyền theo thứ hạng."}
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>MinPoints: {tier.minPoints}</span>

                  {/* THÊM ONCLICK VÀO VIEW PERKS DẪN QUA DASHBOARD */}
                  <span
                    onClick={() => handleSmartAction("/dashboard")}
                    className="text-white hover:text-teal-400 cursor-pointer transition-colors"
                  >
                    View Perks →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: LIVE PROMOTIONS ────────────────── */}
        <section className="py-40 bg-white text-center border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400 mb-6 font-mono">
            Exclusive Offers
          </p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-16 uppercase text-slate-950 flex flex-col items-center gap-4">
            <span>Active Promotions For</span>
            <span className="bg-slate-950 px-8 py-4 rounded-2xl inline-block shadow-2xl mt-2">
              <TrueFocus
                sentence="Loyal Customers"
                manualMode={false}
                blurAmount={4}
                borderColor="#2dd4bf"
                glowColor="rgba(45, 212, 191, 0.6)"
                animationDuration={0.4}
                pauseBetweenAnimations={1.2}
              />
            </span>
          </h2>
          <div className="max-w-4xl mx-auto bg-slate-950 text-white p-12 rounded-[2rem] shadow-2xl text-left relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <span className="bg-teal-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Mã giảm giá hot
              </span>
              <h3 className="text-3xl font-black uppercase tracking-tight mt-3 mb-2">
                Giảm Ngay{" "}
                <CountUp
                  to={activePromo ? activePromo.discountPercent : 20}
                  from={0}
                  duration={1.5}
                  className="text-teal-400"
                />
                % VỚI MÃ:{" "}
                <span className="text-teal-400 underline decoration-wavy">
                  {activePromo ? activePromo.promoName : "CHAOHE20"}
                </span>
              </h3>
              <p className="text-sm text-slate-400 font-light mt-2">
                {activePromo
                  ? activePromo.description
                  : "Áp dụng cho mọi tài khoản mới khởi tạo hệ thống Account."}
              </p>
            </div>
            <div className="text-center md:text-right">
              {/* THÊM ONCLICK ĐỂ DẪN TỚI TRANG ĐẶT LỊCH SỬ DỤNG MÃ */}
              <button
                onClick={() => handleSmartAction("/booking")}
                className="inline-block w-full md:w-auto bg-teal-400 text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider hover:bg-white hover:scale-105 transition-all"
              >
                Dùng Mã Ngay
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER SYSTEM ────────────────── */}
        <footer className="bg-slate-950 py-20 px-10 rounded-t-[3rem] text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-20">
            <div className="text-7xl font-black italic tracking-tighter opacity-20 text-teal-400">
              AUTOWASH PRO.
            </div>

            {/* ĐÃ CẮT BỎ PRIVACY VÀ TERMS OF USE THEO YÊU CẦU */}
            <div className="flex gap-12 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <a
                href="#services"
                className="hover:text-white transition-colors"
              >
                Services
              </a>

              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-10 flex flex-col md:flex-row justify-between text-[10px] text-slate-600 font-mono gap-4">
            <p>
              © 2026 AutoWash Pro Automated Infrastructure Engineering. All
              Rights Reserved.
            </p>
            <p>Powered by .NET 8 EF Core & React Vite Ecosystem</p>
          </div>
        </footer>
      </div>
    </>
  );
}
