import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Register from './pages/Register';
import OtpVerification from './pages/OtpVerification'; // ✅ Add this line
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import JoinQuiz from './pages/JoinQuiz';
import CreateQuiz from './pages/CreateQuiz';
import QuestionBank from './pages/QuestionBank';
import PreviewQuiz from './pages/PreviewQuiz';
import AttemptQuiz from './pages/AttemptQuiz';






function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<OtpVerification />} /> {/* ✅ Add this line */}
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/creator" element={<CreatorDashboard />} />
        <Route path="/join-quiz" element={<JoinQuiz />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/preview-quiz" element={<PreviewQuiz />} />
        <Route path="/attempt-quiz" element={<AttemptQuiz />} />
      


      </Routes>
    </BrowserRouter>
  );
}

export default App;
