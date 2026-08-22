import { Link } from 'react-router-dom';

// Simple landing page. The role specific pages get added in the later phases.
const Home = () => {
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to FitBook</h1>
      <p className="text-gray-600 mb-8">
        Book fitness classes at our studio. Sign up as a member to view the
        schedule and reserve your spot.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded">
          Sign up
        </Link>
        <Link to="/login" className="border border-blue-600 text-blue-600 px-5 py-2 rounded">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Home;
