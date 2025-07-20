import { useEffect, useState } from 'react';

const PollHistory = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetch('https://live-polling-system-59mk.onrender.com/api/polls/all')
      .then((res) => res.json())
      .then((data) => setPolls(data))
      .catch((err) => console.error('Failed to fetch history:', err));
  }, []);

  const renderPollResults = (poll, index) => {
    const totalVotes = Object.values(poll.result || {}).reduce((sum, val) => sum + val, 0);

    return (
      <div key={poll._id} className="mb-10">
        <p className="font-semibold text-lg text-black mb-2">Question {polls.length - index}</p>

        <div className="bg-gradient-to-r from-[#373737] to-[#6E6E6E] text-white font-semibold px-4 py-3 rounded-t-md">
          {poll.question}
        </div>

        <div className="border border-[#4F0DCE] rounded-b-md p-5 bg-[#F2F2F2] space-y-4">
          {poll.options.map((option, idx) => {
            const votes = poll.result?.[option] || 0;
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

            return (
              <div key={idx} className="relative bg-white rounded-md border border-gray-300 overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 h-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: '#7765DA',
                    zIndex: 0
                  }}>
                </div>

                <div className="relative flex items-center justify-between px-4 py-2 z-10">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-white bg-[#5767D0] px-2 py-1 rounded-full">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-black font-medium">{option}</span>
                  </div>
                  <span className="text-sm text-black font-semibold">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-black mb-6">
        View <span className="text-[#4F0DCE]">Poll History</span>
      </h2>
      {polls.length === 0 ? (
        <p className="text-sm text-gray-500">No polls available yet.</p>
      ) : (
        polls.map((poll, index) => renderPollResults(poll, index))
      )}
    </div>
  );
};

export default PollHistory;
