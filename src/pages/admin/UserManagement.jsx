import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import PageLoader from "../../components/PageLoader";

const API_BASE = "https://smart-car-wash-system-be.onrender.com/api/users";

export default function UserManagement() {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State cho thanh tìm kiếm
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toast, setToast] = useState({ type: "", text: "" });

  // Modal state
  const [editUser, setEditUser] = useState(null);
  const [pwUser, setPwUser] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE, { headers: getHeaders() });
      if (res?.data) {
        let users = Array.isArray(res.data) ? res.data : res.data.data || [];
        
        // ==========================================
        // 🛑 BỘ LỌC TỐI CAO: GIẤU NHẸM ACCOUNT ADMIN
        // ==========================================
        users = users.filter(u => {
          const role = u.role?.toLowerCase() || "";
          const uname = u.userName?.toLowerCase() || "";
          return role !== "admin" && uname !== "admin";
        });

        users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setAllUsers(users);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách User:", error);
      showToast("error", "Không tải được danh sách user!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  // ---- TÌM KIẾM & THỐNG KÊ (Tự động tính toán lại khi có thay đổi) ----
  const displayedUsers = useMemo(() => {
    if (!searchTerm) return allUsers;
    const lower = searchTerm.toLowerCase();
    return allUsers.filter(u => 
      (u.userName || "").toLowerCase().includes(lower) || 
      (u.email || "").toLowerCase().includes(lower) ||
      (u.phoneNumber || "").includes(lower)
    );
  }, [allUsers, searchTerm]);

  const stats = useMemo(() => ({
    total: allUsers.length,
    active: allUsers.filter(u => u.isActive).length,
    locked: allUsers.filter(u => !u.isActive).length,
  }), [allUsers]);

  // ---- KHÓA / MỞ KHÓA ----
  const handleToggleLock = async (user) => {
    const isLocking = user.isActive;
    const action = isLocking ? "khóa" : "mở khóa";

    if (!window.confirm(`Xác nhận ${action} tài khoản "${user.userName}"?`)) return;

    setActionLoadingId(user.id);
    try {
      const endpoint = isLocking ? "lock" : "unlock";
      await axios.put(`${API_BASE}/${user.id}/${endpoint}`, {}, { headers: getHeaders() });

      setAllUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !isLocking } : u))
      );
      showToast("success", `Đã ${action} tài khoản thành công!`);
    } catch (error) {
      console.error(`Lỗi ${action} user:`, error.response?.data || error.message);
      showToast("error", `${action} thất bại. Vui lòng thử lại!`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      {loading && <PageLoader />}

      <div className="text-white pb-20 font-sans w-full max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="mb-8 border-b border-white/10 pb-6 mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-indigo-400 uppercase">User Management</h1>
            <p className="text-slate-500 font-mono text-sm tracking-widest mt-1">QUẢN LÝ TÀI KHOẢN KHÁCH HÀNG & NHÂN VIÊN</p>
          </div>
          
          {/* THANH TÌM KIẾM MỚI */}
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Tìm username, email, sđt..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 pl-10 outline-none focus:border-indigo-500 transition-all text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* ================= THẺ THỐNG KÊ (KPI CARDS) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
            <p className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-2">Total Users</p>
            <h3 className="text-3xl font-black text-white">{stats.total}</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111] border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-2">Active Accounts</p>
            <h3 className="text-3xl font-black text-white">{stats.active}</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#111] border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-rose-400 tracking-widest uppercase mb-2">Locked Accounts</p>
            <h3 className="text-3xl font-black text-white">{stats.locked}</h3>
          </motion.div>
        </div>

        {/* TOAST THÔNG BÁO */}
        <AnimatePresence>
          {toast.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center justify-between shadow-lg ${
                toast.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              <span>{toast.text}</span>
              <button onClick={() => setToast({ type: "", text: "" })} className="opacity-50 hover:opacity-100">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= BẢNG DANH SÁCH USER ================= */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#111] border-b border-white/10 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-4 pl-6">ID / Username</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Liên hệ</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-right pr-6">Hành động (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500 italic">
                      {searchTerm ? "Không tìm thấy user nào khớp với từ khóa." : "Chưa có dữ liệu User trên hệ thống."}
                    </td>
                  </tr>
                ) : (
                  displayedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-white mb-1">{u.userName}</p>
                        <p className="font-mono text-[10px] text-slate-500">{u.id.substring(0, 8).toUpperCase()}</p>
                      </td>
                      <td className="p-4 font-bold text-slate-300">
                        {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}` : "Chưa cập nhật"}
                      </td>
                      <td className="p-4">
                        <p className="text-slate-300 mb-1">{u.email || "N/A"}</p>
                        <p className="text-slate-500 font-mono text-xs">{u.phoneNumber || "N/A"}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border ${
                            u.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {u.isActive ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          <button
                            title={u.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                            onClick={() => handleToggleLock(u)}
                            disabled={actionLoadingId === u.id}
                            className={`p-2 rounded-lg transition-all disabled:opacity-40 ${
                              u.isActive ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                            }`}
                          >
                            {actionLoadingId === u.id ? (
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>
                            ) : u.isActive ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                            )}
                          </button>

                          <button
                            title="Sửa thông tin"
                            onClick={() => setEditUser(u)}
                            className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>

                          <button
                            title="Đổi mật khẩu"
                            onClick={() => setPwUser(u)}
                            className="p-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500 hover:text-black transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Modal Sửa thông tin */}
      <AnimatePresence>
        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSuccess={(updated) => {
              setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
              setEditUser(null);
              showToast("success", "Cập nhật thông tin thành công!");
            }}
            onError={(msg) => showToast("error", msg)}
            headers={getHeaders()}
          />
        )}
      </AnimatePresence>

      {/* Modal Đổi mật khẩu */}
      <AnimatePresence>
        {pwUser && (
          <ChangePasswordModal
            user={pwUser}
            onClose={() => setPwUser(null)}
            onSuccess={() => {
              setPwUser(null);
              showToast("success", "Đổi mật khẩu thành công!");
            }}
            onError={(msg) => showToast("error", msg)}
            headers={getHeaders()}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ================= MODAL: SỬA THÔNG TIN (Giữ nguyên logic của ông) =================
function EditUserModal({ user, onClose, onSuccess, onError, headers }) {
  const [form, setForm] = useState({
    userName: user.userName || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
    isActive: user.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null,
      };
      await axios.put(`${API_BASE}/${user.id}`, payload, { headers });
      onSuccess({ id: user.id, ...form });
    } catch (error) {
      console.error("Lỗi sửa user:", error.response?.data || error.message);
      onError(error.response?.data?.title || "Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title="SỬA THÔNG TIN USER">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGrid>
          <Field label="Username" name="userName" value={form.userName} onChange={handleChange} />
          <Field label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
          <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
          <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          <Field label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          <Field label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" />
        </FieldGrid>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-400 transition-colors disabled:opacity-40">
            {saving ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ================= MODAL: ĐỔI MẬT KHẨU (Giữ nguyên logic của ông) =================
function ChangePasswordModal({ user, onClose, onSuccess, onError, headers }) {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      onError("Mật khẩu mới phải từ 6 ký tự trở lên!");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      onError("Hai mật khẩu không khớp!");
      return;
    }
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/${user.id}/change-password`, { newPassword: form.newPassword }, { headers });
      onSuccess();
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error.response?.data || error.message);
      onError(error.response?.data?.title || "Đổi mật khẩu thất bại. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title={`ĐỔI MẬT KHẨU: ${user.userName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Mật khẩu mới" name="newPassword" value={form.newPassword} onChange={handleChange} type="password" />
        <Field label="Xác nhận mật khẩu" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" />

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="bg-amber-500 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors disabled:opacity-40">
            {saving ? "ĐANG XỬ LÝ..." : "ĐỔI MẬT KHẨU"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ================= SHARED UI PIECES =================
function ModalShell({ title, onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} onClick={(e) => e.stopPropagation()} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-black tracking-tight text-white mb-6 uppercase">{title}</h2>
        {children}
      </motion.div>
    </motion.div>
  );
}

function FieldGrid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all [color-scheme:dark]" />
    </div>
  );
}