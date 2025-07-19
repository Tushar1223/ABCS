import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const StudentNameEntry = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  // Load name if already stored for this tab
  useEffect(() => {
    const savedName = sessionStorage.getItem('studentName');
    if (savedName) {
      navigate('/student-waiting');
    }
  }, [navigate]);

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem('studentName', name.trim());
      sessionStorage.setItem('tabId', `tab-${Date.now()}`);
      navigate('/student-waiting');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <span className="text-sm bg-primary text-white px-3 py-1 rounded-full mb-4">
        ✦ Intervue Poll
      </span>

      <h1 className="text-2xl sm:text-3xl font-semibold text-darkText mb-2">
        Let’s <span className="text-black font-bold">Get Started</span>
      </h1>

      <p className="text-grayText mb-6 text-sm sm:text-base max-w-md">
        If you’re a student, you’ll be able to <strong>submit your answers</strong>,
        participate in live polls, and see how your responses compare with your classmates.
      </p>

      <input
        type="text"
        placeholder="Enter your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-64 border border-gray-300 px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full transition-all"
        onClick={handleContinue}
        disabled={!name.trim()}
      >
        Continue
      </button>
    </div>
  );
};

export default StudentNameEntry;
