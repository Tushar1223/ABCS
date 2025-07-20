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
    if (!text.trim()) return;
    const messageData = { sender, message: text, pollId };
    socket.emit('send-message', messageData);
    setText('');
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, idx) => {
          const isMe = msg.sender === sender;
          return (
            <div
              key={idx}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span
                className={`text-xs font-semibold mb-1 ${
                  isMe ? 'text-purple-600' : 'text-purple-600'
                }`}
              >
                {isMe ? 'You' : msg.sender}
              </span>
              <div
                className={`px-4 py-2 rounded-lg text-sm text-white max-w-[75%] ${
                  isMe ? 'bg-purple-500' : 'bg-black'
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatTab;
