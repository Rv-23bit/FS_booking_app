import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import instructorImage from '../../assets/illustrations/instructor.png';

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

// Lists only the classes assigned to the logged in instructor.
const InstructorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await axiosInstance.get('/api/instructor/classes');
        setClasses(response.data);
      } catch (err) {
        // Leave empty if it could not load.
      }
      setLoading(false);
    };
    loadClasses();
  }, []);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">My classes</h1>

      {classes.length === 0 ? (
        <div className="text-center mt-10">
          <img src={instructorImage} alt="" className="w-40 h-40 mx-auto mb-4" />
          <p className="text-gray-600">You have no classes assigned yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded divide-y">
          {classes.map((cls) => (
            <div key={cls._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">
                  {cls.title} <span className="text-xs text-gray-500">({cls.category})</span>
                </p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(cls.classDateTime)} · {cls.bookedCount} booked
                </p>
              </div>
              <Link
                to={`/instructor/classes/${cls._id}/roster`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                View roster
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorClasses;
