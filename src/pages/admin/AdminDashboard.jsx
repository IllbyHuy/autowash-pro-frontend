import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import PageLoader from "../../components/PageLoader";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);
  const navigate = useNavigate();

  // TABS NGANG BÊN TRONG SYSTEM STATS
  const [activeTab, setActiveTab] = useState("bookings"); // 'bookings', 'services', 'promotions', 'feedbacks'

  // DATA STATE
  const [allBookings, setAllBookings] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allPromotions, setAllPromotions] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [allTiers, setAllTiers] = useState([]);

  const [servicesMap, setServicesMap] = useState({});
  const [processingId, setProcessingId] = useState(null);

  // --- STATE FOR MODALS ---
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    id: null,
    name: "",
    description: "",
    basePrice: 0,
    estimatedDurationMinutes: 30,
    pointsPerTransaction: 10,
    isActive: true,
  });

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    id: null,
    promoName: "",
    description: "",
    minTierId: "",
    discountAmount: 0,
    discountPercent: 0,
    validFrom: "",
    validTo: "",
    isActive: true,
  });

  const STATUSES = {
    0: {
      name: "Pending",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    1: {
      name: "Confirmed",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    2: {
      name: "In Progress",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    3: {
      name: "Completed",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    4: {
      name: "Cancelled",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        const headers = { Authorization: `Bearer ${token}` };

        // BỎ GET USERS Ở ĐÂY CHO NHẸ
        const [bookingsRes, washesRes, feedbacksRes, promosRes, tiersRes] =
          await Promise.all([
            axios
              .get(
                `https://smart-car-wash-system-be.onrender.com/api/bookings`,
                { headers },
              )
              .catch(() => null),
            axios
              .get(`https://smart-car-wash-system-be.onrender.com/api/washes`, {
                headers,
              })
              .catch(() => null),
            axios
              .get(
                `https://smart-car-wash-system-be.onrender.com/api/feedbacks`,
                { headers },
              )
              .catch(() => null),
            axios
              .get(
                `https://smart-car-wash-system-be.onrender.com/api/promotions`,
                { headers },
              )
              .catch(() => null),
            axios
              .get(`https://smart-car-wash-system-be.onrender.com/api/tiers`, {
                headers,
              })
              .catch(() => null),
          ]);

        if (washesRes?.data) {
          const washes = Array.isArray(washesRes.data)
            ? washesRes.data
            : washesRes.data.data || [];
          setAllServices(washes);
          const tempMap = {};
          washes.forEach((w) => {
            tempMap[w.id] = w.name;
          });
          setServicesMap(tempMap);
        }

        if (bookingsRes?.data) {
          let bookings = Array.isArray(bookingsRes.data)
            ? bookingsRes.data
            : bookingsRes.data.data || [];
          bookings.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setAllBookings(bookings);
        }

        if (feedbacksRes?.data) {
          let fbs = Array.isArray(feedbacksRes.data)
            ? feedbacksRes.data
            : feedbacksRes.data.data || [];
          fbs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAllFeedbacks(fbs);
        }

        if (promosRes?.data) {
          let promos = Array.isArray(promosRes.data)
            ? promosRes.data
            : promosRes.data.data || [];
          setAllPromotions(promos);
        }

        if (tiersRes?.data) {
          let tiers = Array.isArray(tiersRes.data)
            ? tiersRes.data
            : tiersRes.data.data || [];
          setAllTiers(tiers);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [reloadTick, navigate]);

  // ================= ACTIONS =================
  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Xác nhận đổi trạng thái đơn?`)) return;
    setProcessingId(bookingId);
    try {
      const token = localStorage.getItem("token");
      const currentBooking = allBookings.find((b) => b.id === bookingId);
      const payload = { ...currentBooking, status: Number(newStatus) };
      await axios.patch(
        `https://smart-car-wash-system-be.onrender.com/api/booking/${bookingId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (Number(newStatus) === 3)
        alert("Đã chốt đơn! Khách hàng đã được cộng điểm.");
      setReloadTick((prev) => prev + 1);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi cập nhật!");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...serviceForm,
        basePrice: Number(serviceForm.basePrice),
        estimatedDurationMinutes: Number(serviceForm.estimatedDurationMinutes),
        pointsPerTransaction: Number(serviceForm.pointsPerTransaction),
      };

      if (serviceForm.id) {
        await axios.put(
          `https://smart-car-wash-system-be.onrender.com/api/washes/${serviceForm.id}`,
          payload,
          { headers },
        );
      } else {
        await axios.post(
          `https://smart-car-wash-system-be.onrender.com/api/washes`,
          payload,
          { headers },
        );
      }
      setIsServiceModalOpen(false);
      setReloadTick((prev) => prev + 1);
      alert("Lưu dịch vụ thành công!");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lưu thất bại!");
    }
  };

  const handleSavePromo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...promoForm,
        discountAmount: Number(promoForm.discountAmount),
        discountPercent: Number(promoForm.discountPercent),
        validFrom: new Date(promoForm.validFrom).toISOString(),
        validTo: new Date(promoForm.validTo).toISOString(),
        promoType: 0,
        pointsCost: 0,
        maxUsesTotal: 1000,
        maxUsesPerCustomer: 1,
      };

      if (promoForm.id) {
        await axios.patch(
          `https://smart-car-wash-system-be.onrender.com/api/promotion/${promoForm.id}`,
          payload,
          { headers },
        );
      } else {
        await axios.post(
          `https://smart-car-wash-system-be.onrender.com/api/promotion`,
          payload,
          { headers },
        );
      }
      setIsPromoModalOpen(false);
      setReloadTick((prev) => prev + 1);
      alert("Lưu mã khuyến mãi thành công!");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lưu thất bại!");
    }
  };

  const handleExitAdmin = () => {
    localStorage.clear(); // Xóa sạch sành sanh token, role, email...
    window.dispatchEvent(new Event("storage")); // Báo động cho toàn app (như Header) cập nhật lại trạng thái
    navigate("/login"); // Dùng navigate đá thẳng về trang login luôn
  };

  return (
    <>
      {loading && <PageLoader />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto pb-20"
      >
        {/* HEADER TABS CON */}
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-indigo-500 uppercase">
              System Overview
            </h2>
            <p className="text-slate-500 font-mono text-sm tracking-widest mt-1">
              MANAGEMENT DASHBOARD
            </p>
          </div>
          <div>
            <button
              onClick={handleExitAdmin}
              className="text-sm font-bold text-slate-500 hover:text-white transition-colors bg-[#111] px-4 py-2 rounded-lg cursor-pointer"
            >
              ← Exit Admin (Log Out)
            </button>
          </div>
        </div>

        {/* 4 MENU TABS NGANG */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          {["bookings", "services", "promotions", "feedbacks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-bold tracking-widest text-xs uppercase px-4 py-2 transition-all whitespace-nowrap ${activeTab === tab ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-300"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* NỘI DUNG TỪNG TAB CON */}
        {activeTab === "bookings" && (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#111] border-b border-white/10 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="p-4 pl-6">ID Đơn</th>
                  <th className="p-4">Dịch vụ</th>
                  <th className="p-4">Giờ hẹn</th>
                  <th className="p-4">Giá tiền</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-500">
                      {b.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 font-bold">
                      {servicesMap[b.serviceId] || "Unknown Service"}
                    </td>
                    <td className="p-4 text-slate-400">
                      {formatDateTime(b.scheduledTime)}
                    </td>
                    <td className="p-4 text-teal-400 font-mono font-bold">
                      ${b.finalAmount || b.baseAmount || 0}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${STATUSES[b.status]?.color}`}
                      >
                        {STATUSES[b.status]?.name}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={b.status}
                        disabled={processingId === b.id}
                        onChange={(e) =>
                          handleUpdateStatus(b.id, e.target.value)
                        }
                        className="bg-[#111] border border-white/10 text-white rounded-lg px-3 py-2 outline-none text-xs font-bold uppercase"
                      >
                        <option value={0}>PENDING</option>
                        <option value={1}>CONFIRMED</option>
                        <option value={2}>IN PROGRESS</option>
                        <option value={3}>COMPLETED</option>
                        <option value={4}>CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setServiceForm({
                    id: null,
                    name: "",
                    description: "",
                    basePrice: 0,
                    estimatedDurationMinutes: 30,
                    pointsPerTransaction: 10,
                    isActive: true,
                  });
                  setIsServiceModalOpen(true);
                }}
                className="bg-indigo-500 text-white font-bold px-6 py-2 rounded-lg text-sm hover:bg-indigo-400"
              >
                + Add New Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allServices.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-[#111] border border-white/10 p-6 rounded-2xl relative group"
                >
                  <button
                    onClick={() => {
                      setServiceForm(svc);
                      setIsServiceModalOpen(true);
                    }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all text-[10px] bg-white/10 px-2 py-1 rounded text-white hover:bg-indigo-500"
                  >
                    EDIT
                  </button>
                  <h3 className="text-xl font-bold mb-1">{svc.name}</h3>
                  <p className="text-teal-400 font-mono font-bold mb-4">
                    {svc.basePrice?.toLocaleString("vi-VN")} VND
                  </p>
                  <p className="text-sm text-slate-400 mb-4">
                    {svc.description}
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-white/5 text-slate-300 px-2 py-1 rounded">
                      ⏱ {svc.estimatedDurationMinutes}m
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded">
                      ★ +{svc.pointsPerTransaction} PTS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "promotions" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setPromoForm({
                    id: null,
                    promoName: "",
                    description: "",
                    minTierId: allTiers[0]?.id || "",
                    discountAmount: 0,
                    discountPercent: 0,
                    validFrom: "",
                    validTo: "",
                    isActive: true,
                  });
                  setIsPromoModalOpen(true);
                }}
                className="bg-amber-500 text-black font-bold px-6 py-2 rounded-lg text-sm hover:bg-amber-400"
              >
                + Add Promotion Code
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allPromotions.map((p) => (
                <div
                  key={p.id}
                  className={`border p-6 rounded-2xl relative group ${p.isActive ? "bg-[#111] border-white/10" : "bg-red-900/10 border-red-500/20 opacity-50"}`}
                >
                  <button
                    onClick={() => {
                      setPromoForm({
                        ...p,
                        validFrom: p.validFrom.substring(0, 16),
                        validTo: p.validTo.substring(0, 16),
                      });
                      setIsPromoModalOpen(true);
                    }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all text-[10px] bg-white/10 px-2 py-1 rounded text-white hover:bg-amber-500"
                  >
                    EDIT
                  </button>
                  <h3 className="text-xl font-bold mb-1 text-amber-400 uppercase">
                    {p.promoName}
                  </h3>
                  <p className="text-white font-bold mb-2">
                    Giảm{" "}
                    {p.discountPercent > 0
                      ? `${p.discountPercent}%`
                      : `${p.discountAmount?.toLocaleString("vi-VN")}đ`}
                  </p>
                  <p className="text-sm text-slate-400 mb-4">{p.description}</p>
                  <p className="text-[10px] text-slate-500">
                    Hạn: {formatDateTime(p.validTo)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "feedbacks" && (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#111] border-b border-white/10 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="p-4 pl-6">Thời gian</th>
                  <th className="p-4">Khách hàng ID</th>
                  <th className="p-4">Sao</th>
                  <th className="p-4">Nội dung Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allFeedbacks.map((f) => (
                  <tr key={f.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-6 text-slate-400">
                      {formatDateTime(f.createdAt)}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {f.customerId.substring(0, 8)}...
                    </td>
                    <td className="p-4 font-bold text-amber-400">
                      {f.rating} ★
                    </td>
                    <td className="p-4 text-white italic">"{f.comment}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ================= ĐỐNG MODALS DÙNG CHUNG Ở DƯỚI CÙNG ================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsServiceModalOpen(false)}
              className="absolute top-6 right-6 text-slate-500"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black mb-6 text-indigo-400">
              {serviceForm.id ? "EDIT SERVICE" : "NEW SERVICE"}
            </h2>
            <form onSubmit={handleSaveService} className="space-y-4">
              <input
                required
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
                }
                placeholder="Tên dịch vụ..."
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none"
              />
              <textarea
                required
                value={serviceForm.description}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    description: e.target.value,
                  })
                }
                placeholder="Mô tả..."
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none"
                rows="3"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500">
                    Giá (VND)
                  </label>
                  <input
                    type="number"
                    required
                    value={serviceForm.basePrice}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        basePrice: e.target.value,
                      })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">
                    Thời gian (Phút)
                  </label>
                  <input
                    type="number"
                    required
                    value={serviceForm.estimatedDurationMinutes}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        estimatedDurationMinutes: e.target.value,
                      })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500">
                  Điểm thưởng (PTS)
                </label>
                <input
                  type="number"
                  required
                  value={serviceForm.pointsPerTransaction}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      pointsPerTransaction: e.target.value,
                    })
                  }
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl mt-4"
              >
                SAVE
              </button>
            </form>
          </div>
        </div>
      )}

      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsPromoModalOpen(false)}
              className="absolute top-6 right-6 text-slate-500"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black mb-6 text-amber-400">
              {promoForm.id ? "EDIT PROMO" : "NEW PROMO"}
            </h2>
            <form onSubmit={handleSavePromo} className="space-y-4">
              <input
                required
                value={promoForm.promoName}
                onChange={(e) =>
                  setPromoForm({ ...promoForm, promoName: e.target.value })
                }
                placeholder="Mã (Vd: CHAOHE20)"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none uppercase font-bold text-amber-400"
              />
              <input
                required
                value={promoForm.description}
                onChange={(e) =>
                  setPromoForm({ ...promoForm, description: e.target.value })
                }
                placeholder="Mô tả..."
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500">Giảm %</label>
                  <input
                    type="number"
                    value={promoForm.discountPercent}
                    onChange={(e) =>
                      setPromoForm({
                        ...promoForm,
                        discountPercent: e.target.value,
                      })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">
                    Giảm Tiền
                  </label>
                  <input
                    type="number"
                    value={promoForm.discountAmount}
                    onChange={(e) =>
                      setPromoForm({
                        ...promoForm,
                        discountAmount: e.target.value,
                      })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500">Từ ngày</label>
                  <input
                    type="datetime-local"
                    required
                    value={promoForm.validFrom}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, validFrom: e.target.value })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Đến ngày</label>
                  <input
                    type="datetime-local"
                    required
                    value={promoForm.validTo}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, validTo: e.target.value })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500">
                  Hạng Tối Thiểu (Min Tier)
                </label>
                <select
                  value={promoForm.minTierId}
                  onChange={(e) =>
                    setPromoForm({ ...promoForm, minTierId: e.target.value })
                  }
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none text-white"
                >
                  {allTiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl mt-4"
              >
                SAVE PROMO
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
