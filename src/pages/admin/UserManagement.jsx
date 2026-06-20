import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import PageLoader from "../../components/PageLoader"; 

export default function UserManagement() {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Gọi API lấy danh sách User
        const res = await axios.get(`https://smart-car-wash-system-be.onrender.com/api/users`, { headers });
        
        if (res?.data) {
          const users = Array.isArray(res.data) ? res.data : res.data.data || [];
          // Sắp xếp user mới nhất lên đầu (nếu có trường createdAt)
          users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          setAllUsers(users);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách User:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      {loading && <PageLoader />}
      
      {/* Tui bỏ bg-[#050505] đi để nó tự động trong suốt, ăn khớp với cái nền có sẵn của ông */}
      <div className="text-white p-8 font-sans w-full">
        
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black tracking-tighter text-indigo-500">USER MANAGEMENT</h1>
          <p className="text-slate-400 font-mono text-sm tracking-widest mt-1">QUẢN LÝ TÀI KHOẢN HỆ THỐNG</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#111] border-b border-white/10 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Tên User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                      Chưa có dữ liệu User trên hệ thống.
                    </td>
                  </tr>
                ) : (
                  allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6 font-mono text-xs text-slate-500">
                        {u.id.substring(0, 8).toUpperCase()}...
                      </td>
                      <td className="p-4 font-bold text-white">
                        {u.fullName || u.userName || "Chưa cập nhật"}
                      </td>
                      <td className="p-4 text-slate-400">{u.email || "N/A"}</td>
                      <td className="p-4 text-slate-400 font-mono">{u.phoneNumber || "N/A"}</td>
                      <td className="p-4 text-center">
                        <button className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all uppercase font-bold tracking-widest">
                          Chi Tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </>
  );
}