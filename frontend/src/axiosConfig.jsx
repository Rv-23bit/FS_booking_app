import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://3.26.96.188:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

// Attach the saved login token to every request so protected routes work.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a request comes back as 401 while we were logged in, the token has
// expired or is no longer valid. Clear it and send the user to login so
// they are not stuck in a broken logged in state. We skip the login and
// register calls because a 401 there just means wrong details.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('token');
    const url = error.config?.url || '';
    const isAuthCall = url.includes('/api/auth/login') || url.includes('/api/auth/register');
    if (error.response?.status === 401 && token && !isAuthCall) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
