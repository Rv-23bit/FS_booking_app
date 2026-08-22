import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import avatarImage from '../assets/illustrations/avatar.png';

// Top navigation bar. The links shown depend on the logged in user's role.
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Work out which links to show for the current role.
  const renderLinks = () => {
    if (!user) return null;

    if (user.role === 'member') {
      return (
        <>
          <Link to="/schedule" className="mr-4">Schedule</Link>
          <Link to="/bookings" className="mr-4">My Bookings</Link>
        </>
      );
    }
    if (user.role === 'instructor' && user.status === 'active') {
      return <Link to="/instructor/classes" className="mr-4">My Classes</Link>;
    }
    if (user.role === 'admin') {
      return (
        <>
          <Link to="/admin" className="mr-4">Dashboard</Link>
          <Link to="/admin/classes" className="mr-4">Classes</Link>
          <Link to="/admin/requests" className="mr-4">Requests</Link>
        </>
      );
    }
    return null;
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">FitBook</Link>
      <div className="flex items-center">
        {user ? (
          <>
            {renderLinks()}
            <img src={avatarImage} alt="" className="w-8 h-8 rounded-full bg-white mr-2" />
            <span className="mr-4 hidden sm:inline">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
