import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import noClassesImage from '../../assets/illustrations/no-classes.png';
import successImage from '../../assets/illustrations/booking-success.png';

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

// Member class schedule. Shows every class and lets the member book a spot.
const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [bookedIds, setBookedIds] = useState([]); // class ids the member already booked
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // class waiting for confirmation
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load the schedule and the member's own bookings together.
  const loadData = async () => {
    try {
      const [classRes, bookingRes] = await Promise.all([
        axiosInstance.get('/api/classes'),
        axiosInstance.get('/api/bookings/my'),
      ]);
      setClasses(classRes.data);
      // Keep the ids of classes the member has a confirmed booking for.
      const ids = bookingRes.data
        .filter((b) => b.status === 'confirmed' && b.class)
        .map((b) => b.class._id);
      setBookedIds(ids);
    } catch (err) {
      // Leave things empty if it could not load.
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Confirm the booking for the selected class.
  const confirmBooking = async () => {
    setError('');
    setSuccess('');
    try {
      await axiosInstance.post('/api/bookings', { classId: selected._id });
      setSuccess(`You are booked into ${selected.title}.`);
      setSelected(null);
      loadData(); // refresh spaces left and booked state
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book the class.');
      setSelected(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Class schedule</h1>

      {/* Success panel shown after a booking is confirmed */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-4 flex items-center gap-4">
          <img src={successImage} alt="" className="w-16 h-16" />
          <p className="text-green-700">{success}</p>
        </div>
      )}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {/* Search box (not wired up yet) */}
      <input
        type="text"
        placeholder="Search classes"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-2 border rounded"
      />

      {classes.length === 0 ? (
        <div className="text-center mt-10">
          <img src={noClassesImage} alt="" className="w-40 h-40 mx-auto mb-4" />
          <p className="text-gray-600">There are no classes on the schedule yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {classes.map((cls) => {
            const isBooked = bookedIds.includes(cls._id);
            const isPast = new Date(cls.classDateTime) < new Date();
            return (
              <div key={cls._id} className="bg-white p-5 shadow-sm rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/class/${cls._id}`} className="text-lg font-semibold hover:underline">
                    {cls.title}
                  </Link>
                  <span className="text-xs bg-brand-tint text-brand-dark px-2 py-1 rounded">{cls.category}</span>
                </div>
                {cls.description && <p className="text-sm text-gray-600 mb-2">{cls.description}</p>}
                <p className="text-sm text-gray-700">{formatDateTime(cls.classDateTime)}</p>
                <p className="text-sm text-gray-700">{cls.durationMinutes} minutes</p>
                <p className="text-sm text-gray-700">
                  Instructor: {cls.instructor ? cls.instructor.name : 'To be confirmed'}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium">
                    {cls.spacesLeft > 0 ? `${cls.spacesLeft} spaces left` : 'Class full'}
                  </span>
                  {isPast ? (
                    <span className="text-sm text-gray-400">Class finished</span>
                  ) : isBooked ? (
                    <span className="text-sm text-green-600 font-medium">Booked</span>
                  ) : cls.spacesLeft > 0 ? (
                    <button
                      onClick={() => { setSuccess(''); setError(''); setSelected(cls); }}
                      className="bg-brand text-white px-3 py-1 rounded hover:bg-brand-dark"
                    >
                      Book
                    </button>
                  ) : (
                    <button disabled className="bg-gray-300 text-white px-3 py-1 rounded cursor-not-allowed">
                      Full
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation panel shown before the booking is finished */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm booking</h3>
            <p className="text-sm text-gray-600 mb-4">
              Book a spot in {selected.title} on {formatDateTime(selected.classDateTime)}?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={confirmBooking} className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
