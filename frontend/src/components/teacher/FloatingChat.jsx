import React, { useEffect, useRef, useState } from 'react';
import ParticipantsTab from './ParticipantsTab';
import { FaComments } from 'react-icons/fa';
import socket from '../../socket';

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
        <div className="bg-white rounded-md shadow-xl w-[360px] h-[400px] flex flex-col border border-gray-200 overflow-hidden">
          {/* Tab Switch Header */}
          <div className="flex border-b border-gray-300 text-sm font-semibold text-darkText">
            <button
              className={`w-1/2 py-2 ${activeTab === 'chat' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`w-1/2 py-2 ${activeTab === 'participants' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 bg-white text-sm">
            {activeTab === 'chat' ? (
              <div className="flex flex-col h-full justify-between">
                <div className="overflow-y-auto max-h-60 pr-1">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-3 max-w-[85%] ${msg.sender === sender ? 'ml-auto text-right' : ''}`}
                    >
                      <div className={`text-xs mb-1 ${msg.sender === sender ? 'text-primary' : 'text-darkText'}`}>
                        {msg.sender === sender ? 'You' : msg.sender}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-lg text-sm ${
                          msg.sender === sender
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-gray-200 text-darkText rounded-bl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Box */}
                <div className="flex mt-2 gap-2">
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
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={handleSend}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700"
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

      {/* Floating Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
      >
        <FaComments size={20} />
      </button>
    </div>
  );
};

export default FloatingChat;
