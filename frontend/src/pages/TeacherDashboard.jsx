import { useState, useEffect } from "react";
import CreatePollModal from "../components/teacher/CreatePollModal";
import LivePoll from "../components/teacher/LivePoll";
import ChatTab from "../components/teacher/ChatTab";
import ParticipantsTab from "../components/teacher/ParticipantsTab";
import PollHistory from '../components/teacher/PollHistory';
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const TeacherDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [poll, setPoll] = useState(null);
  const [pollEnded, setPollEnded] = useState(false);
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    socket.on("poll-started", (data) => {
      setPoll(data);
      setPollEnded(false);
    });

    socket.on("poll-ended", () => {
      setPollEnded(true);
    });

    return () => {
      socket.off("poll-started");
      socket.off("poll-ended");
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-darkText">
          Live Polling Dashboard
        </h1>
        <button
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-full"
          onClick={() => setShowModal(true)}
        >
          + Ask a New Question
        </button>
      </header>

      {showModal && (
        <CreatePollModal
          onClose={() => setShowModal(false)}
          onCreate={(data) => {
            setPoll(data);          // Set poll instantly
            setPollEnded(false);    // Ensure LivePoll shows
            setShowModal(false);
          }}
        />
      )}

      <div className="flex gap-6 border-b border-gray-200 text-darkText text-sm mb-6">
        {["live", "chat", "participants", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-grayText"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "live" && poll && !pollEnded && <LivePoll poll={poll} />}
        {activeTab === "live" && (!poll || pollEnded) && (
          <p className="text-grayText text-sm text-center">
            No active poll yet. Create one to begin.
          </p>
        )}

        {activeTab === "chat" && poll && <ChatTab pollId={poll._id} />}
        {activeTab === "chat" && !poll && (
          <p className="text-grayText text-sm text-center">
            Start a poll to enable chat.
          </p>
        )}

        {activeTab === "participants" && <ParticipantsTab />}
        {activeTab === "history" && <PollHistory />}
      </div>
    </div>
  );
};

export default TeacherDashboard;