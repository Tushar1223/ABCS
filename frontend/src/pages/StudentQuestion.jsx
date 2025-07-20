import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingChat from '../components/student/FloatingChat';
import socket from '../../src/socket';

const StudentQuestion = ({ poll }) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [timer, setTimer] = useState(poll?.duration || 60);

  useEffect(() => {
    if (!poll) {
      navigate('/student-waiting');
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          navigate('/student-results');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [poll, navigate]);

  useEffect(() => {
    const handleKicked = () => {
      navigate('/kicked');
    };

    socket.on('kicked', handleKicked);
    return () => {
      socket.off('kicked', handleKicked);
    };
  }, [navigate]);

  const handleSubmit = () => {
    const studentName = sessionStorage.getItem('studentName');
    socket.emit('submit-answer', {
      pollId: poll._id,
      studentName,
      selectedOption,
    });
    navigate('/student-results');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10 relative">
      {/* Header: Question + Timer */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-black">Question 1</h3>
        <div className="flex items-center space-x-2 text-sm sm:text-base">
          <span>⏱️</span>
          <span className="text-red-600 font-medium">00:{String(timer).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Question Box */}
      <div className="w-full max-w-md border border-purple-300 rounded-md overflow-hidden shadow-sm">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3 text-sm font-semibold">
          {poll.question}
        </div>

        {/* Options */}
        <div className="bg-white p-4 space-y-3">
          {poll.options.map((option, index) => {
            const isSelected = selectedOption === option;
            return (
              <div
                key={index}
                onClick={() => setSelectedOption(option)}
                className={`flex items-center px-4 py-3 rounded-md cursor-pointer border transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-[#E5E5E5] bg-[#F7F7F7]'
                }`}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full mr-3 ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm text-black">{option}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        className={`mt-6 w-full max-w-xs py-3 rounded-full text-white font-medium text-base transition-all ${
          selectedOption
            ? 'bg-gradient-to-r from-[#6B4EFF] to-[#8F5CFF] hover:opacity-90'
            : 'bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed'
        }`}
        onClick={handleSubmit}
        disabled={!selectedOption}
      >
        Submit
      </button>

      {/* Floating Chat */}
      <FloatingChat
        pollId={poll._id}
        sender={sessionStorage.getItem('studentName')}
      />
    </div>
  );
};

export default StudentQuestion;
