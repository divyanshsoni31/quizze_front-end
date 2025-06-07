// File: src/pages/JoinQuiz.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import bulb1 from '../assets/icon-bulb1.png';
import pencil1 from '../assets/icon-pencil1.png';
import trophy1 from '../assets/icon-trophy1.png';
import question1 from '../assets/icon-question1.png';
import BackToDashboardButton from '../components/BackToDashboardButton';

export default function JoinQuiz() {
  const navigate = useNavigate();
  const [quizCodeInput, setQuizCodeInput] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    const enteredCode = quizCodeInput.trim().toUpperCase();

    // 🔍 Search through all creators' quizzes
    const getQuizByCode = (code) => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('quizzes_'));
      for (const key of keys) {
        const quizzes = JSON.parse(localStorage.getItem(key)) || [];
        const found = quizzes.find(q => q.code === code);
        if (found) return found;
      }
      return null;
    };

    const matchedQuiz = getQuizByCode(enteredCode);

    if (matchedQuiz) {
      const userEmail = localStorage.getItem('userEmail');
      const existingResults = JSON.parse(localStorage.getItem(`attemptedResults_${matchedQuiz.code}`)) || [];
      const alreadyAttempted = existingResults.some(r => r.studentEmail === userEmail);

      if (alreadyAttempted) {
        setError('❌ You have already attempted this quiz.');
        return;
      }

      localStorage.setItem('finalQuizMeta', JSON.stringify({ ...matchedQuiz.meta, code: matchedQuiz.code }));
      localStorage.setItem('finalQuizQuestions', JSON.stringify(matchedQuiz.questions));
      localStorage.setItem('studentAnswers', JSON.stringify({}));
      navigate('/attempt-quiz');
    } else {
      setError('❌ Invalid Quiz Code. Please try again.');
    }
  };

  const handleBack = () => {
    const fromPage = localStorage.getItem('fromPage');
    const role = localStorage.getItem('userRole');

    if (fromPage === 'preview' && role === 'creator') {
      localStorage.removeItem('fromPage');
      navigate('/preview-quiz');
    } else if (role === 'student') {
      navigate('/student');
    } else {
      navigate('/creator');
    }
  };

  return (
    <div className="position-relative d-flex flex-column" style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#fff',
      overflow: 'hidden',
    }}>
      {/* Background Icons */}
      <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '39%', left: '8%', width: '185px' }} />
      <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '5%', width: '205px' }} />
      <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '1%', left: '92.5%', transform: 'translateX(-49%)', width: '210px', zIndex: 0 }} />
      <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '34%', right: '2%', width: '215px' }} />

      {/* Header */}
      <div className="text-white pt-4 pb-3 px-4" style={{
        background: 'linear-gradient(to right, #015794, #437FAA)',
        borderBottomLeftRadius: '80px',
        borderBottomRightRadius: '80px',
        width: '100%',
        zIndex: 1
      }}>
        <div className="container d-flex justify-content-between align-items-start">
          <img src={logo} alt="Logo" style={{ width: '160px' }} />
          <BackToDashboardButton className="btn btn-outline-light fw-bold" text="Back" />
        </div>
        <div className="text-center mt-3">
          <h1 className="fw-bold">Join A Quiz</h1>
          <p className="lead">Got the code? Game on!</p>
        </div>
      </div>

      {/* Join Box */}
      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 mt-4">
        <div className="bg-white shadow rounded p-4" style={{ width: '100%', maxWidth: '600px' }}>
          <h4 className="mb-3 text-center">Enter Quiz Code</h4>
          <input
            type="text"
            className="form-control mb-3 shadow-sm text-center fs-5"
            placeholder="Unlock the Quiz , Let the Brain Games Begin!"
            value={quizCodeInput}
            onChange={(e) => {
              setQuizCodeInput(e.target.value);
              setError('');
            }}
          />
          {error && <div className="text-danger text-center fw-semibold mb-3">{error}</div>}
          <div className="text-center">
            <button className="btn btn-primary px-5" onClick={handleJoin}>Join</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-5 mb-3">
        <p className="text-muted">&copy; 2025 QUIZZE. All rights reserved.</p>
      </footer>
    </div>
  );
}





















