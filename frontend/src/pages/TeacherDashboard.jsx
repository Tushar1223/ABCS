import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LivePoll from "../components/teacher/LivePoll";
import TeacherLanding from "../components/teacher/TeacherLanding";
import FloatingChat from "../components/teacher/FloatingChat";
import io from "socket.io-client";
import { BsEye } from "react-icons/bs";

const socket = io("https://live-polling-system-59mk.onrender.com");

const TeacherDashboard = () => {
  const [poll, setPoll] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("poll-started", (data) => setPoll(data));
    socket.on("poll-ended", () => setPoll(null));
    return () => {
      socket.off("poll-started");
      socket.off("poll-ended");
    };
  }, []);

  const handleAskNew = () => {
    setPoll(null);
  };
  return (
    <div className="min-h-screen bg-white px-6 py-10 relative">
      {/* Poll History Button */}
      {poll && (
        <button
          onClick={() => navigate("/poll-history")}
          className="absolute top-6 right-6 bg-[#7765DA] hover:bg-[#5f4ccf] text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow"
        >
          <BsEye size={18} />
          View Poll history
        </button>
      )}

      {!poll ? (
        <TeacherLanding onPollCreated={setPoll} />
      ) : (
<LivePoll poll={poll} onAskNew={handleAskNew}/>      )}
      {poll && <FloatingChat pollId={poll._id} sender="teacher" />}
    </div>
  );
};

export default TeacherDashboard;
