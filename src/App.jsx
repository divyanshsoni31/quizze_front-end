// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Splash from './pages/Splash';
// import Register from './pages/Register';
// import OtpVerification from './pages/OtpVerification'; // ✅ Add this line
// import Login from './pages/Login';
// import StudentDashboard from './pages/StudentDashboard';
// import CreatorDashboard from './pages/CreatorDashboard';
// import JoinQuiz from './pages/JoinQuiz';
// import CreateQuiz from './pages/CreateQuiz';
// import QuestionBank from './pages/QuestionBank';
// import PreviewQuiz from './pages/PreviewQuiz';
// import AttemptQuiz from './pages/AttemptQuiz';
// import ManageQuiz from './pages/ManageQuiz';
// import ResultPage from './pages/ResultPage';
// import ViewResults from './pages/ViewResults';
// import PrivateRoute from './components/PrivateRoute';
// import StudentResults from './pages/StudentResults';







// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Splash />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/verify" element={<OtpVerification />} /> {/* ✅ Add this line */}
//         <Route path="/login" element={<Login />} />
//        <Route
//         path="/student"
//          element={
//          <PrivateRoute allowedRoles={['student']}>
//          <StudentDashboard />
//         </PrivateRoute>
//                 }
//                 />
//         <Route
//         path="/creator"
//          element={
//         <PrivateRoute allowedRoles={['creator']}>
//         <CreatorDashboard />
//      </PrivateRoute>
//                  }
//                 />
//         <Route path="/join-quiz" element={<JoinQuiz />} />
//         <Route path="/create-quiz" element={<CreateQuiz />} />
//         <Route path="/question-bank" element={<QuestionBank />} />
//         <Route path="/preview-quiz" element={<PreviewQuiz />} />
//         <Route path="/attempt-quiz" element={<AttemptQuiz />} />
//         <Route path="/manage-quiz" element={<ManageQuiz />} />
//         <Route path="/result" element={<ResultPage />} />
//         <Route path="/view-results" element={<ViewResults />} />
//         <Route path="/student-results" element={<StudentResults />} />


      


//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Splash from './pages/Splash';
import Register from './pages/Register';
import OtpVerification from './pages/OtpVerification';
import Login from './pages/Login';

import StudentDashboard from './pages/StudentDashboard';
import CreatorDashboard from './pages/CreatorDashboard';

import JoinQuiz from './pages/JoinQuiz';
import CreateQuiz from './pages/CreateQuiz';
import QuestionBank from './pages/QuestionBank';
import PreviewQuiz from './pages/PreviewQuiz';
import AttemptQuiz from './pages/AttemptQuiz';
import ManageQuiz from './pages/ManageQuiz';

import ResultPage from './pages/ResultPage';
import ViewResults from './pages/ViewResults';
import StudentResults from './pages/StudentResults';

import ProtectedRoute from './components/ProtectedRoute';
import Certificate from './pages/Certificate';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<OtpVerification />} />
        <Route path="/login" element={<Login />} />

        {/* Protected: Student Only */}
        <Route path="/student" element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        {/* <Route path="/student-results" element={
          <ProtectedRoute role="student">
            <StudentResults />
          </ProtectedRoute>
        } /> */}
<Route path="/student-results" element={< StudentResults />} />
        {/* Protected: Creator Only */}
        <Route path="/creator" element={
          <ProtectedRoute role="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-quiz" element={
          <ProtectedRoute role="creator">
            <CreateQuiz />
          </ProtectedRoute>
        } />
        <Route path="/question-bank" element={
          <ProtectedRoute role="creator">
            <QuestionBank />
          </ProtectedRoute>
        } />
        <Route path="/preview-quiz" element={
          <ProtectedRoute role="creator">
            <PreviewQuiz />
          </ProtectedRoute>
        } />
        <Route path="/manage-quiz" element={
          <ProtectedRoute role="creator">
            <ManageQuiz />
          </ProtectedRoute>
        } />
        <Route path="/view-results" element={
          <ProtectedRoute role="creator">
            <ViewResults />
          </ProtectedRoute>
        } />
        

        {/* Shared Route */}
        <Route path="/join-quiz" element={<JoinQuiz />} />
        <Route path="/attempt-quiz" element={<AttemptQuiz />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/certificate" element={<Certificate />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
