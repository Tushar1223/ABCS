import React, { useEffect, useRef, useState } from 'react';
import ParticipantsTab from './ParticipantsTab';
import { FaComments } from 'react-icons/fa';
import socket from '../../socket'; // Replace with your backend if needed

const FloatingChat = ({ pollId, sender = 'teacher' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
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

    const messageData = {
      sender,
      message: text,
      pollId,
    };

    socket.emit('send-message', messageData);
    setText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col border border-gray-300">
          <div className="flex border-b border-gray-300">
            <button
              className={`w-1/2 py-2 text-sm font-medium ${activeTab === 'chat' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`w-1/2 py-2 text-sm font-medium ${activeTab === 'participants' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'chat' ? (
              <div className="flex flex-col h-full justify-between">
                <div className="overflow-y-auto max-h-60">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-2 ${msg.sender === sender ? 'text-right text-purple-600' : 'text-left text-black'}`}
                    >
                      <span className="text-sm">{msg.sender === sender ? 'You' : msg.sender}:</span>
                      <p className="bg-gray-100 rounded px-3 py-1 inline-block max-w-[80%] shadow-sm mt-1">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={handleSend}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <ParticipantsTab />
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
      >
        <FaComments size={20} />
      </button>
    </div>
  );
};

export default FloatingChat;
