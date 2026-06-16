import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Đang xác thực...");
  const navigate = useNavigate();

useEffect(() => {
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  // Định nghĩa hàm ngay trong này để tránh lỗi missing dependency
  const confirmEmail = async (uid, tkn) => {
    try {
      await axios.get(`https://smart-car-wash-system-be.onrender.com/api/auth/confirm-email`, {
        params: { userId: uid, token: tkn }
      });
      setStatus("Xác thực thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 2000);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setStatus("Xác thực thất bại. Vui lòng thử lại!");
    }
  };

  if (userId && token) {
    confirmEmail(userId, token);
  } else {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("Link xác thực không hợp lệ!");
  }
  
  // Dòng này giúp React biết bạn đang theo dõi searchParams và navigate
}, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-xl font-bold">{status}</h2>
    </div>
  );
}