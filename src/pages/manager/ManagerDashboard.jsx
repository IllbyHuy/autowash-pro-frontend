import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from "recharts";
import { format, subDays, startOfDay, endOfDay, isWithinInterval, startOfMonth, endOfMonth, subMonths } from "date-fns";
import PageLoader from "../../components/PageLoader";

export default function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [users, setUsers] = useState([]); // Chứa dữ liệu user mới
  const [loading, setLoading] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);
  const [processingId, setProcessingId] = useState(null);

  // Bộ lọc thời gian có thêm QUÝ
  const [timeFilter, setTimeFilter] = useState("30days");

  const STATUSES = {
    0: { name: "Pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    1: { name: "Confirmed", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    2: { name: "In Progress", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    3: { name: "Completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    4: { name: "Cancelled", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  };

  const PIE_COLORS = {
    completed: "#2dd4bf", // Teal
    cancelled: "#f43f5e", // Rose
    pending: "#fbbf24"    // Amber
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const fetchManagerData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // GỌI THÊM API USERS ĐỂ ĐẾM ACCOUNT MỚI
        const [bookingsRes, washesRes, usersRes] = await Promise.all([
          axios.get(`https://smart-car-wash-system-be.onrender.com/api/bookings`, { headers }).catch(() => null),
          axios.get(`https://smart-car-wash-system-be.onrender.com/api/washes`, { headers }).catch(() => null),
          axios.get(`https://smart-car-wash-system-be.onrender.com/api/users`, { headers }).catch(() => null),
        ]);

        if (washesRes?.data) {
          const washes = Array.isArray(washesRes.data) ? washesRes.data : washesRes.data.data || [];
          const tempMap = {};
          washes.forEach(w => { tempMap[w.id] = w.name; });
          setServicesMap(tempMap);
        }

        if (bookingsRes?.data) {
          let data = Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.data || [];
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBookings(data);
        }

        if (usersRes?.data) {
          let uData = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.data || [];
          setUsers(uData);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Manager:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, [reloadTick]);

  // ================= THUẬT TOÁN XỬ LÝ SỐ LIỆU TỔNG HỢP =================
  const dashboardData = useMemo(() => {
    const now = new Date();
    let currentStart, currentEnd, prevStart, prevEnd;

    // 1. Xác định mốc thời gian
    if (timeFilter === "7days") {
      currentStart = startOfDay(subDays(now, 6)); currentEnd = endOfDay(now);
      prevStart = startOfDay(subDays(now, 13)); prevEnd = endOfDay(subDays(now, 7));
    } else if (timeFilter === "30days") {
      currentStart = startOfDay(subDays(now, 29)); currentEnd = endOfDay(now);
      prevStart = startOfDay(subDays(now, 59)); prevEnd = endOfDay(subDays(now, 30));
    } else if (timeFilter === "90days") {
      currentStart = startOfDay(subDays(now, 89)); currentEnd = endOfDay(now);
      prevStart = startOfDay(subDays(now, 179)); prevEnd = endOfDay(subDays(now, 90));
    } else { // 'year'
      currentStart = startOfMonth(subMonths(now, 11)); currentEnd = endOfMonth(now);
      prevStart = startOfMonth(subMonths(now, 23)); prevEnd = endOfMonth(subMonths(now, 12));
    }

    // 2. Khởi tạo mảng Chart Data
    let chartData = [];
    if (timeFilter !== "year") {
      const days = timeFilter === "7days" ? 7 : (timeFilter === "30days" ? 30 : 90);
      // Nếu 90 ngày thì nhóm theo tuần hoặc hiển thị gộp để đỡ rối, nhưng ở đây cứ render đủ ngày, Recharts tự co dãn
      for (let i = days - 1; i >= 0; i--) {
        const d = subDays(now, i);
        chartData.push({
          dateKey: format(d, 'yyyy-MM-dd'),
          displayDate: format(d, 'dd/MM'),
          revenue: 0, cars: 0, newUsers: 0
        });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i);
        chartData.push({
          dateKey: format(d, 'yyyy-MM'),
          displayDate: format(d, 'MM/yyyy'),
          revenue: 0, cars: 0, newUsers: 0
        });
      }
    }

    // 3. Phân tích Bookings & Doanh Thu
    let currentRevenue = 0, prevRevenue = 0;
    let comp = 0, pend = 0, canc = 0;

    bookings.forEach(b => {
      const bDate = new Date(b.scheduledTime || b.createdAt);
      
      if (isWithinInterval(bDate, { start: currentStart, end: currentEnd })) {
        if (b.status === 3) comp++;
        else if (b.status === 4) canc++;
        else pend++; // Pending, Confirmed, In Progress

        if (b.status === 3) {
          const amount = b.finalAmount || b.baseAmount || 0;
          currentRevenue += amount;
          const key = (timeFilter === "year") ? format(bDate, 'yyyy-MM') : format(bDate, 'yyyy-MM-dd');
          const dataPoint = chartData.find(item => item.dateKey === key);
          if (dataPoint) { dataPoint.revenue += amount; dataPoint.cars += 1; }
        }
      } else if (isWithinInterval(bDate, { start: prevStart, end: prevEnd })) {
        if (b.status === 3) {
          prevRevenue += (b.finalAmount || b.baseAmount || 0);
        }
      }
    });

    // 4. Phân tích Users Mới
    let currentUsersCount = 0, prevUsersCount = 0;
    users.forEach(u => {
      // Giả sử có trường createdAt, nếu ko có thì lấy thời điểm hiện tại coi như data mẫu
      const uDate = u.createdAt ? new Date(u.createdAt) : new Date(); 
      if (isWithinInterval(uDate, { start: currentStart, end: currentEnd })) {
        currentUsersCount++;
        const key = (timeFilter === "year") ? format(uDate, 'yyyy-MM') : format(uDate, 'yyyy-MM-dd');
        const dataPoint = chartData.find(item => item.dateKey === key);
        if (dataPoint) dataPoint.newUsers += 1;
      } else if (isWithinInterval(uDate, { start: prevStart, end: prevEnd })) {
        prevUsersCount++;
      }
    });

    // 5. Tính % Tăng trưởng
    const calcGrowth = (curr, prev) => {
      if (prev > 0) return (((curr - prev) / prev) * 100).toFixed(1);
      if (curr > 0) return 100;
      return 0;
    };

    return {
      currentRevenue,
      revenueGrowth: calcGrowth(currentRevenue, prevRevenue),
      currentUsersCount,
      usersGrowth: calcGrowth(currentUsersCount, prevUsersCount),
      comp, pend, canc,
      chartData,
      pieData: [
        { name: "Thành công", value: comp, color: PIE_COLORS.completed },
        { name: "Đã hủy", value: canc, color: PIE_COLORS.cancelled },
        { name: "Đang chờ/Xử lý", value: pend, color: PIE_COLORS.pending },
      ]
    };
  }, [bookings, users, timeFilter]);

  // Cập nhật trạng thái Booking
  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Bạn muốn chuyển trạng thái đơn này?`)) return;
    setProcessingId(bookingId);
    try {
      const token = localStorage.getItem("token");
      const currentBooking = bookings.find(b => b.id === bookingId);
      const payload = { ...currentBooking, status: Number(newStatus) };
      await axios.patch(`https://smart-car-wash-system-be.onrender.com/api/booking/${bookingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setReloadTick(prev => prev + 1);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi cập nhật!");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="max-w-7xl mx-auto pb-20">
        
        {/* HEADER & TIME FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-teal-400 uppercase">Manager Dashboard</h1>
            <p className="text-slate-500 font-mono text-sm tracking-widest mt-1">THEO DÕI & PHÂN TÍCH CHUYÊN SÂU</p>
          </div>
          
          <div className="flex flex-wrap bg-[#111] border border-white/10 p-1 rounded-xl">
            {[
              { id: "7days", label: "7 Ngày" },
              { id: "30days", label: "30 Ngày" },
              { id: "90days", label: "Quý Này (90 Ngày)" },
              { id: "year", label: "Năm Qua" }
            ].map(tf => (
              <button 
                key={tf.id}
                onClick={() => setTimeFilter(tf.id)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  timeFilter === tf.id ? "bg-teal-500 text-black shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-teal-500/10 border border-teal-500/20 p-6 rounded-2xl relative">
            <p className="text-xs font-bold text-teal-500 tracking-widest uppercase mb-2">Total Revenue</p>
            <h3 className="text-3xl font-black text-white">${dashboardData.currentRevenue.toLocaleString('vi-VN')}</h3>
            <div className="mt-4 flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${dashboardData.revenueGrowth >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                {dashboardData.revenueGrowth > 0 ? "↗" : "↘"} {Math.abs(dashboardData.revenueGrowth)}%
              </span>
              <span className="text-[10px] text-slate-500">vs kỳ trước</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111] border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-2">New Accounts</p>
            <h3 className="text-3xl font-black text-white">{dashboardData.currentUsersCount} <span className="text-sm font-normal text-slate-500">Users</span></h3>
            <div className="mt-4 flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${dashboardData.usersGrowth >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                {dashboardData.usersGrowth > 0 ? "↗" : "↘"} {Math.abs(dashboardData.usersGrowth)}%
              </span>
              <span className="text-[10px] text-slate-500">vs kỳ trước</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#111] border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-rose-400 tracking-widest uppercase mb-2">Cancelled Bookings</p>
            <h3 className="text-3xl font-black text-white">{dashboardData.canc} <span className="text-sm font-normal text-slate-500">Cars</span></h3>
            <p className="text-[10px] text-slate-500 mt-4 uppercase">Cần chú ý gọi lại khách</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111] border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-2">Pending / In Progress</p>
            <h3 className="text-3xl font-black text-white">{dashboardData.pend} <span className="text-sm font-normal text-slate-500">Cars</span></h3>
            <p className="text-[10px] text-slate-500 mt-4 uppercase">Đang phục vụ trong xưởng</p>
          </motion.div>
        </div>

        {/* ================= CHARTS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* AREA CHART: DOANH THU */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-sm font-bold mb-6 text-white uppercase tracking-wider">Lưu Lượng Doanh Thu</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#555" tick={{ fill: '#888', fontSize: 10 }} tickMargin={10} axisLine={false} />
                  <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10 }} tickFormatter={(val) => `$${val}`} axisLine={false} width={45} />
                  <Area type="monotone" dataKey="revenue" stroke="#2dd4bf" strokeWidth={3} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* PIE CHART: TỈ LỆ ĐƠN HÀNG */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-1 bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col">
            <h2 className="text-sm font-bold mb-2 text-white uppercase tracking-wider">Tỷ Lệ Đơn Hàng</h2>
            <div className="flex-1 w-full relative min-h-[250px]">
              {dashboardData.comp === 0 && dashboardData.canc === 0 && dashboardData.pend === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs italic">Không có đơn hàng kỳ này</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dashboardData.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                      {dashboardData.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '10px' }} itemStyle={{ fontWeight: 'bold' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* BAR CHART: LƯỢNG NGƯỜI DÙNG MỚI */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-3 bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-sm font-bold mb-6 text-white uppercase tracking-wider">Đăng Ký Tài Khoản Mới</h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#555" tick={{ fill: '#888', fontSize: 10 }} tickMargin={10} axisLine={false} />
                  <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10 }} allowDecimals={false} axisLine={false} width={30}/>
                  <Bar dataKey="newUsers" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={timeFilter === 'year' ? 30 : (timeFilter === '7days' ? 40 : 15)} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* ================= BẢNG QUẢN LÝ ĐƠN HÀNG LIVER ================= */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-bold uppercase tracking-wider">LIVE BOOKING QUEUE</h2>
            <button onClick={() => setReloadTick(prev => prev + 1)} className="text-xs text-teal-400 hover:text-white bg-teal-500/10 px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-2">
              ↻ REFRESH
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#111] border-b border-white/10 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-4 pl-6">ID / Ngày giờ</th>
                  <th className="p-4">Dịch vụ</th>
                  <th className="p-4">Doanh thu</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Cập nhật (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-mono text-xs text-slate-500">{b.id.substring(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-white mt-1">{formatDateTime(b.scheduledTime)}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-200">{servicesMap[b.serviceId] || "Unknown Service"}</td>
                    <td className="p-4 text-teal-400 font-mono font-bold">${b.finalAmount || b.baseAmount || 0}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${STATUSES[b.status]?.color}`}>
                        {STATUSES[b.status]?.name}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select 
                        value={b.status} 
                        disabled={processingId === b.id} 
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)} 
                        className="bg-[#111] border border-white/10 text-white rounded-lg px-3 py-2 outline-none focus:border-teal-500 text-xs font-bold uppercase cursor-pointer"
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
                {bookings.length === 0 && (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500 italic">Chưa có đơn hàng nào trên hệ thống.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </>
  );
}