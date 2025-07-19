import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KickedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session so they don't rejoin on refresh
    sessionStorage.clear();
  }, []);

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">You've been removed!</h1>
      <p className="text-grayText mb-6 text-sm sm:text-base max-w-md">
        The teacher has removed you from the session. You will no longer be able to participate in this poll.
      </p>
      <button
        className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full transition-all"
        onClick={handleReturn}
      >
        Return to Home
      </button>
    </div>
  );
};

export default KickedPage;
