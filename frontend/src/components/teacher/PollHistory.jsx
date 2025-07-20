import { useEffect, useState } from 'react';

const PollHistory = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetch('https://live-polling-system-59mk.onrender.com/api/polls/all')
      .then((res) => res.json())
      .then((data) => setPolls(data))
      .catch((err) => console.error('Failed to fetch history:', err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-4 text-darkText">Poll History</h2>

      {polls.length === 0 ? (
        <p className="text-sm text-grayText">No polls available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200 text-sm text-left">
            <thead className="bg-lightBg text-darkText">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Question</th>
                <th className="px-4 py-2 border">Duration (s)</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll, idx) => (
                <tr key={poll._id} className="border-t">
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border">{poll.question}</td>
                  <td className="px-4 py-2 border">{poll.duration}</td>
                  <td className="px-4 py-2 border">
                    {new Date(poll.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PollHistory;
