import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatTab = ({ pollId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch past messages
    fetch(`http://localhost:5000/api/messages/${pollId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('receive-message');
  }, [pollId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    const messageData = {
      sender: 'teacher',
      message: text,
      pollId,
    };

    socket.emit('send-message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setText('');
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="bg-lightBg rounded-lg border border-gray-300 p-4 h-80 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === 'teacher' ? 'text-right text-primary' : 'text-left text-black'
            }`}
          >
            <span className="text-sm">{msg.sender === 'teacher' ? 'You' : msg.sender}:</span>
            <p className="bg-white rounded p-2 inline-block max-w-[80%] shadow-sm mt-1">
              {msg.message}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary"
          placeholder="Type your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatTab;
