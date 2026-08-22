import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pending from './pages/Pending';
import Schedule from './pages/member/Schedule';
import InstructorClasses from './pages/instructor/InstructorClasses';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstructorRequests from './pages/admin/InstructorRequests';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending" element={<Pending />} />

        {/* Member pages */}
        <Route
          path="/schedule"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <Schedule />
            </ProtectedRoute>
          }
        />

        {/* Instructor pages */}
        <Route
          path="/instructor/classes"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorClasses />
            </ProtectedRoute>
          }
        />

        {/* Admin pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <InstructorRequests />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
