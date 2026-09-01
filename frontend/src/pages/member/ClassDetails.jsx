import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import successImage from '../../assets/illustrations/booking-success.png';
import coachImage from '../../assets/illustrations/instructor.png';
import yogaImage from '../../assets/illustrations/signup.png';
import stretchImage from '../../assets/illustrations/no-bookings.png';
import fitnessImage from '../../assets/illustrations/login.png';
import calmImage from '../../assets/illustrations/no-classes.png';

// Pick a hero picture that suits the class category.
const heroFor = (category) => {
  if (category === 'Yoga') return yogaImage;
  if (category === 'Pilates') return stretchImage;
  if (category === 'Strength') return calmImage;
  return fitnessImage; // Spin and HIIT
};

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

// A full page for one class, reached by clicking a class on the schedule.
// It shows all the details with pictures and lets the member book from here.
const ClassDetails = () => {
  const { id } = useParams();
  const [cls, setCls] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load the class and check if the member has already booked it.
  const loadData = async () => {
    try {
      const [classRes, bookingRes] = await Promise.all([
        axiosInstance.get(`/api/classes/${id}`),
        axiosInstance.get('/api/bookings/my'),
      ]);
      setCls(classRes.data);
      const booked = bookingRes.data.some(
        (b) => b.status === 'confirmed' && b.class && b.class._id === id
      );
      setIsBooked(booked);
    } catch (err) {
      setError('Could not load this class.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBook = async () => {
    setError('');
    setSuccess('');
    try {
      await axiosInstance.post('/api/bookings', { classId: id });
      setSuccess('You are booked into this class.');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book the class.');
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-muted">Loading...</p>;
  }

  if (!cls) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <p className="text-muted">{error || 'Class not found.'}</p>
        <Link to="/schedule" className="text-brand text-sm">⬅ Back to schedule</Link>
      </div>
    );
  }

  const isPast = new Date(cls.classDateTime) < new Date();

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <Link to="/schedule" className="text-brand text-sm">⬅ Back to schedule</Link>

      {/* Hero banner with a picture that suits the category */}
      <div className="bg-brand-tint rounded-2xl mt-2 mb-4 flex items-center justify-center h-48">
        <img src={heroFor(cls.category)} alt="" className="h-40" />
      </div>

      <div className="bg-white p-6 shadow-sm rounded-2xl">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-4">
            <img src={successImage} alt="" className="w-16 h-16" />
            <p className="text-green-700">{success}</p>
          </div>
        )}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold">{cls.title}</h1>
          <span className="text-xs bg-brand-tint text-brand-dark px-2 py-1 rounded-full">{cls.category}</span>
        </div>

        {/* Key facts, each with a small icon */}
        <div className="space-y-2 text-ink mb-5">
          <p>📅 {formatDateTime(cls.classDateTime)}</p>
          <p>⏱️ {cls.durationMinutes} minutes</p>
          <p>👤 {cls.instructor ? cls.instructor.name : 'To be confirmed'}</p>
          <p>👥 {cls.spacesLeft > 0 ? `${cls.spacesLeft} of ${cls.capacity} spots available` : 'Class full'}</p>
        </div>

        {cls.description && (
          <div className="border-t pt-4 mb-5">
            <h2 className="font-semibold mb-1">About this class</h2>
            <p className="text-muted">{cls.description}</p>
          </div>
        )}

        {/* Instructor card */}
        <div className="border-t pt-4 mb-6">
          <h2 className="font-semibold mb-2">Your instructor</h2>
          <div className="flex items-center gap-3 bg-page rounded-xl p-3">
            <img src={coachImage} alt="" className="w-14 h-14 rounded-full bg-white" />
            <div>
              <p className="font-medium">{cls.instructor ? cls.instructor.name : 'To be confirmed'}</p>
              <p className="text-sm text-muted">Studio instructor</p>
            </div>
          </div>
        </div>

        {isPast ? (
          <p className="text-muted">This class has already taken place.</p>
        ) : isBooked ? (
          <p className="text-brand-dark font-medium">You are booked into this class.</p>
        ) : cls.spacesLeft > 0 ? (
          <button onClick={handleBook} className="w-full bg-brand text-white px-5 py-3 rounded-xl hover:bg-brand-dark">
            Book this class
          </button>
        ) : (
          <button disabled className="w-full bg-gray-300 text-white px-5 py-3 rounded-xl cursor-not-allowed">
            Class full
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;
