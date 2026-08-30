import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

// Show a date like "Mon 25 Aug, 6:00 pm".
const formatDateTime = (value) => {
  return new Date(value).toLocaleString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Admin page to see every class and manage them.
const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  // Show a success message if we were sent here after creating or editing.
  const [message, setMessage] = useState(location.state?.message || '');

  const loadClasses = async () => {
    try {
      const response = await axiosInstance.get('/api/classes');
      setClasses(response.data);
    } catch (err) {
      setMessage('Could not load classes.');
    }
  };

  useEffect(() => {
    loadClasses();
    // Clear the one time success message from history so refreshing the page
    // does not show it again as if a class was just created.
    if (location.state?.message) {
      window.history.replaceState({}, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete a class after a quick confirmation.
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await axiosInstance.delete(`/api/classes/${id}`);
      setMessage('Class deleted.');
      loadClasses();
    } catch (err) {
      setMessage('Could not delete the class.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage classes</h1>
        <button
          onClick={() => navigate('/admin/classes/new')}
          className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
        >
          Create class
        </button>
      </div>

      {message && <p className="text-brand text-sm mb-4">{message}</p>}

      {classes.length === 0 ? (
        <p className="text-gray-600">No classes yet. Create your first class to get started.</p>
      ) : (
        <div className="bg-white shadow-sm rounded-2xl divide-y">
          {classes.map((cls) => (
            <div key={cls._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">
                  {cls.title} <span className="text-xs text-gray-500">({cls.category})</span>
                </p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(cls.classDateTime)} · {cls.instructor ? cls.instructor.name : 'No instructor'} ·{' '}
                  {cls.bookedCount}/{cls.capacity} booked
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/classes/${cls._id}/edit`}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(cls._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageClasses;
