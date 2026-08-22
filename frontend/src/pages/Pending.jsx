import instructorImage from '../assets/illustrations/instructor.png';

// Shown to an instructor whose account has not been approved yet.
// There are no links into the instructor features from here.
const Pending = () => {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center px-4">
      <img src={instructorImage} alt="" className="w-40 h-40 mx-auto mb-6" />
      <h1 className="text-2xl font-bold mb-3">Your account is waiting for approval</h1>
      <p className="text-gray-600">
        Thanks for signing up as an instructor. An admin needs to approve your
        account before you can see your classes. Please check back later or log
        out for now.
      </p>
    </div>
  );
};

export default Pending;
