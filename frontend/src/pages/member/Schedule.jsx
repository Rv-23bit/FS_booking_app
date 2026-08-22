import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import noClassesImage from '../../assets/illustrations/no-classes.png';

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

// Member class schedule. Shows every class as a card.
const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await axiosInstance.get('/api/classes');
        setClasses(response.data);
      } catch (err) {
        // Leave the list empty if it could not load.
      }
      setLoading(false);
    };
    loadClasses();
  }, []);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Class schedule</h1>

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
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white p-5 shadow rounded">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{cls.title}</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{cls.category}</span>
              </div>
              {cls.description && <p className="text-sm text-gray-600 mb-2">{cls.description}</p>}
              <p className="text-sm text-gray-700">{formatDateTime(cls.classDateTime)}</p>
              <p className="text-sm text-gray-700">{cls.durationMinutes} minutes</p>
              <p className="text-sm text-gray-700">
                Instructor: {cls.instructor ? cls.instructor.name : 'To be confirmed'}
              </p>
              <p className="text-sm font-medium mt-2">
                {cls.spacesLeft > 0 ? `${cls.spacesLeft} spaces left` : 'Class full'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
