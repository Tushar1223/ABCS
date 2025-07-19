import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const handleContinue = () => {
    if (role === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/student-name');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <span className="text-sm bg-primary text-white px-3 py-1 rounded-full mb-4">
        ✦ Intervue Poll
      </span>

      <h1 className="text-2xl sm:text-3xl font-semibold text-darkText mb-2">
        Welcome to the <span className="text-black font-bold">Live Polling System</span>
      </h1>

      <p className="text-grayText mb-6 text-sm sm:text-base max-w-md">
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div
          className={`cursor-pointer border rounded-md p-4 w-64 ${
            role === 'student' ? 'border-primary shadow-md' : 'border-gray-300'
          }`}
          onClick={() => setRole('student')}
        >
          <h2 className="font-semibold mb-1 text-black">I’m a Student</h2>
          <p className="text-sm text-grayText">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </p>
        </div>

        <div
          className={`cursor-pointer border rounded-md p-4 w-64 ${
            role === 'teacher' ? 'border-primary shadow-md' : 'border-gray-300'
          }`}
          onClick={() => setRole('teacher')}
        >
          <h2 className="font-semibold mb-1 text-black">I’m a Teacher</h2>
          <p className="text-sm text-grayText">
            Submit answers and view live poll results in real-time.
          </p>
        </div>
      </div>

      <button
        className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full transition-all"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default LandingPage;
