import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingChat from '../components/student/FloatingChat';
import socket from '../../src/socket';

const StudentResults = ({ poll }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState({});
  const [remainingTime, setRemainingTime] = useState(0); // Initialize to 0

  useEffect(() => {
    if (!poll) {
      navigate('/student-waiting');
      return;
    }

    // Listen for result updates
    socket.on('poll-results', (data) => {
      setResults(data);
    });

    // Read answeredAt timestamp and compute end time
    const answeredAt = parseInt(sessionStorage.getItem('answeredAt'), 10);

    if (isNaN(answeredAt)) {
      setRemainingTime(0);
      return;
    }

    const pollEndTime = answeredAt + poll.duration * 1000;

    // Initial calculation
    const updateRemainingTime = () => {
      const now = Date.now();
      const remaining = Math.floor((pollEndTime - now) / 1000);
      setRemainingTime(Math.max(0, remaining));
    };

    updateRemainingTime(); // Set immediately

    // Interval to recalculate based on live time
    const interval = setInterval(() => {
      updateRemainingTime();
    }, 1000);

    return () => {
      clearInterval(interval);
      socket.off('poll-results');
    };
  }, [poll, navigate]);

  // Handle user kicked
  useEffect(() => {
    const handleKicked = () => {
      navigate('/kicked');
    };

    socket.on('kicked', handleKicked);
    return () => {
      socket.off('kicked', handleKicked);
    };
  }, [navigate]);

  const totalVotes = poll.options.reduce((sum, opt) => sum + (results[opt] || 0), 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10 relative">
      {/* Header: Question + Timer */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-black">Question 1</h3>
        <div className="flex items-center space-x-2 text-sm sm:text-base">
          <span>⏱️</span>
          <span className="text-red-600 font-medium">
            00:{String(remainingTime).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Question Box */}
      <div className="w-full max-w-md border border-purple-300 rounded-md overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3 text-sm font-semibold">
          {poll.question}
        </div>

        <div className="bg-white p-4 space-y-3">
          {poll.options.map((option, index) => {
            const count = results[option] || 0;
            const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
            return (
              <div key={index} className="relative w-full border rounded-md overflow-hidden bg-[#F7F7F7]">
                {/* Bar background */}
                <div
                  className="absolute top-0 left-0 h-full bg-[#7562E0]"
                  style={{ width: `${percent}%` }}
                ></div>

                {/* Content over bar */}
                <div className="relative flex items-center justify-between px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full mr-3 z-10 bg-white border border-gray-400">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-black z-10">{option}</span>
                  </div>
                  <span className="text-sm font-semibold text-black z-10">{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-center font-semibold text-black">
        Wait for the teacher to ask a new question..
      </p>

      <FloatingChat
        pollId={poll._id}
        sender={sessionStorage.getItem('studentName')}
      />
    </div>
  );
};

export default StudentResults;