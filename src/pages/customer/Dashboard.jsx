import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import BlurText from "../../components/BlurText";
import PageLoader from "../../components/PageLoader";

export default function Dashboard() {
  const [profile, setProfile] = useState({
    fullName: "CUSTOMER",
    tier: "Member",
    points: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [servicesMap, setServicesMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);

  const [isPointLogModalOpen, setIsPointLogModalOpen] = useState(false);
  const [pointLogs, setPointLogs] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  // --- STATE MODAL XE ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    vehicleType: 0,
    brand: "",
    model: "",
    color: "",
  });
  const [editingVehicle, setEditingVehicle] = useState(null);

  // --- STATE MODAL ĐẶT LỊCH (BOOKING) ---
  const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editBookingDate, setEditBookingDate] = useState("");
  const [editBookingTime, setEditBookingTime] = useState("");

  // --- STATE MODAL FEEDBACK (ĐÁNH GIÁ) ---
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackBooking, setFeedbackBooking] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

  // Hàm mở Modal và gọi API lấy lịch sử điểm
  const openPointLogModal = async () => {
    setIsPointLogModalOpen(true);
    setLoadingPoints(true);
    try {
      const token = localStorage.getItem("token");
      const myUserId = localStorage.getItem("userId");
      const res = await axios.get(
        `https://smart-car-wash-system-be.onrender.com/api/point-logs/customer/${myUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const logs = Array.isArray(res.data) ? res.data : res.data.data || [];
      // Sắp xếp mới nhất lên đầu
      logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPointLogs(logs);
    } catch (error) {
      console.error("Lỗi lấy lịch sử điểm:", error);
    } finally {
      setLoadingPoints(false);
    }
  };

  const getVehicleTypeName = (typeCode) => {
    const types = {
      0: "Sedan",
      1: "SUV",
      2: "Coupe",
      3: "Hatchback",
      4: "Pickup",
    };
    return types[typeCode] || "Car";
  };

  const getBookingStatusName = (statusCode) => {
    const statuses = {
      0: "Pending",
      1: "Confirmed",
      2: "In Progress",
      3: "Completed",
      4: "Cancelled",
    };
    return statuses[statusCode] || "Unknown";
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const myUserId = localStorage.getItem("userId");
        const myEmail = localStorage.getItem("email");

        if (!myUserId) return;

        const headers = { Authorization: `Bearer ${token}` };

        // 1. GỌI SONG SONG 5 API ĐỘC LẬP CHẠY TRƯỚC
        const [profileRes, vehiclesRes, countRes, historyRes, washesRes] =
          await Promise.all([
            axios
              .get(
                `https://smart-car-wash-system-be.onrender.com/api/customer-profiles/${myUserId}`,
                { headers },
              )
              .catch(() => null),
            axios
              .get(
                `https://smart-car-wash-system-be.onrender.com/api/vehicles/customer/${myUserId}`,
                { headers },
              )
              .catch(() => null),
            axios
              .get(
                `https://smart-car-wash-system-be.onrender.com/api/vehicles/count/customer/${myUserId}`,
                { headers },
              )
              .catch(() => null),
            axios
              .get(
                `https://smart-car-wash-system-be.onrender.com/api/bookings/customer/${myUserId}`,
                { headers },
              )
              .catch(() => null),
            axios
              .get(`https://smart-car-wash-system-be.onrender.com/api/washes`, {
                headers,
              })
              .catch(() => null),
          ]);

        let displayName = "CUSTOMER";
        if (myEmail) displayName = myEmail.split("@")[0].toUpperCase();

        let finalTierName = "Member"; // Fallback mặc định nếu API Tier lỗi

        // 2. LUỒNG KIỂM TRA TIER THÔNG MINH: Có currentTierId mới gọi chi tiết
        if (profileRes?.data?.currentTierId) {
          const myTierId = profileRes.data.currentTierId;
          // Gọi API Get Tier By ID, bọc catch riêng để lỡ dính lỗi 401 phân quyền của BE thì web không bị sập
          const tierDetailRes = await axios
            .get(
              `https://smart-car-wash-system-be.onrender.com/api/tiers/${myTierId}`,
              { headers },
            )
            .catch((err) => {
              console.error(
                "API TierId bị lỗi 401/404, dùng tên mặc định!",
                err,
              );
              return null;
            });

          if (tierDetailRes?.data?.name) {
            finalTierName = tierDetailRes.data.name.toUpperCase();
          }
        }

        if (profileRes?.data) {
          setProfile({
            fullName: displayName,
            points: profileRes.data.availablePoints || 0,
            tier: finalTierName,
          });
        }

        if (vehiclesRes?.data) {
          const cars = Array.isArray(vehiclesRes.data)
            ? vehiclesRes.data
            : vehiclesRes.data.data || [];
          setVehicles(cars);
        }

        if (countRes && countRes.data !== undefined) {
          setVehicleCount(countRes.data);
        }

        // Tạo từ điển dịch vụ để dịch mã ID ra Tên chữ tiếng Việt
        const tempServicesMap = {};
        if (washesRes?.data) {
          const washes = Array.isArray(washesRes.data)
            ? washesRes.data
            : washesRes.data.data || [];
          washes.forEach((w) => {
            tempServicesMap[w.id] = w.name;
          });
          setServicesMap(tempServicesMap);
        }

        if (historyRes?.data) {
          const bookings = Array.isArray(historyRes.data)
            ? historyRes.data
            : historyRes.data.data || [];
          bookings.sort(
            (a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime),
          );
          setHistory(bookings);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin tổng quát Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadTick]);

  // ================= CÁC HÀM XỬ LÝ XE =================
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const customerId = localStorage.getItem("userId");
      const payload = {
        ...newVehicle,
        customerId,
        vehicleType: Number(newVehicle.vehicleType),
      };
      await axios.post(
        "https://smart-car-wash-system-be.onrender.com/api/vehicle",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsAddModalOpen(false);
      setNewVehicle({
        licensePlate: "",
        vehicleType: 0,
        brand: "",
        model: "",
        color: "",
      });
      setReloadTick((prev) => prev + 1);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Thêm xe thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const customerId = localStorage.getItem("userId");
      const payload = {
        ...editingVehicle,
        customerId,
        vehicleType: Number(editingVehicle.vehicleType),
        isActive: true,
      };
      await axios.patch(
        `https://smart-car-wash-system-be.onrender.com/api/vehicle/${editingVehicle.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditModalOpen(false);
      setEditingVehicle(null);
      setReloadTick((prev) => prev + 1);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Cập nhật xe thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= CÁC HÀM XỬ LÝ LỊCH ĐẶT (BOOKING) =================
  const openEditBookingModal = (booking) => {
    setEditingBooking(booking);
    if (booking.scheduledTime) {
      const dateObj = new Date(booking.scheduledTime);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      setEditBookingDate(`${year}-${month}-${day}`);

      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      setEditBookingTime(`${hours}:${minutes}`);
    }
    setIsEditBookingModalOpen(true);
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const combinedDateTime = new Date(
        `${editBookingDate}T${editBookingTime}:00`,
      ).toISOString();
      const payload = { ...editingBooking, scheduledTime: combinedDateTime };

      await axios.patch(
        `https://smart-car-wash-system-be.onrender.com/api/booking/${editingBooking.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setIsEditBookingModalOpen(false);
      setEditingBooking(null);
      setReloadTick((prev) => prev + 1);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Cập nhật lịch thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch đặt này không?"))
      return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://smart-car-wash-system-be.onrender.com/api/booking/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setReloadTick((prev) => prev + 1);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Hủy lịch thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= CÁC HÀM XỬ LÝ FEEDBACK =================
  const openFeedbackModal = (booking) => {
    setFeedbackBooking(booking);
    setFeedbackRating(5);
    setFeedbackComment("");
    setIsFeedbackModalOpen(true);
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const customerId = localStorage.getItem("userId");
      const payload = {
        bookingId: feedbackBooking.id,
        customerId: customerId,
        rating: Number(feedbackRating),
        comment: feedbackComment,
      };

      await axios.post(
        "https://smart-car-wash-system-be.onrender.com/api/feedback",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Cảm ơn ông đã gửi đánh giá dịch vụ cho tụi tui! 🥰");
      setIsFeedbackModalOpen(false);
      setFeedbackBooking(null);
      setReloadTick((prev) => prev + 1);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Gửi đánh giá thất bại rồi ông ơi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}

      <div className="min-h-screen bg-[#050505] text-white pt-24 px-6 md:px-12 font-sans relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <BlurText
                text={`HELLO, ${profile.fullName}`}
                delay={40}
                animateBy="letters"
                direction="top"
                className="text-4xl font-black tracking-tighter"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={openPointLogModal}
                className="text-teal-500 font-mono text-sm tracking-widest mt-1 cursor-pointer hover:text-white transition-colors flex items-center gap-2 w-max"
              >
                <span>
                  [{profile.tier}] - {profile.points} PTS
                </span>
                <span className="text-[10px] bg-teal-500/20 px-2 py-0.5 rounded-full text-teal-300">
                  HISTORY
                </span>
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Link
                to="/booking"
                className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-400 transition-colors shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)]"
              >
                + NEW BOOKING
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                <BlurText
                  text="My Garage"
                  delay={80}
                  animateBy="words"
                  className="text-xl font-bold inline-block"
                />
                {!loading && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full"
                  >
                    {vehicleCount} VEHICLES
                  </motion.span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!loading && vehicles.length === 0 ? (
                  <div className="text-slate-500 text-sm p-4 italic">
                    Chưa có xe nào trong gara.
                  </div>
                ) : (
                  vehicles.map((v, index) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="group bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-teal-500/30 transition-all relative"
                    >
                      <button
                        onClick={() => openEditModal(v)}
                        className="absolute top-4 right-4 text-[10px] uppercase font-bold text-slate-500 hover:text-teal-400 bg-white/5 hover:bg-teal-500/10 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        EDIT
                      </button>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-mono text-slate-500">
                          {getVehicleTypeName(v.vehicleType)}
                        </span>
                        <span className="text-[10px] uppercase px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 mr-14 group-hover:mr-16 transition-all">
                          NEEDS WASH
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{v.licensePlate}</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        {v.brand} {v.model}
                      </p>
                      <p className="text-slate-600 text-[11px] mt-2 italic capitalize">
                        {v.color}
                      </p>
                    </motion.div>
                  ))
                )}
                {!loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: vehicles.length * 0.1,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:border-teal-500 hover:bg-teal-900/10 transition-all cursor-pointer min-h-[160px]"
                  >
                    + Add Vehicle
                  </motion.div>
                )}
              </div>
            </div>

            {/* KHU VỰC LỊCH SỬ RECENT WASH */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <BlurText
                  text="Recent Wash"
                  delay={80}
                  animateBy="words"
                  className="text-xl font-bold inline-block"
                />
              </div>
              <div className="space-y-3">
                {!loading && history.length === 0 ? (
                  <div className="text-slate-500 text-sm p-4 italic">
                    Chưa có lịch sử đặt rửa xe.
                  </div>
                ) : (
                  history.map((h, index) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      className="group bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex flex-col gap-2 relative"
                    >
                      {/* NÚT EDIT/CANCEL CHO LỊCH CHƯA RỬA (PENDING / CONFIRMED) */}
                      {(h.status === 0 || h.status === 1) && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                          <button
                            onClick={() => openEditBookingModal(h)}
                            className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 px-2 py-1 rounded-md transition-all"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleCancelBooking(h.id)}
                            disabled={isSubmitting}
                            className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded-md transition-all disabled:opacity-50"
                          >
                            CANCEL
                          </button>
                        </div>
                      )}

                      {/* NÚT RATE US CHO LỊCH ĐÃ HOÀN THÀNH (COMPLETED) */}
                      {h.status === 3 && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                          <button
                            onClick={() => openFeedbackModal(h)}
                            className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded-md transition-all"
                          >
                            RATE US
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-start mt-1">
                        <div>
                          <p className="font-bold text-sm text-white">
                            {servicesMap[h.serviceId] || "Car Wash Service"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDateTime(h.scheduledTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-1">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                            h.status === 3
                              ? "bg-emerald-500/20 text-emerald-400"
                              : h.status === 4
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {getBookingStatusName(h.status)}
                        </span>
                        <span className="text-teal-400 font-mono text-sm">
                          ${h.finalAmount || 0}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL ADD XE */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black mb-6">ADD NEW VEHICLE</h2>
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    License Plate
                  </label>
                  <input
                    required
                    name="licensePlate"
                    value={newVehicle.licensePlate}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        licensePlate: e.target.value,
                      })
                    }
                    placeholder="VD: 51H-123.45"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Brand
                    </label>
                    <input
                      required
                      name="brand"
                      value={newVehicle.brand}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, brand: e.target.value })
                      }
                      placeholder="Porsche"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Model
                    </label>
                    <input
                      required
                      name="model"
                      value={newVehicle.model}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, model: e.target.value })
                      }
                      placeholder="911"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Color
                    </label>
                    <input
                      required
                      name="color"
                      value={newVehicle.color}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, color: e.target.value })
                      }
                      placeholder="Black"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Type
                    </label>
                    <select
                      name="vehicleType"
                      value={newVehicle.vehicleType}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          vehicleType: e.target.value,
                        })
                      }
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500 appearance-none text-white"
                    >
                      <option value={0}>Sedan</option>
                      <option value={1}>SUV</option>
                      <option value={2}>Coupe</option>
                      <option value={3}>Hatchback</option>
                      <option value={4}>Pickup</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-500 text-black font-bold py-4 rounded-xl mt-4 hover:bg-teal-400 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "SAVING..." : "CONFIRM & ADD"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL EDIT XE */}
        {isEditModalOpen && editingVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingVehicle(null);
                }}
                className="absolute top-6 right-6 text-slate-500 hover:text-white text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black mb-6">EDIT VEHICLE</h2>
              <form onSubmit={handleUpdateVehicle} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    License Plate
                  </label>
                  <input
                    required
                    name="licensePlate"
                    value={editingVehicle.licensePlate}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        licensePlate: e.target.value,
                      })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Brand
                    </label>
                    <input
                      required
                      name="brand"
                      value={editingVehicle.brand}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          brand: e.target.value,
                        })
                      }
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Model
                    </label>
                    <input
                      required
                      name="model"
                      value={editingVehicle.model}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          model: e.target.value,
                        })
                      }
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Color
                    </label>
                    <input
                      required
                      name="color"
                      value={editingVehicle.color}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          color: e.target.value,
                        })
                      }
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Type
                    </label>
                    <select
                      name="vehicleType"
                      value={editingVehicle.vehicleType}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          vehicleType: e.target.value,
                        })
                      }
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal-500 appearance-none text-white"
                    >
                      <option value={0}>Sedan</option>
                      <option value={1}>SUV</option>
                      <option value={2}>Coupe</option>
                      <option value={3}>Hatchback</option>
                      <option value={4}>Pickup</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "UPDATING..." : "SAVE CHANGES"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL EDIT LỊCH ĐẶT (RESCHEDULE) */}
        {isEditBookingModalOpen && editingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsEditBookingModalOpen(false);
                  setEditingBooking(null);
                }}
                className="absolute top-6 right-6 text-slate-500 hover:text-white text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black mb-6">RESCHEDULE WASH</h2>

              <div className="mb-6 p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
                <p className="text-xs text-teal-400 font-bold uppercase tracking-wider mb-1">
                  Service
                </p>
                <p className="text-white text-sm">
                  {servicesMap[editingBooking.serviceId] || "Car Wash Service"}
                </p>
              </div>

              <form onSubmit={handleUpdateBooking} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    New Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editBookingDate}
                    onChange={(e) => setEditBookingDate(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    New Time
                  </label>
                  <input
                    type="time"
                    required
                    value={editBookingTime}
                    onChange={(e) => setEditBookingTime(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 [color-scheme:dark]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "UPDATING..." : "SAVE SCHEDULE"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL GỬI FEEDBACK */}
        {isFeedbackModalOpen && feedbackBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsFeedbackModalOpen(false);
                  setFeedbackBooking(null);
                }}
                className="absolute top-6 right-6 text-slate-500 hover:text-white text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black mb-2 text-indigo-400">
                RATE YOUR WASH
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Bạn cảm thấy dịch vụ{" "}
                <strong className="text-white">
                  {servicesMap[feedbackBooking.serviceId]}
                </strong>{" "}
                thế nào?
              </p>

              <form onSubmit={handleSendFeedback} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Rating (1-5)
                  </label>
                  <div className="flex gap-2 justify-between">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFeedbackRating(num)}
                        className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                          feedbackRating === num
                            ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            : "bg-[#111] text-slate-500 hover:bg-white/10"
                        }`}
                      >
                        {num}★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 mt-4">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Your Comment
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Dịch vụ tuyệt vời, nhân viên nhiệt tình..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-500 text-white font-bold py-4 rounded-xl mt-4 hover:bg-indigo-400 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "SENDING..." : "SUBMIT FEEDBACK"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL LỊCH SỬ ĐIỂM (POINT LOGS) */}
        {isPointLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative max-h-[80vh] flex flex-col"
            >
              <button
                onClick={() => setIsPointLogModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black mb-2 text-teal-400">
                POINT HISTORY
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Lịch sử tích lũy và sử dụng điểm của bạn.
              </p>

              <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {loadingPoints ? (
                  <p className="text-center text-slate-500 text-sm py-4">
                    Đang tải dữ liệu...
                  </p>
                ) : pointLogs.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-4 italic">
                    Chưa có giao dịch điểm nào.
                  </p>
                ) : (
                  pointLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex justify-between items-center bg-[#111] border border-white/5 p-4 rounded-xl"
                    >
                      <div>
                        <p className="font-bold text-sm text-white">
                          {log.note || "Giao dịch điểm"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDateTime(log.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-mono font-bold text-lg ${log.pointsChanged > 0 ? "text-emerald-400" : "text-rose-400"}`}
                        >
                          {log.pointsChanged > 0 ? "+" : ""}
                          {log.pointsChanged}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Balance: {log.balanceAfter}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
