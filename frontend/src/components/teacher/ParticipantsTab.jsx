import { useEffect, useState } from 'react';
import socket from '../../socket';

const ParticipantsTab = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    socket.emit('get-students');
    socket.on('student-list', setStudents);
    socket.on('student-joined', (s) => setStudents((prev) => [...prev, s]));
    socket.on('student-kicked', (id) => setStudents((prev) => prev.filter((s) => s.tabId !== id)));

    return () => {
      socket.off('student-list');
      socket.off('student-joined');
      socket.off('student-kicked');
    };
  }, []);

  const kickStudent = (tabId) => socket.emit('kick-student', tabId);

  return (
    <div className="p-4 text-sm">
      {students.length === 0 ? (
        <p className="text-sm text-gray-500">No students connected.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 text-xs border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.tabId} className="border-b last:border-0">
                <td className="py-2 font-semibold text-black">{s.name}</td>
                <td className="py-2">
                  <button
                    onClick={() => kickStudent(s.tabId)}
                    className="text-primary hover:underline"
                  >
                    Kick out
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParticipantsTab;
