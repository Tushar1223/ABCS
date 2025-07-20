import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import socket from '../../socket';

const LivePoll = ({ poll }) => {
  const [results, setResults] = useState({});

  useEffect(() => {
    socket.on('poll-results', (data) => {
      setResults(data);
    });

    return () => {
      socket.off('poll-results');
    };
  }, []);

  const chartData = poll.options.map((opt) => ({
    option: opt,
    votes: results[opt] || 0
  }));

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-darkText text-center mb-3">{poll.question}</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="option" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="votes" fill="#4F0DCE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LivePoll;
