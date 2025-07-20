import { useEffect, useState } from 'react';
import socket from '../../socket';

const LivePoll = ({ poll, onAskNew }) => {
  const [results, setResults] = useState({});

  useEffect(() => {
    socket.on('poll-results', (data) => {
      setResults(data);
    });

    return () => {
      socket.off('poll-results');
    };
  }, []);

  const totalVotes = Object.values(results).reduce((sum, val) => sum + val, 0);

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-4">
      <h2 className="text-lg font-semibold text-darkText mb-2">Question</h2>

      <div className="bg-gradient-to-r from-gray-700 to-gray-500 text-white rounded-t-md px-4 py-2 font-semibold">
        {poll.question}
      </div>

      <div className="border border-purple-200 rounded-b-md px-4 py-4 space-y-4">
        {poll.options.map((option, idx) => {
          const voteCount = results[option] || 0;
          const percentage = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;

          return (
            <div key={idx} className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-primary opacity-90 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
              <div className="relative flex items-center justify-between px-4 py-2 z-10">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </div>
                  <span className="text-darkText font-medium">{option}</span>
                </div>
                <span className="text-darkText font-medium">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={onAskNew}
          className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-secondary"
        >
          + Ask a new question
        </button>
      </div>
    </div>
  );
};

export default LivePoll;