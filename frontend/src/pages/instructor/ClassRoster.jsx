import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

// Roster page for one class. The instructor can tick who attended and save it.
const ClassRoster = () => {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  // attendance maps a booking id to true (attended) or false (did not attend).
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRoster = async () => {
    try {
      const response = await axiosInstance.get(`/api/instructor/classes/${id}/roster`);
      setClassInfo(response.data.classInfo);
      setBookings(response.data.bookings);

      // Start each checkbox from whatever was saved before (true if attended).
      const start = {};
      response.data.bookings.forEach((b) => {
        start[b._id] = b.attended === true;
      });
      setAttendance(start);
    } catch (err) {
      setMessage('Could not load the roster.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggle = (bookingId) => {
    setAttendance({ ...attendance, [bookingId]: !attendance[bookingId] });
  };

  // Split the bookings into the two lists the backend expects and save.
  const handleSave = async () => {
    setMessage('');
    const attended = [];
    const notAttended = [];
    bookings.forEach((b) => {
      if (attendance[b._id]) attended.push(b._id);
      else notAttended.push(b._id);
    });
    try {
      await axiosInstance.put(`/api/instructor/classes/${id}/attendance`, { attended, notAttended });
      setMessage('Attendance saved.');
    } catch (err) {
      setMessage('Could not save attendance.');
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Link to="/instructor/classes" className="text-blue-600 text-sm">← Back to my classes</Link>

      <h1 className="text-2xl font-bold mt-2 mb-1">{classInfo ? classInfo.title : 'Class roster'}</h1>
      {classInfo && <p className="text-gray-500 mb-4">{formatDateTime(classInfo.classDateTime)}</p>}

      {message && <p className="text-blue-600 text-sm mb-4">{message}</p>}

      {bookings.length === 0 ? (
        <p className="text-gray-600">No members have booked this class yet.</p>
      ) : (
        <>
          <div className="bg-white shadow rounded divide-y mb-4">
            {bookings.map((b) => (
              <label key={b._id} className="flex items-center justify-between p-4 cursor-pointer">
                <div>
                  <p className="font-semibold">{b.member ? b.member.name : 'Member'}</p>
                  <p className="text-sm text-gray-500">{b.member ? b.member.email : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Attended</span>
                  <input
                    type="checkbox"
                    checked={attendance[b._id] || false}
                    onChange={() => toggle(b._id)}
                    className="w-5 h-5"
                  />
                </div>
              </label>
            ))}
          </div>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save attendance
          </button>
        </>
      )}
    </div>
  );
};

export default ClassRoster;
