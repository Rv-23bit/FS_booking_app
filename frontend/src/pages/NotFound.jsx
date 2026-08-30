import { Link } from 'react-router-dom';

// Shown when someone visits a page that does not exist.
const NotFound = () => {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center px-4">
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-gray-600 mb-6">
        The page you are looking for does not exist or may have moved.
      </p>
      <Link to="/" className="bg-brand text-white px-5 py-2 rounded">
        Go to home
      </Link>
    </div>
  );
};

export default NotFound;
