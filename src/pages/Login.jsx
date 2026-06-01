import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate vào đây
import SplitText from '../components/SplitText';
import PageLoader from '../components/PageLoader'; // Nhớ import cái loader ma trận

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Hàm xử lý khi bấm nút Sign In
  const handleSignIn = () => {
    setIsLoading(true); // Bật màn hình loading ma trận
    
    // Giả lập hệ thống đang xử lý đăng nhập mất 1.5 giây, sau đó chuyển sang Dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500); 
  };

  return (
    <>
      {/* Phủ màn hình loading lên trên cùng nếu isLoading là true */}
      {isLoading && <PageLoader />} 

      {/* Đổi màu nền chính sang đen tuyền giống Notra */}
      <div className="relative min-h-screen w-full bg-[#000000] flex items-center justify-center overflow-hidden font-sans text-white">
        
        {/* --- VỆT SÁNG NỀN (GLOW) TỐI ƯU LẠI --- */}
        {/* Glow góc phải trên - Ám xanh ngọc rất nhẹ */}
        <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-teal-900/10 blur-[140px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        
        {/* Glow góc trái dưới - Ám xám/đen nhạt */}
        <div className="absolute bottom-0 left-0 w-[70vw] h-[70vh] bg-slate-800/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

        {/* --- NÚT BACK --- */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-400 bg-transparent border border-white/[0.08] rounded-lg hover:bg-white/[0.04] hover:text-white transition-all z-10"
        >
          <span className="text-sm leading-none mb-[1px]">‹</span> Back
        </Link>

        {/* --- FORM CONTAINER (Mở rộng max-width lên một chút cho thoáng) --- */}
        <div className="relative z-10 w-full max-w-[380px] px-6 flex flex-col items-center text-center">
          
          {/* Logo/Icon */}
          <div className="w-[42px] h-[42px] mb-8 bg-[#0a0a0a] border border-white/[0.08] rounded-xl flex items-center justify-center shadow-lg">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m10-10H2m15.364-7.364l-14.142 14.142M4.636 4.636l14.142 14.142" />
             </svg>
          </div>

          {/* Tiêu đề */}
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
            First time here? <a href="#" className="text-white font-medium hover:underline decoration-white/30 underline-offset-4 transition-all">Sign up for free</a>
          </p>

          {/* Form Inputs */}
          <form className="w-full flex flex-col gap-3 mt-8">
            <input 
              type="email" 
              placeholder="Your email" 
              className="w-full bg-[#050505] border border-white/[0.08] text-[13px] text-white rounded-[10px] px-4 py-[14px] outline-none focus:border-white/20 transition-all placeholder:text-slate-600"
            />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-[#050505] border border-white/[0.08] text-[13px] text-white rounded-[10px] px-4 py-[14px] outline-none focus:border-white/20 transition-all placeholder:text-slate-600 tracking-widest"
            />

            {/* Primary Button */}
            <button 
                type="button" 
                onClick={handleSignIn}
                className="w-full bg-white text-black font-medium text-[13px] rounded-[10px] px-4 py-[14px] mt-2 hover:bg-gray-100 transition-colors"
              >
              Sign in
            </button>
          </form>

          {/* Secondary Actions */}
          <button className="text-[12px] text-slate-400 font-medium mt-6 hover:text-white transition-colors">
            Sign in using magic link
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 my-7">
            <div className="h-px bg-white/[0.06] flex-1"></div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-medium">or</span>
            <div className="h-px bg-white/[0.06] flex-1"></div>
          </div>

          {/* SSO Button */}
          <button className="w-full bg-transparent border border-white/[0.08] text-white font-medium text-[13px] rounded-[10px] px-4 py-[14px] hover:bg-white/[0.04] transition-colors">
            Single sign-on (SSO)
          </button>

          {/* Footer Text */}
          <p className="mt-8 text-[11px] text-slate-500 leading-relaxed max-w-[280px]">
            You acknowledge that you read, and agree, to our <br/>
            <a href="#" className="underline decoration-white/20 underline-offset-2 hover:text-slate-300">Terms of Service</a> and our <a href="#" className="underline decoration-white/20 underline-offset-2 hover:text-slate-300">Privacy Policy</a>.
          </p>

        </div>
      </div>
    </>
  );
}