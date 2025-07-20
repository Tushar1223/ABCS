import { useState } from 'react';
import ChatTab from '../teacher/ChatTab';
import ParticipantsTabStudent from './ParticipantsTabStudent';
import { BsChatDots } from 'react-icons/bs';

const FloatingChat = ({ pollId, sender, allowChatWithoutPoll = false }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const isDisabled = !allowChatWithoutPoll && (!pollId || !sender);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            if (!isDisabled) setOpen((prev) => !prev);
          }}
          disabled={isDisabled}
          className={`p-3 rounded-full shadow-lg transition duration-300 ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary hover:bg-secondary text-white'
          }`}
        >
          <BsChatDots size={24} />
        </button>
      </div>

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white border rounded-lg shadow-lg">
          <div className="flex border-b">
            <button
              className={`w-1/2 py-2 text-sm font-medium ${
                activeTab === 'chat'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`w-1/2 py-2 text-sm font-medium ${
                activeTab === 'participants'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </button>
          </div>

          {activeTab === 'chat' ? (
            <ChatTab pollId={pollId} sender={sender} />
          ) : (
            <ParticipantsTabStudent />
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChat;
