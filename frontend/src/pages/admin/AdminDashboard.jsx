import { Link } from 'react-router-dom';

// Admin home. The summary counts are added in a later phase.
// For now it links to the parts of the admin area that already work.
const AdminDashboard = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin/requests" className="block bg-white p-6 shadow rounded hover:shadow-md">
          <h2 className="font-semibold mb-1">Instructor requests</h2>
          <p className="text-sm text-gray-500">Approve or reject new instructors.</p>
        </Link>
        <Link to="/admin/classes" className="block bg-white p-6 shadow rounded hover:shadow-md">
          <h2 className="font-semibold mb-1">Manage classes</h2>
          <p className="text-sm text-gray-500">Create, edit and remove classes.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
