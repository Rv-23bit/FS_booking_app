import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';

// Admin page that lists instructors waiting for approval.
// Admin can approve or reject each one.
const InstructorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  // Load the pending instructor list from the backend.
  const loadRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/instructors/pending');
      setRequests(response.data);
    } catch (err) {
      setMessage('Could not load requests.');
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Approve or reject then refresh the list.
  const handleAction = async (id, action) => {
    try {
      await axiosInstance.put(`/api/admin/instructors/${id}/${action}`);
      setMessage(action === 'approve' ? 'Instructor approved.' : 'Instructor rejected.');
      loadRequests();
    } catch (err) {
      setMessage('Something went wrong, please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Instructor requests</h1>

      {message && <p className="text-blue-600 text-sm mb-4">{message}</p>}

      {requests.length === 0 ? (
        <p className="text-gray-600">There are no pending instructor requests right now.</p>
      ) : (
        <div className="bg-white shadow rounded divide-y">
          {requests.map((req) => (
            <div key={req._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{req.name}</p>
                <p className="text-sm text-gray-500">{req.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req._id, 'approve')}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req._id, 'reject')}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorRequests;
