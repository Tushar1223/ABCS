import { useState } from 'react';
import axios from 'axios';
import socket from '../../socket';

const TeacherLanding = ({ onPollCreated }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [duration, setDuration] = useState(60);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCorrectAnswer = (index, isCorrect) => {
    setCorrectAnswers((prev) => ({
      ...prev,
      [index]: isCorrect
    }));
  };

  const addOption = () => {
    if (options.length < 5) setOptions([...options, '']);
  };

  const handleSubmit = async () => {
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (!question.trim() || filteredOptions.length < 2) return;

    const response = await axios.post('https://live-polling-system-59mk.onrender.com/api/polls', {
      question,
      options: filteredOptions,
      duration,
      correctAnswers
    });

    socket.emit('poll-started', response.data);
    onPollCreated(response.data);
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-3xl mx-auto mt-12">
      <h1 className="text-2xl font-bold text-darkText mb-2">Let’s <b>Get Started</b></h1>
      <p className="text-sm text-grayText mb-6">
        you’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in real-time.
      </p>

      <div className="border border-gray-300 p-4 rounded-lg mb-4">
        <label className="block text-sm font-medium text-darkText mb-1">Enter your question</label>
        <textarea
          className="w-full border border-gray-200 px-4 py-2 rounded resize-none"
          placeholder="Type your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <label className="block text-sm font-medium text-darkText mb-1">Edit Options</label>
      <div className="space-y-2 mb-4">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <input
              type="text"
              className="w-full border border-gray-200 px-4 py-2 rounded"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Yes</label>
              <input
                type="radio"
                name={`correct-${idx}`}
                checked={correctAnswers[idx] === true}
                onChange={() => handleCorrectAnswer(idx, true)}
              />
              <label className="text-sm">No</label>
              <input
                type="radio"
                name={`correct-${idx}`}
                checked={correctAnswers[idx] === false}
                onChange={() => handleCorrectAnswer(idx, false)}
              />
            </div>
          </div>
        ))}
        {options.length < 5 && (
          <button onClick={addOption} className="text-sm text-primary hover:underline">
            + Add More option
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-darkText mb-1">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {[30, 45, 60, 90].map((d) => (
            <option key={d} value={d}>{d} seconds</option>
          ))}
        </select>
      </div>

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full"
        >
          Ask Question
        </button>
      </div>
    </div>
  );
};

export default TeacherLanding;
