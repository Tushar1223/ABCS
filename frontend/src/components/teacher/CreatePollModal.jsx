import { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import socket from '../../socket'; // place outside component if not SSR

const CreatePollModal = ({ onClose, onCreate }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 5) setOptions([...options, '']);
  };

  const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await axios.post('https://live-polling-system-59mk.onrender.com/api/polls', {
      question,
      options: options.filter(opt => opt.trim() !== ''),
      duration
    });

    const createdPoll = response.data;

    socket.emit('poll-started', createdPoll); // send to all
    onCreate(createdPoll); // ✅ this was missing!
    onClose();
  } catch (err) {
    console.error('❌ Failed to create poll', err);
  } finally {
    setLoading(false);
  }
};

  return createPortal(
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold text-darkText mb-4">Create New Poll</h2>

        <label className="block text-sm text-darkText mb-1">Question</label>
        <input
          type="text"
          className="w-full border border-gray-300 px-4 py-2 rounded mb-4 focus:ring-2 focus:ring-primary"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <label className="block text-sm text-darkText mb-1">Options</label>
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded mb-2 focus:ring-2 focus:ring-primary"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
          />
        ))}

        {options.length < 5 && (
          <button
            onClick={addOption}
            className="text-sm text-primary hover:underline mb-4"
          >
            + Add another option
          </button>
        )}

        <label className="block text-sm text-darkText mb-1">Duration (in seconds)</label>
        <input
          type="number"
          className="w-full border border-gray-300 px-4 py-2 rounded mb-6 focus:ring-2 focus:ring-primary"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Poll'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreatePollModal;
