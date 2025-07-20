import { useState, useEffect } from "react";
import LivePoll from "../components/teacher/LivePoll";
import TeacherLanding from "../components/teacher/TeacherLanding";
import PollHistory from '../components/teacher/PollHistory';
import FloatingChat from '../components/teacher/FloatingChat';
import io from "socket.io-client";

const socket = io("https://live-polling-system-59mk.onrender.com");

const TeacherDashboard = () => {
  const [poll, setPoll] = useState(null);
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    socket.on("poll-started", (data) => setPoll(data));
    socket.on("poll-ended", () => setPoll(null));
    return () => {
      socket.off("poll-started");
      socket.off("poll-ended");
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-darkText">Live Polling Dashboard</h1>
        <div className="flex gap-6 border-b border-gray-200 text-darkText text-sm">
          {["live", "history"].map((tab) => (
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
      </header>

      <div className="mt-4">
        {activeTab === "live" && !poll && (
          <TeacherLanding onPollCreated={setPoll} />
        )}
        {activeTab === "live" && poll && <LivePoll poll={poll} />}
        {activeTab === "history" && <PollHistory />}
      </div>

      {poll && <FloatingChat pollId={poll._id} sender="teacher" />}
    </div>
  );
};

export default TeacherDashboard;
