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
      <div className="mb-6">
        <span className="inline-block bg-primary text-white text-xs px-3 py-1 rounded-full mb-3">✨ Intervue Poll</span>
        <h1 className="text-2xl font-bold text-darkText mb-1">Let’s <b>Get Started</b></h1>
        <p className="text-sm text-grayText">
          you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>
      </div>

      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-darkText">Enter your question</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="border bg-gray-100 px-3 py-1 text-sm rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {[30, 45, 60, 90].map((d) => (
            <option key={d} value={d}>{d} seconds</option>
          ))}
        </select>
      </div>

      <textarea
        className="w-full bg-gray-100 border-none px-4 py-3 rounded resize-none mb-6 focus:outline-none"
        placeholder="Type your question"
        value={question}
        maxLength={100}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className="text-right text-xs text-gray-400 mb-4">{question.length}/100</div>

      <div className="grid grid-cols-2 gap-6 mb-2">
        <label className="text-sm font-medium text-darkText">Edit Options</label>
        <label className="text-sm font-medium text-darkText">Is it Correct?</label>
      </div>

      <div className="space-y-3 mb-6">
        {options.map((opt, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">{idx + 1}</div>
              <input
                type="text"
                className="flex-1 bg-gray-100 border-none px-4 py-2 rounded focus:outline-none"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={correctAnswers[idx] === true}
                  onChange={() => handleCorrectAnswer(idx, true)}
                  className="accent-purple-600"
                /> Yes
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={correctAnswers[idx] === false}
                  onChange={() => handleCorrectAnswer(idx, false)}
                  className="accent-purple-600"
                /> No
              </label>
            </div>
          </div>
        ))}

        {options.length < 5 && (
          <button
            onClick={addOption}
            className="text-sm px-4 py-1.5 rounded border border-purple-600 text-purple-600 hover:bg-purple-50 transition-all"
          >
            + Add More option
          </button>
        )}
      </div>

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm"
        >
          Ask Question
        </button>
      </div>
    </div>
  );
};

export default TeacherLanding;
