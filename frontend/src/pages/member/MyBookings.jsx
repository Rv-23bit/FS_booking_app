import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import noBookingsImage from '../../assets/illustrations/no-bookings.png';

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

// The member's own bookings, with a cancel button on each confirmed one.
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const response = await axiosInstance.get('/api/bookings/my');
      setBookings(response.data);
    } catch (err) {
      setMessage('Could not load your bookings.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axiosInstance.put(`/api/bookings/${id}/cancel`);
      setMessage('Your booking has been cancelled.');
      loadBookings();
    } catch (err) {
      setMessage('Could not cancel the booking.');
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  // Only show bookings that still have their class (not deleted).
  const validBookings = bookings.filter((b) => b.class);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">My bookings</h1>

      {message && <p className="text-blue-600 text-sm mb-4">{message}</p>}

      {validBookings.length === 0 ? (
        <div className="text-center mt-10">
          <img src={noBookingsImage} alt="" className="w-40 h-40 mx-auto mb-4" />
          <p className="text-gray-600">You have not booked any classes yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded divide-y">
          {validBookings.map((b) => (
            <div key={b._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">
                  {b.class.title} <span className="text-xs text-gray-500">({b.class.category})</span>
                </p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(b.class.classDateTime)} ·{' '}
                  {b.class.instructor ? b.class.instructor.name : 'Instructor to be confirmed'}
                </p>
              </div>
              <div>
                {b.status === 'confirmed' ? (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-sm text-gray-400">Cancelled</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
