import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pending from './pages/Pending';
import Schedule from './pages/member/Schedule';
import MyBookings from './pages/member/MyBookings';
import ClassDetails from './pages/member/ClassDetails';
import InstructorClasses from './pages/instructor/InstructorClasses';
import ClassRoster from './pages/instructor/ClassRoster';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstructorRequests from './pages/admin/InstructorRequests';
import ManageClasses from './pages/admin/ManageClasses';
import ClassForm from './pages/admin/ClassForm';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      {/* min height keeps the footer at the bottom on short pages */}
      <main className="min-h-[80vh]">
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
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class/:id"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <ClassDetails />
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
        <Route
          path="/instructor/classes/:id/roster"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <ClassRoster />
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
        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classes/new"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ClassForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classes/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ClassForm />
            </ProtectedRoute>
          }
        />

        {/* Any other address shows a friendly not found page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
      <footer className="text-center text-sm text-gray-400 py-6">
        FS Club — book your fitness classes
      </footer>
    </Router>
  );
}

export default App;
