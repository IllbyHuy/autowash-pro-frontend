import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SplitText from "../components/SplitText";
import PageLoader from "../components/PageLoader";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://smart-car-wash-system-be.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data?.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        
        // --- GIẢI MÃ TOKEN ĐỂ LẤY DATA THỰC TẾ ---
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        // Rút trích thông tin từ Token
        const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        let rawRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || "customer";
        const userRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1); // Chữ cái đầu viết hoa
        const userEmail = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || formData.email;

        // Lưu vào Local Storage
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", userRole);
        localStorage.setItem("email", userEmail);

        // Kích hoạt Header đổi trạng thái
        window.dispatchEvent(new Event("storage")); 

        // Điều hướng theo Role
        if (userRole === "Admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "Manager") {
          navigate("/manager/dashboard");
        } else {
          navigate("/dashboard"); 
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Đăng nhập không thành công, vui lòng kiểm tra lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <PageLoader />}
      <div className="relative min-h-screen w-full bg-[#000000] flex items-center justify-center overflow-hidden font-sans text-white">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-teal-900/10 blur-[140px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[70vw] h-[70vh] bg-slate-800/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-400 bg-transparent border border-white/[0.08] rounded-lg hover:bg-white/[0.04] hover:text-white transition-all z-10"
        >
          ‹ Back
        </Link>

        <div className="relative z-10 w-full max-w-[380px] px-6 flex flex-col items-center text-center">
          <div className="w-[42px] h-[42px] mb-8 bg-[#0a0a0a] border border-white/[0.08] rounded-xl flex items-center justify-center shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m10-10H2m15.364-7.364l-14.142 14.142M4.636 4.636l14.142 14.142" />
            </svg>
          </div>

          <SplitText
            text="Hello, you"
            className="text-[26px] font-medium tracking-tight text-white mb-2"
            delay={40}
            duration={0.8}
            from={{ opacity: 0, y: 10 }}
            to={{ opacity: 1, y: 0 }}
            tag="h1"
          />

          <p className="text-[13px] text-slate-500 mb-8">
            First time here?{" "}
            <Link to="/register" className="text-white font-medium hover:underline decoration-white/30 underline-offset-4 transition-all">
              Sign up for free
            </Link>
          </p>

          <form onSubmit={handleSignIn} className="w-full flex flex-col gap-3 mt-8">
            {error && (
              <div className="text-red-500 text-[12px] bg-red-950/30 p-2 rounded">
                {error}
              </div>
            )}

            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              onChange={handleInputChange}
              className="w-full bg-[#050505] border border-white/[0.08] text-[13px] text-white rounded-[10px] px-4 py-[14px] outline-none focus:border-white/20 transition-all"
            />
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              onChange={handleInputChange}
              className="w-full bg-[#050505] border border-white/[0.08] text-[13px] text-white rounded-[10px] px-4 py-[14px] outline-none focus:border-white/20 transition-all tracking-widest"
            />

            <button
              type="submit"
              className="w-full bg-white text-black font-medium text-[13px] rounded-[10px] px-4 py-[14px] mt-2 hover:bg-gray-100 transition-colors"
            >
              Sign in
            </button>
          </form>

          <button className="text-[12px] text-slate-400 font-medium mt-6 hover:text-white transition-colors">
            Sign in using magic link
          </button>

          <div className="w-full flex items-center gap-4 my-7">
            <div className="h-px bg-white/[0.06] flex-1"></div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-medium">or</span>
            <div className="h-px bg-white/[0.06] flex-1"></div>
          </div>

          <button className="w-full bg-transparent border border-white/[0.08] text-white font-medium text-[13px] rounded-[10px] px-4 py-[14px] hover:bg-white/[0.04] transition-colors">
            Single sign-on (SSO)
          </button>

          <p className="mt-8 text-[11px] text-slate-500 leading-relaxed max-w-[280px]">
            You acknowledge that you read, and agree, to our <br />
            <a href="#" className="underline decoration-white/20 underline-offset-2 hover:text-slate-300">Terms of Service</a>{" "}
            and our{" "}
            <a href="#" className="underline decoration-white/20 underline-offset-2 hover:text-slate-300">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>
  );
}