import { useEffect, useState } from 'react';
import axios from 'axios';
import PageLoader from "../components/PageLoader"; // Import Loader vào cho đẹp

export default function Profile() {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Xử lý cắt chuỗi ngày tháng từ BE (2026-06-16T16:53:03... -> 2026-06-16)
  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split('T')[0];
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const myUserId = localStorage.getItem("userId"); // Lấy ID đã lưu lúc Login
        
        if (!myUserId) {
          setMessage({ type: "error", text: "Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!" });
          return;
        }

        // ĐÃ SỬA: Gọi thẳng API lấy 1 user bằng ID (KHÔNG CÒN BỊ 403)
        const response = await axios.get(`https://smart-car-wash-system-be.onrender.com/api/users/${myUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data;
        
        // Cập nhật lên form
        if (userData) {
          setFormData({
            id: userData.id,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            phoneNumber: userData.phoneNumber || "",
            email: userData.email || "", 
            dateOfBirth: formatDateForInput(userData.dateOfBirth),
          });
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
        setMessage({ type: "error", text: "Lỗi kết nối máy chủ hoặc không có quyền truy cập!" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      
      // Chỉnh lại ngày tháng về chuẩn ISO trước khi ném cho BE
      const updatePayload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
      };

      // Gọi API cập nhật
      await axios.put(`https://smart-car-wash-system-be.onrender.com/api/users/${formData.id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công mĩ mãn!" });
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      setMessage({ type: "error", text: "Cập nhật thất bại. Vui lòng thử lại!" });
    } finally {
      setUpdating(false);
      // Hiện chữ xanh đỏ 3 giây rồi cho nó tự tắt đi cho gọn
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <>
      {/* Hiện cục quay quay lúc mới vào */}
      {loading && <PageLoader />}

      <div className="min-h-screen bg-[#050505] text-white pt-24 px-6 md:px-12 font-sans pb-10 relative overflow-hidden">
        
        {/* Glow Effects cho nó ma mị giống Login */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-teal-900/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-3xl font-black tracking-tighter mb-8 text-teal-400 italic">MY PROFILE.</h1>

          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Vùng hiển thị lỗi hoặc thành công */}
              {message.text && (
                <div className={`p-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition-all"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition-all"
                  />
                </div>

                {/* Email (Bị Khóa) */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full bg-[#050505] border border-white/5 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed outline-none"
                  />
                  <p className="text-[10px] text-slate-600 mt-1 italic">Email không thể thay đổi sau khi đăng ký.</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition-all font-mono"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Nút Submit */}
              <div className="pt-6 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  disabled={updating || !formData.id} // Vô hiệu hóa nút nếu không có ID
                  className="bg-teal-500 text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-teal-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]"
                >
                  {updating ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}