import { useState } from 'react';
import ChatTab from '../teacher/ChatTab';
import { BsChatDots } from 'react-icons/bs';

const FloatingChat = ({ pollId, sender, allowChatWithoutPoll = false }) => {
  const [open, setOpen] = useState(false);

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
          <ChatTab pollId={pollId} sender={sender} />
        </div>
      )}
    </>
  );
};

export default FloatingChat;
