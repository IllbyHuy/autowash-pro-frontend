import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import videoSrc from "../assets/autowash.mp4";
import CountUp from "../components/CountUp";
import RotatingText from "../components/RotatingText";
import TrueFocus from "../components/TrueFocus";

gsap.registerPlugin(ScrollTrigger);


export default function Home() {
  return (
    <>
      <div className="w-full bg-white font-sans antialiased text-slate-900 selection:bg-teal-500 selection:text-white relative">
        {/* ── SECTION 1: HERO BACKGROUND VIDEO ────────────────── */}
        <div className="relative w-full h-screen overflow-hidden bg-black">
          {/* Thẻ video tự động chạy và lặp lại */}
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 pointer-events-none"
          />

          {/* Khối text SMART WASH SYSTEM đè lên trên */}
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
        <section className="py-32 px-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 bg-white">
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
              cao. Thời gian tối ưu (EstimatedDuration), bọt tuyết đa điểm đánh
              bật mọi vết bẩn cứng đầu trên Vehicle của bạn.
            </p>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 font-bold">
                ★
              </div>
              <div>
                <p className="font-bold text-sm">Hệ Thống Tích Điểm Tự Động</p>
                <p className="text-xs text-slate-400 uppercase">
                  PointsPerTransaction tương thích thời gian thực
                </p>
              </div>
            </div>
            <button className="bg-slate-950 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider flex items-center gap-4 hover:bg-teal-500 transition-colors shadow-xl">
              Book Appointment Now <span>→</span>
            </button>
          </div>

          <div className="space-y-6 pt-6">
            {[
              {
                id: "01",
                name: "Standard Auto Wash",
                desc: "Chu trình rửa bọt tuyết tiêu chuẩn, xịt gầm áp lực cao & thổi khô cấp tốc.",
                price: "50.000đ",
                duration: "15 mins",
              },
              {
                id: "02",
                name: "Premium Care Combo",
                desc: "Bao gồm Standard Wash + phủ bóng Wax bảo vệ lớp sơn + tẩy ố lazang chuyên sâu.",
                price: "150.000đ",
                duration: "25 mins",
              },
              {
                id: "03",
                name: "Ultimate Detailing VIP",
                desc: "Quy trình làm sạch tối thượng khoang máy, nội thất cabin & khử trùng Ozone toàn diện.",
                price: "350.000đ",
                duration: "50 mins",
              },
            ].map((service) => (
              <div
                key={service.id}
                className="group relative bg-slate-50 border border-slate-100 p-8 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-300 hover:bg-slate-950 hover:text-white hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="max-w-md">
                  <span className="font-mono text-xs text-teal-500 font-bold">
                    SERVICE {service.id} — {service.duration}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight mt-1 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 line-clamp-2">
                    {service.desc}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <span className="text-2xl font-black tracking-tight text-slate-950 group-hover:text-teal-400">
                    {service.price}
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
              Loyalty Program
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
            {[
              {
                name: "Silver Tier",
                points: "0 PTS",
                multiplier: "x1.0",
                perks: "Hỗ trợ đặt lịch trong BookingWindowDays quy định.",
                color: "border-slate-800 bg-slate-900/40",
              },
              {
                name: "Gold Tier",
                points: "500 PTS",
                multiplier: "x1.2",
                perks:
                  "Ưu tiên PriorityLevel tại sảnh check-in, tặng quà sinh nhật.",
                color: "border-yellow-500/30 bg-yellow-500/[0.02]",
              },
              {
                name: "Platinum VIP",
                points: "1500 PTS",
                multiplier: "x1.5",
                perks:
                  "Phục vụ phòng chờ hạng thương gia, miễn phí dịch vụ Addon cao cấp.",
                color: "border-teal-400/50 bg-teal-400/[0.03]",
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`p-8 border rounded-3xl flex flex-col justify-between h-72 transition-all hover:border-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] ${tier.color}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">
                      {tier.name}
                    </h3>
                    <span className="px-3 py-1 text-[10px] font-mono font-bold bg-white/10 text-teal-400 rounded-full">
                      {tier.multiplier} Points
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono mt-4">
                    {tier.perks}
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs font-mono text-slate-500">
                  <span>MinPoints: {tier.points}</span>
                  <span className="text-white hover:text-teal-400 cursor-pointer">
                    View Perks →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: 3D REAL-TIME INSPECTION ────────────────── */}
        {/* <section
          id="section-3d"
          className="relative h-screen w-full bg-black overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <h2 className="text-[14vw] font-black opacity-5 tracking-tighter leading-none text-center text-white uppercase italic">
              AUTOWASH
            </h2>
          </div>
          <div className="absolute inset-0 w-full h-full z-10">
            <Canvas
              dpr={[1, 2]}
              shadows
              camera={{ fov: 45, position: [0, 0, 5] }}
            >
              <color attach="background" args={["#000000"]} />
              <Stage
                environment="city"
                intensity={0.6}
                contactShadow={{ opacity: 0.6, blur: 2 }}
              >
                <PresentationControls
                  speed={1.5}
                  global
                  zoom={0.7}
                  polar={[-0.1, Math.PI / 4]}
                >
                  <CarModel />
                </PresentationControls>
              </Stage>
            </Canvas>
          </div>
          <div className="absolute bottom-12 left-12 z-20 border-l-2 border-teal-400 pl-4 font-mono pointer-events-none">
            <p className="text-xs text-teal-400 tracking-widest">
              DIAGNOSTIC_SYSTEM // RUNNING
            </p>
            <h4 className="text-xl font-black uppercase text-white tracking-wide mt-1 italic">
              Vehicle Body Scan: 100% Cleansed
            </h4>
          </div>
        </section> */}

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
                PromoType: Discount
              </span>
              <h3 className="text-3xl font-black uppercase tracking-tight mt-3 mb-2">
                Giảm Ngay{" "}
                <CountUp
                  to={20}
                  from={0}
                  duration={1.5}
                  className="text-teal-400"
                />
                % Cho Lần Đầu Đăng Ký Vehicle
              </h3>
              <p className="text-sm text-slate-400 font-light">
                Áp dụng cho mọi tài khoản mới khởi tạo hệ thống Account.
              </p>
            </div>
            <div className="text-center md:text-right">
              <button className="w-full md:w-auto bg-teal-400 text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider hover:bg-white hover:scale-105 transition-all">
                Claim Promo Code
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
            <div className="flex gap-12 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <a href="#" className="hover:text-white transition-colors">
                Services
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Tiers
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Use
              </a>
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
