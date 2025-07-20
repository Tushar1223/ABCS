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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative">
      <h2 className="text-xl font-bold text-darkText mb-2 text-center">{poll.question}</h2>
      <p className="text-grayText mb-6 text-sm">You have {timer} seconds left to answer</p>

      <div className="w-full max-w-md space-y-4 mb-6">
        {poll.options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`w-full cursor-pointer p-4 rounded border ${
              selectedOption === option
                ? 'border-primary bg-lightPurple text-white'
                : 'border-gray-300'
            }`}
          >
            {option}
          </div>
        ))}
      </div>

      <button
        className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!selectedOption}
      >
        Submit Answer
      </button>

      <FloatingChat
        pollId={poll._id}
        sender={sessionStorage.getItem('studentName')}
      />
    </div>
  );
};

export default StudentQuestion;
