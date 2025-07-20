import { useEffect, useState } from 'react';
import socket from '../../socket';

const ParticipantsTab = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    socket.emit('get-students');

    socket.on('student-list', (data) => {
      setStudents(data);
    });

    socket.on('student-joined', (student) => {
      setStudents((prev) => [...prev, student]);
    });

    socket.on('student-kicked', (tabId) => {
      setStudents((prev) => prev.filter((s) => s.tabId !== tabId));
    });

    return () => {
      socket.off('student-list');
      socket.off('student-joined');
      socket.off('student-kicked');
    };
  }, []);

  const kickStudent = (tabId) => {
    socket.emit('kick-student', tabId);
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-4 text-darkText">Participants</h2>

      {students.length === 0 ? (
        <p className="text-sm text-grayText">No students connected.</p>
      ) : (
        <ul className="space-y-2">
          {students.map((student) => (
            <li
              key={student.tabId}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span className="text-darkText">{student.name}</span>
              <button
                onClick={() => kickStudent(student.tabId)}
                className="text-sm text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50"
              >
                Kick
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParticipantsTab;
