import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageLoader from '../components/PageLoader';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('https://smart-car-wash-system-be.onrender.com/api/auth/register', formData);
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký lỗi, thử lại đi bạn!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <PageLoader />}
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <form onSubmit={handleRegister} className="w-full max-w-[400px] flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-4">Create Account</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <input name="firstName" placeholder="First Name" required onChange={handleInputChange} className="w-full bg-[#111] p-3 rounded-lg border border-white/10 outline-none" />
          <input name="lastName" placeholder="Last Name" required onChange={handleInputChange} className="w-full bg-[#111] p-3 rounded-lg border border-white/10 outline-none" />
          <input name="email" type="email" placeholder="Email" required onChange={handleInputChange} className="w-full bg-[#111] p-3 rounded-lg border border-white/10 outline-none" />
          <input name="password" type="password" placeholder="Password" required onChange={handleInputChange} className="w-full bg-[#111] p-3 rounded-lg border border-white/10 outline-none" />
          <input name="dateOfBirth" type="date" required onChange={handleInputChange} className="w-full bg-[#111] p-3 rounded-lg border border-white/10 outline-none text-slate-500" />
          
          <button type="submit" className="bg-white text-black font-bold p-3 rounded-lg mt-2 hover:bg-teal-400 transition-all">
            REGISTER
          </button>
          <p className="text-sm text-slate-500 text-center">
            Already have an account? <Link to="/login" className="text-white underline">Sign in</Link>
          </p>
        </form>
      </div>
    </>
  );
}