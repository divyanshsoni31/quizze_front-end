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
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const enteredCode = quizCodeInput.trim();
    if (!enteredCode) {
      setError('❌ Please enter a quiz code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token')?.trim();
      if (!token) {
        setError('❌ No token found. Please login again.');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3000/api/quiz/join-quiz', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
        },
        body: JSON.stringify({ code: enteredCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.quizId) {
        setError(data.error || '❌ Invalid Quiz Code. Please try again.');
        setLoading(false);
        return;
      }

      const userEmail = localStorage.getItem('userEmail');
      const existingResults = JSON.parse(localStorage.getItem(`attemptedResults_${data.quizId}`)) || [];
      const alreadyAttempted = existingResults.some(r => r.studentEmail === userEmail);

      if (alreadyAttempted) {
        setError('❌ You have already attempted this quiz.');
        setLoading(false);
        return;
      }

      // Save quiz data for AttemptQuiz page
      localStorage.setItem(
        'finalQuizMeta',
        JSON.stringify({
          title: data.title,
          description: data.description,
          code: data.quizId,
          timeLimit: data.timeLimit || 1,
        })
      );
      localStorage.setItem('finalQuizQuestions', JSON.stringify(data.questions));
      localStorage.setItem('studentAnswers', JSON.stringify({}));

      navigate('/attempt-quiz');
    } catch (err) {
      console.error('Error joining quiz:', err);
      setError('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
    <div
      className="position-relative d-flex flex-column"
      style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#fff', overflow: 'hidden' }}
    >
      {/* Background Icons */}
      <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '39%', left: '8%', width: '185px' }} />
      <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '5%', width: '205px' }} />
      <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '1%', left: '92.5%', transform: 'translateX(-49%)', width: '210px', zIndex: 0 }} />
      <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '34%', right: '2%', width: '215px' }} />

      {/* Header */}
      <div className="text-white pt-4 pb-3 px-4" style={{ background: 'linear-gradient(to right, #015794, #437FAA)', borderBottomLeftRadius: '80px', borderBottomRightRadius: '80px', width: '100%', zIndex: 1 }}>
        <div className="container d-flex justify-content-between align-items-start">
          <img src={logo} alt="Logo" style={{ width: '160px' }} />
          <BackToDashboardButton className="btn btn-outline-light fw-bold" text="Back" onClick={handleBack} />
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
            placeholder="Unlock the Quiz, Let the Brain Games Begin!"
            value={quizCodeInput}
            onChange={(e) => setQuizCodeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
          {error && <div className="text-danger text-center fw-semibold mb-3">{error}</div>}
          <div className="text-center">
            <button className="btn btn-primary px-5" onClick={handleJoin} disabled={loading}>
              {loading ? 'Joining...' : 'Join'}
            </button>
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
