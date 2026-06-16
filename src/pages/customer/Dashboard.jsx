import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Dashboard() {
  const [profile, setProfile] = useState({
    fullName: "CUSTOMER", 
    tier: "Standard",
    points: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const myUserId = localStorage.getItem("userId");
        const myEmail = localStorage.getItem("email");

        if (!myUserId) return;

        // Xử lý lấy Tên từ Email (dokhanhhuy01@... -> DOKHANHHUY01)
        let displayName = "CUSTOMER";
        if (myEmail) {
          displayName = myEmail.split('@')[0].toUpperCase();
        }

        // Gọi API Customer Profiles bằng ID
        const headers = { Authorization: `Bearer ${token}` };
        const profileResponse = await axios.get(
          `https://smart-car-wash-system-be.onrender.com/api/customer-profiles/${myUserId}`, 
          { headers }
        );

        let points = 0;
        let tierId = "Standard";
        
        if (profileResponse.data) {
          points = profileResponse.data.availablePoints || 0;
          tierId = profileResponse.data.currentTierId ? "Member" : "Standard";
        }

        setProfile({
          fullName: displayName,
          points: points,
          tier: tierId
        });

      } catch (error) {
        console.error("Lỗi lấy thông tin Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data mô phỏng DB cho phần Xe và Lịch sử
  const vehicles = [
    { id: 1, plate: "51H-123.45", model: "Porsche 911", type: "Coupe", status: "Clean" },
    { id: 2, plate: "51K-678.90", model: "Mercedes G63", type: "SUV", status: "Needs Wash" }
  ];
  
  const history = [
    { id: 1, date: "15/05/2026", service: "Premium Detailing", total: "$49", status: "Completed" },
    { id: 2, date: "02/05/2026", service: "Express Wash", total: "$15", status: "Completed" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-6 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">HELLO, {profile.fullName}</h1>
            <p className="text-teal-500 font-mono text-sm tracking-widest mt-1">
              [{loading ? "..." : profile.tier}] - {loading ? "..." : profile.points} PTS
            </p>
          </div>
          <Link to="/booking" className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-400 transition-colors">
            + NEW BOOKING
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cột 1: Danh sách Xe (Vehicle) */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">My Garage</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map(v => (
                <div key={v.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-teal-500/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-slate-500">{v.type}</span>
                    <span className={`text-[10px] uppercase px-2 py-1 rounded-full ${v.status === 'Clean' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {v.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{v.plate}</h3>
                  <p className="text-slate-400 text-sm mt-1">{v.model}</p>
                </div>
              ))}
              
              {/* Nút Add Vehicle */}
              <div className="border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:border-white/30 transition-all cursor-pointer min-h-[160px]">
                + Add Vehicle
              </div>
            </div>
          </div>

          {/* Cột 2: Lịch sử Bookings */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">Recent Wash</h2>
            <div className="space-y-3">
              {history.map(h => (
                <div key={h.id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{h.service}</p>
                    <p className="text-xs text-slate-500 mt-1">{h.date}</p>
                  </div>
                  <span className="text-teal-400 font-mono text-sm">{h.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}