// // File: src/pages/JoinQuiz.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';
// import bulb1 from '../assets/icon-bulb1.png';
// import pencil1 from '../assets/icon-pencil1.png';
// import trophy1 from '../assets/icon-trophy1.png';
// import question1 from '../assets/icon-question1.png';
// import BackToDashboardButton from '../components/BackToDashboardButton';

// export default function JoinQuiz() {
//   const navigate = useNavigate();
//   const [quizCodeInput, setQuizCodeInput] = useState('');
//   const [error, setError] = useState('');

//   // ✅ Handle joining the quiz
//  const handleJoin = () => {
//   const enteredCode = quizCodeInput.trim().toUpperCase();

//   const getQuizByCode = (code) => {
//     const keys = Object.keys(localStorage).filter(k => k.startsWith('quizzes_'));
//     for (const key of keys) {
//       const quizzes = JSON.parse(localStorage.getItem(key)) || [];
//       const found = quizzes.find(q => q.code === code);
//       if (found) return found;
//     }
//     return null;
//   };

//   const matchedQuiz = getQuizByCode(enteredCode);

//   if (matchedQuiz) {
//     localStorage.setItem('finalQuizMeta', JSON.stringify({ ...matchedQuiz.meta, code: matchedQuiz.code }));
//     localStorage.setItem('finalQuizQuestions', JSON.stringify(matchedQuiz.questions));
//     localStorage.setItem('studentAnswers', JSON.stringify({}));
//     navigate('/attempt-quiz');
//   } else {
//     setError('❌ Invalid Quiz Code. Please try again.');
//   }
// };


//   // 🔙 Handle Back navigation based on user role or source page
//   const handleBack = () => {
//     const fromPage = localStorage.getItem('fromPage');
//     const role = localStorage.getItem('userRole');

//     if (fromPage === 'preview' && role === 'creator') {
//       localStorage.removeItem('fromPage');
//       navigate('/preview-quiz');
//     } else if (role === 'student') {
//       navigate('/student');
//     } else {
//       navigate('/creator');
//     }
//   };

//   return (
//     <div className="position-relative d-flex flex-column" style={{
//       minHeight: '100vh',
//       width: '100vw',
//       backgroundColor: '#fff',
//       overflow: 'hidden',
//     }}>
//       {/* Background Icons */}
//       <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '39%', left: '8%', width: '185px' }} />
//       <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '5%', width: '205px' }} />
//       <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '1%', left: '92.5%', transform: 'translateX(-49%)', width: '210px', zIndex: 0 }} />
//       <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '34%', right: '2%', width: '215px' }} />

//       {/* Header */}
//       <div className="text-white pt-4 pb-3 px-4" style={{
//         background: 'linear-gradient(to right, #015794, #437FAA)',
//         borderBottomLeftRadius: '80px',
//         borderBottomRightRadius: '80px',
//         width: '100%',
//         zIndex: 1
//       }}>
//         <div className="container d-flex justify-content-between align-items-start">
//           <img src={logo} alt="Logo" style={{ width: '160px' }} />
//           <BackToDashboardButton className="btn btn-outline-light fw-bold" text="Back" />
//         </div>
//         <div className="text-center mt-3">
//           <h1 className="fw-bold">Join A Quiz</h1>
//           <p className="lead">Got the code? Game on!</p>
//         </div>
//       </div>

//       {/* Join Box */}
//       <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 mt-4">
//         <div className="bg-white shadow rounded p-4" style={{ width: '100%', maxWidth: '600px' }}>
//           <h4 className="mb-3 text-center">Enter Quiz Code</h4>
//           <input
//             type="text"
//             className="form-control mb-3 shadow-sm text-center fs-5"
//             placeholder="Enter the quiz code"
//             value={quizCodeInput}
//             onChange={(e) => {
//               setQuizCodeInput(e.target.value);
//               setError('');
//             }}
//           />
//           {error && <div className="text-danger text-center fw-semibold mb-3">{error}</div>}
//           <div className="text-center">
//             <button className="btn btn-primary px-5" onClick={handleJoin}>Join</button>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="text-center mt-5 mb-3">
//         <p className="text-muted">&copy; 2025 QUIZZE. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }
