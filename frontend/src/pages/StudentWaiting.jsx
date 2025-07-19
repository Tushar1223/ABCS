import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // replace with deployed URL if needed

const StudentWaiting = ({ setPoll }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const name = sessionStorage.getItem('studentName');
    const tabId = sessionStorage.getItem('tabId');

    if (!name || !tabId) {
      navigate('/');
      return;
    }

    // join student room
    socket.emit('join-student', { name, tabId });

    const handlePollStarted = (poll) => {
      setPoll(poll);
      navigate('/student-question');
    };

    const handleKicked = () => {
      navigate('/kicked');
    };

    socket.on('poll-started', handlePollStarted);
    socket.on('kicked', handleKicked);

    return () => {
      socket.off('poll-started', handlePollStarted);
      socket.off('kicked', handleKicked);
    };
  }, [navigate, setPoll]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <span className="text-sm bg-primary text-white px-3 py-1 rounded-full mb-4">
        ✦ Intervue Poll
      </span>

      <div className="text-2xl font-semibold mb-3 text-darkText">Wait for the teacher to ask questions...</div>

      <div className="animate-spin rounded-full border-4 border-primary border-t-transparent w-10 h-10" />
    </div>
  );
};

export default StudentWaiting;
