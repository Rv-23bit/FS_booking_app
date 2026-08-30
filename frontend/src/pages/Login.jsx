import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import loginImage from '../assets/illustrations/login.png';

// Sends the user to the right page based on their role and status.
export const pathForUser = (user) => {
  if (user.role === 'admin') return '/admin';
  if (user.role === 'instructor') {
    return user.status === 'active' ? '/instructor/classes' : '/pending';
  }
  return '/schedule'; // member
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate(pathForUser(response.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white p-6 shadow-md rounded">
        <img src={loginImage} alt="" className="w-32 h-32 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome back</h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          />
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <button type="submit" className="w-full bg-brand text-white p-2 rounded hover:bg-brand-dark">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
