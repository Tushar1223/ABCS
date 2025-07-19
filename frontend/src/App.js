// src/App.js
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentNameEntry from './pages/StudentNameEntry';
import StudentWaiting from './pages/StudentWaiting';
import StudentQuestion from './pages/StudentQuestion';
import StudentResults from './pages/StudentResults';
import KickedPage from './pages/KickedPage';

function App() {
  const [poll, setPoll] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student-name" element={<StudentNameEntry />} />
        <Route path="/student-waiting" element={<StudentWaiting setPoll={setPoll} />} />
        <Route path="/student-question" element={<StudentQuestion poll={poll} />} />
        <Route path="/student-results" element={<StudentResults poll={poll} />} />
        <Route path="/kicked" element={<KickedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
