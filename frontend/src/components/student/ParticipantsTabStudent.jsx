import { useEffect, useState } from "react";
import socket from "../../socket";

const ParticipantsTabStudent = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    socket.emit("get-students");

    socket.on("student-list", (data) => setStudents(data));
    socket.on("student-joined", (student) =>
      setStudents((prev) => [...prev, student])
    );
    socket.on("student-kicked", (tabId) =>
      setStudents((prev) => prev.filter((s) => s.tabId !== tabId))
    );

    return () => {
      socket.off("student-list");
      socket.off("student-joined");
      socket.off("student-kicked");
    };
  }, []);

  return (
    <div className="p-4 h-80 overflow-y-auto">
      <div className="border-b pb-2 mb-2">
        <p className="text-sm font-semibold text-gray-700">Name</p>
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-gray-500">No participants yet.</p>
      ) : (
        <ul className="space-y-2">
          {students.map((student) => (
            <li
              key={student.tabId}
              className="text-sm text-black font-medium"
            >
              {student.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParticipantsTabStudent;
