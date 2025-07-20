import { useEffect, useState } from 'react';
import socket from '../../socket';

const LivePoll = ({ poll, questionNumber = 1, onAskNewQuestion }) => {
  const [results, setResults] = useState({});

  useEffect(() => {
    socket.on('poll-results', (data) => {
      setResults(data);
    });

    return () => {
      socket.off('poll-results');
    };
  }, []);

  const totalVotes = Object.values(results).reduce((acc, val) => acc + val, 0);

  const getPercentage = (option) => {
    const votes = results[option] || 0;
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative">
        <h3 className="text-sm text-primary font-semibold mb-1">Question {questionNumber}</h3>
        <h2 className="text-lg font-bold text-darkText mb-6">{poll.question}</h2>

        <div className="space-y-3">
          {poll.options.map((option, index) => {
  const percentage = getPercentage(option);
  return (
<div className="relative bg-gray-100 rounded-lg overflow-hidden h-10 mb-3">
  {percentage > 0 && (
    <div
      className="absolute top-0 left-0 h-full bg-[#7F56D9] rounded-l-lg transition-all duration-500 ease-in-out"
      style={{ width: `${percentage}%`, zIndex: 0 }}
    ></div>
  )}
  
  <div className="relative z-10 flex items-center h-full px-4">
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-300 text-xs font-bold text-[#7F56D9] mr-3">
      {index + 1}
    </div>
    <span className="text-sm font-medium text-darkText">{option}</span>
    <span className="ml-auto text-sm font-semibold text-darkText">{percentage}%</span>
  </div>
</div>

  );
})}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">Wait for the teacher to ask a new question...</p>
          {onAskNewQuestion && (
            <button
              className="bg-[#7F56D9] hover:bg-[#6942C2] text-white px-6 py-2 rounded-full font-semibold text-sm shadow"
              onClick={onAskNewQuestion}
            >
              + Ask a new question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePoll;
