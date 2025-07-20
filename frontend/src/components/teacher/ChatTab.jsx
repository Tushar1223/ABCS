import { useEffect, useRef, useState } from 'react';
import socket from '../../socket';

const ChatTab = ({ pollId, sender = 'teacher' }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!pollId) return;

    fetch(`https://live-polling-system-59mk.onrender.com/api/messages/${pollId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      });

    const handleReceiveMessage = (msg) => {
      if (msg.pollId === pollId || msg.pollId === null) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    return () => socket.off('receive-message', handleReceiveMessage);
  }, [pollId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !sender) return;

    const messageData = {
      sender,
      message: text,
      pollId,
    };

    socket.emit('send-message', messageData);
    setText('');
  };

  return (
    <div className="p-4 h-80 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === sender ? 'text-right text-primary' : 'text-left text-black'
            }`}
          >
            <span className="text-sm">
              {msg.sender === sender ? 'You' : msg.sender}:
            </span>
            <p className="bg-white rounded p-2 inline-block max-w-[80%] shadow-sm mt-1">
              {msg.message}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex mt-2 gap-2">
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
          disabled={!text.trim() || !sender}
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatTab;
