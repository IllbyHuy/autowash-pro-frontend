import axios from 'axios';

const axiosClient = axios.create({
  // URL lấy từ file .env (ví dụ: https://smart-car-wash-system-be.onrender.com/api)
  baseURL: import.meta.env.VITE_API_URL || 'https://smart-car-wash-system-be.onrender.com/swagger',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm Token (nếu có) vào mọi lượt gọi API
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi chung (Ví dụ: Token hết hạn thì đá văng ra login)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;