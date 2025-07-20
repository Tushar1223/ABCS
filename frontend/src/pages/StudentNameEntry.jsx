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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <span className="text-sm bg-[#6B4EFF] text-white px-4 py-1 rounded-full mb-6 font-medium shadow-md">
        ✦ Intervue Poll
      </span>

      <h1 className="text-3xl sm:text-4xl font-medium text-black mb-4">
        Let’s <span className="font-extrabold">Get Started</span>
      </h1>

      <p className="text-[#6B6F76] text-sm sm:text-base max-w-md mb-8">
        If you’re a student, you’ll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
      </p>

      <div className="text-left w-full max-w-md mb-2">
        <label htmlFor="name" className="text-sm font-medium text-black mb-1 block">
          Enter your Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#F5F5F5] text-black px-4 py-3 rounded-md border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#6B4EFF]"
        />
      </div>

      <button
        className={`w-full max-w-md py-3 mt-4 rounded-full text-white font-medium text-base transition-all ${
          name.trim()
            ? 'bg-gradient-to-r from-[#6B4EFF] to-[#8F5CFF] hover:opacity-90'
            : 'bg-gradient-to-r from-[#ccc] to-[#ddd] cursor-not-allowed'
        }`}
        onClick={handleContinue}
        disabled={!name.trim()}
      >
        Continue
      </button>
    </div>
  );
};

export default StudentNameEntry;
