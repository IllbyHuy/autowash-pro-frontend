import { useState } from "react";
import { Link } from "react-router-dom";

export default function Booking() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { id: 1, name: "Express Wash", desc: "Nhanh gọn, bọt tuyết tiêu chuẩn.", price: "$15", duration: "15 min" },
    { id: 2, name: "Pro Detailing", desc: "Hút bụi, dưỡng nội thất, phủ wax.", price: "$49", duration: "45 min", popular: true },
    { id: 3, name: "Ceramic Shield", desc: "Phủ bóng pha lê công nghệ cao.", price: "$199", duration: "120 min" }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-24 px-6 md:px-12 font-sans relative overflow-hidden">
      {/* Vệt sáng trang trí */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-900/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/dashboard" className="text-slate-500 text-sm hover:text-white mb-8 inline-block">‹ Back to Dashboard</Link>
        
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Select Wash Service</h1>
        <p className="text-slate-400 text-sm mb-10">Choose a package for your vehicle.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {services.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedService(s.id)}
              className={`relative p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedService === s.id ? 'bg-[#111] border-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.15)]' : 'bg-[#050505] border-white/10 hover:border-white/30'
              }`}
            >
              {s.popular && <span className="absolute -top-3 left-6 bg-teal-500 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase">Most Popular</span>}
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-slate-500">{s.duration}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{s.name}</h3>
              <p className="text-slate-400 text-xs mb-6 h-8">{s.desc}</p>
              <div className="text-2xl font-black text-white">{s.price}</div>
            </div>
          ))}
        </div>

        {/* Khối xác nhận (Sẽ nối API bảng Booking sau) */}
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="font-bold text-lg">Apply Promotion</h4>
            <p className="text-xs text-slate-400">Available: Welcome 20% OFF (Tier Benefit)</p>
          </div>
          <button 
            disabled={!selectedService}
            className={`px-10 py-4 rounded-xl font-bold text-sm transition-all ${
              selectedService ? 'bg-white text-black hover:bg-teal-400' : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            CONFIRM BOOKING
          </button>
        </div>
      </div>
    </div>
  );
}