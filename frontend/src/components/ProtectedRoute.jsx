import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps a page so only the right user can see it.
// allowedRoles is a list like ['admin'] or ['member'].
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // Wait until we have finished checking for a saved session.
  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  // Not logged in, send to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // An instructor who is not approved yet can only see the pending page.
  if (user.role === 'instructor' && user.status !== 'active') {
    return <Navigate to="/pending" replace />;
  }

  // Logged in but wrong role for this page.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
