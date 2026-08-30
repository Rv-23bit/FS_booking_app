import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

// The categories must match the ones the backend accepts.
const categories = ['Yoga', 'Spin', 'HIIT', 'Pilates', 'Strength'];

// Turn an ISO date into the value a datetime-local input expects.
const toLocalInput = (iso) => {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Form used for both creating and editing a class.
// If there is an id in the URL we are editing, otherwise we are creating.
const ClassForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: 'Yoga',
    description: '',
    classDateTime: '',
    durationMinutes: '',
    capacity: '',
    instructor: '',
  });
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load the list of approved instructors for the dropdown.
    const loadInstructors = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/instructors/approved');
        setInstructors(response.data);
      } catch (err) {
        setError('Could not load the instructor list.');
      }
    };
    loadInstructors();

    // If editing, load the class details and fill the form.
    if (isEdit) {
      const loadClass = async () => {
        try {
          const response = await axiosInstance.get(`/api/classes/${id}`);
          const cls = response.data;
          setForm({
            title: cls.title,
            category: cls.category,
            description: cls.description || '',
            classDateTime: toLocalInput(cls.classDateTime),
            durationMinutes: cls.durationMinutes,
            capacity: cls.capacity,
            instructor: cls.instructor?._id || cls.instructor || '',
          });
        } catch (err) {
          setError('Could not load the class.');
        }
      };
      loadClass();
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEdit) {
        await axiosInstance.put(`/api/classes/${id}`, form);
      } else {
        await axiosInstance.post('/api/classes', form);
      }
      // Send a success message back to the manage classes page.
      navigate('/admin/classes', { state: { message: isEdit ? 'Class updated.' : 'Class created.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the class.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 px-4">
      <div className="bg-white p-6 shadow-sm rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit class' : 'Create class'}</h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <label className="block text-sm mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full mb-3 p-2 border rounded"
            rows="2"
          />

          <label className="block text-sm mb-1">Date and time</label>
          <input
            type="datetime-local"
            value={form.classDateTime}
            onChange={(e) => handleChange('classDateTime', e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <label className="block text-sm mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={form.durationMinutes}
            onChange={(e) => handleChange('durationMinutes', e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <label className="block text-sm mb-1">Capacity</label>
          <input
            type="number"
            value={form.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <label className="block text-sm mb-1">Instructor</label>
          <select
            value={form.instructor}
            onChange={(e) => handleChange('instructor', e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Choose an instructor</option>
            {instructors.map((ins) => (
              <option key={ins._id} value={ins._id}>{ins.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button type="submit" className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark">
              {isEdit ? 'Save changes' : 'Create class'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/classes')}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
