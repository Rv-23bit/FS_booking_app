import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import dashboardImage from '../../assets/illustrations/dashboard.png';

// Admin home. Shows a few real counts and links to the main admin pages.
const AdminDashboard = () => {
  const [summary, setSummary] = useState({ totalClasses: 0, totalBookings: 0, pendingInstructors: 0 });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/summary');
        setSummary(response.data);
      } catch (err) {
        // Keep the zeros if it could not load.
      }
    };
    loadSummary();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {/* Simple header image */}
      <div className="flex items-center gap-4 mb-6">
        <img src={dashboardImage} alt="" className="w-20 h-20" />
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
      </div>

      {/* The three counts */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white p-6 shadow rounded text-center">
          <p className="text-3xl font-bold text-blue-600">{summary.totalClasses}</p>
          <p className="text-sm text-gray-500 mt-1">Total classes</p>
        </div>
        <div className="bg-white p-6 shadow rounded text-center">
          <p className="text-3xl font-bold text-blue-600">{summary.totalBookings}</p>
          <p className="text-sm text-gray-500 mt-1">Confirmed bookings</p>
        </div>
        <div className="bg-white p-6 shadow rounded text-center">
          <p className="text-3xl font-bold text-blue-600">{summary.pendingInstructors}</p>
          <p className="text-sm text-gray-500 mt-1">Pending requests</p>
        </div>
      </div>

      {/* Links to the main admin pages */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin/classes" className="block bg-white p-6 shadow rounded hover:shadow-md">
          <h2 className="font-semibold mb-1">Manage classes</h2>
          <p className="text-sm text-gray-500">Create, edit and remove classes.</p>
        </Link>
        <Link to="/admin/requests" className="block bg-white p-6 shadow rounded hover:shadow-md">
          <h2 className="font-semibold mb-1">Instructor requests</h2>
          <p className="text-sm text-gray-500">Approve or reject new instructors.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
