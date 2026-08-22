import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import signupImage from '../assets/illustrations/signup.png';

// Sign up page. A user can join as a member or as an instructor.
const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axiosInstance.post('/api/auth/register', { ...formData, role });
      // Instructors need approval, so we show the message instead of going to login.
      if (role === 'instructor') {
        setMessage(response.data.message);
      } else {
        alert('Registration successful. Please log in.');
        navigate('/login');
      }
    } catch (err) {
      // Show the clear message the backend sent back.
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white p-6 shadow-md rounded">
        <img src={signupImage} alt="" className="w-32 h-32 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-center">Create your account</h1>

        {/* Toggle between joining as a member or an instructor */}
        <div className="flex mb-4 border rounded overflow-hidden">
          <button
            type="button"
            onClick={() => setRole('member')}
            className={`flex-1 py-2 ${role === 'member' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Member
          </button>
          <button
            type="button"
            onClick={() => setRole('instructor')}
            className={`flex-1 py-2 ${role === 'instructor' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Instructor
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          />
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
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
