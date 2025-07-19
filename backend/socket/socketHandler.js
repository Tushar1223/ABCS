import Poll from '../models/Poll.js';
import Response from '../models/Response.js';
import Message from '../models/Message.js';
import { buildPollResult } from '../utils/socketUtils.js';

const connectedStudents = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Student joins
    socket.on('join-student', ({ name, tabId }) => {
      connectedStudents.set(tabId, { socketId: socket.id, name, tabId });
      socket.join('students');
      io.emit('student-joined', { name, tabId });
      console.log(`✅ ${name} joined with tab ${tabId}`);
    });

    // Teacher requests list of students
    socket.on('get-students', () => {
      const studentList = Array.from(connectedStudents.values());
      io.to(socket.id).emit('student-list', studentList);
    });

    // Teacher starts poll (emitted manually via socket)
    socket.on('poll-started', (pollData) => {
      io.to('students').emit('poll-started', pollData); // Send to all students
      socket.emit('poll-started', pollData); // Echo to teacher if needed

      setTimeout(() => {
        io.emit('poll-ended');
      }, (pollData.duration || 60) * 1000);
    });

    // Student submits answer
    socket.on('submit-answer', async (data) => {
      const { pollId, studentName, selectedOption } = data;
      try {
        await Response.create({ pollId, studentName, selectedOption });
        const responses = await Response.find({ pollId });
        const counts = buildPollResult(responses);
        io.emit('poll-results', counts);
      } catch (err) {
        console.error('❌ Error saving response:', err);
      }
    });

    // Chat messages
    socket.on('send-message', async ({ sender, message, pollId }) => {
      const saved = await Message.create({ sender, message, pollId });
      io.emit('receive-message', saved);
    });

    // Kick a student
    socket.on('kick-student', (tabId) => {
      const student = connectedStudents.get(tabId);
      if (student) {
        io.to(student.socketId).emit('kicked');
        connectedStudents.delete(tabId);
        io.emit('student-kicked', tabId);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;
