// File: src/pages/ViewResults.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import BackToDashboardButton from '../components/BackToDashboardButton';

export default function ViewResults() {
  const navigate = useNavigate();
  const [allAttempts, setAllAttempts] = useState({});

  useEffect(() => {
    const creatorEmail = localStorage.getItem('userEmail');
    const quizzes = JSON.parse(localStorage.getItem(`quizzes_${creatorEmail}`)) || [];

    const attemptsMap = {};

    quizzes.forEach((quiz) => {
      const quizCode = quiz.code;
      const attempts = JSON.parse(localStorage.getItem(`attemptedResults_${quizCode}`)) || [];

      attempts.forEach((attempt) => {
        const email = attempt.studentEmail || 'anonymous';
        const role = attempt.role || 'student';
        const name = attempt.studentName || 'Anonymous';

        const userKey = `${email}_${name}_${role}`;

        if (!attemptsMap[userKey]) {
          attemptsMap[userKey] = {
            name,
            email,
            role,
            results: []
          };
        }

        attemptsMap[userKey].results.push({
          ...attempt,
          quizMeta: quiz.meta,
          quizCode: quiz.code
        });
      });
    });

    setAllAttempts(attemptsMap);
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f0f3f9' }}>
      
      {/* Header */}
      <div className="text-white py-3 px-4" style={{
        background: 'linear-gradient(to right, #015794, #437FAA)',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px'
      }}>
        <div className="d-flex justify-content-between align-items-center container-fluid">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h4 className="mb-0 fw-bold">All Quiz Attempts</h4>
          <BackToDashboardButton className="btn btn-light" text="Dashboard" />
        </div>
      </div>

      {/* Attempts Grid */}
      <div className="container-fluid mt-4 px-4" style={{ flexGrow: 1 }}>
        <div className="row">
          {Object.keys(allAttempts).length === 0 ? (
            <div className="col-12 text-center">
              <p className="text-muted">No quiz attempts found.</p>
            </div>
          ) : (
            Object.entries(allAttempts).map(([key, user], idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="bg-white shadow rounded p-3 h-100 d-flex flex-column">
                  
                  {/* User Info */}
                  <div className="mb-3 border-bottom pb-2">
                    <h5 className="fw-bold">{user.name || 'Anonymous'}</h5>
                    <p className="mb-1"><strong>Role:</strong> {user.role}</p>
                    <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                    <p className="text-muted">Total Attempts: {user.results.length}</p>
                  </div>

                  {/* Quiz Attempts */}
                  {user.results.map((result, i) => (
                    <div key={i} className="card mb-3 shadow-sm">
                      <div className="card-body">
                        <h6 className="fw-bold">{result.quizMeta.title || 'Untitled Quiz'}</h6>
                        <p className="mb-1 text-muted">{result.quizMeta.description}</p>
                        <p className="mb-1"><strong>Code:</strong> {result.quizCode}</p>
                        <p className="mb-1"><strong>Date:</strong> {new Date(result.attemptedAt).toLocaleString()}</p>
                        <p className="mb-2"><strong>Score:</strong> {result.score} / {result.total} ({result.percentage}%)</p>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            localStorage.setItem('finalQuizMeta', JSON.stringify(result.quizMeta));
                            localStorage.setItem('finalQuizQuestions', JSON.stringify(result.questions || []));
                            localStorage.setItem('studentAnswers', JSON.stringify(result.answers || {}));
                            localStorage.setItem('fromPage', 'view-results');

                            navigate('/result');
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
