// File: src/pages/QuestionBank.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function QuestionBank() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail')?.toLowerCase().trim();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/qb/all')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuestions(data.questions);
        } else {
          console.error('Failed to fetch questions');
        }
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
      });
  }, []);

  const handleSelect = (id) => {
    setSelectedQuestions(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleUseSelected = () => {
    const selectedFullQuestions = questions
      .filter(q => selectedQuestions.includes(q.id || q._id))
      .map(q => {
        const id = q.id || q._id || Date.now();

        if (q.type === 'match-the-following') {
          return {
            id,
            type: 'match',
            question: q.questionText || q.question || '',
            options: q.pairs || [],
            correctAnswer: q.pairs || [],
            ownerEmail: userEmail,
          };
        }

        return {
          id,
          type: q.type,
          question: q.questionText || q.question || '',
          options: q.options || [],
          correctAnswer: q.correctAnswer || '',
          ownerEmail: userEmail,
        };
      });

    localStorage.setItem('selectedQuestionBankQuestions', JSON.stringify(selectedFullQuestions));
    navigate('/create-quiz');
  };

  return (
    <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="text-white px-4 pt-3 pb-4 w-100" style={{
        background: 'linear-gradient(to right, #015794, #437FAA)',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px'
      }}>
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h3 className="fw-bold mb-0 text-center flex-grow-1 text-uppercase text-nowrap">Question Bank</h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-light border-0"
              style={{ boxShadow: 'none' }}
              onClick={handleUseSelected}
            >Use Selected</button>
            <button
              className="btn btn-outline-light border-0"
              style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
              onClick={() => navigate('/create-quiz')}
            >Back</button>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="container mt-4">
        <div className="row">
          {questions.map((q, i) => {
            const id = q.id || q._id;
            const isSelected = selectedQuestions.includes(id);

            return (
              <div className="col-md-6 col-lg-4 mb-4" key={id || i}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{q.questionText}</h5>

                    {q.type === 'mcq' && q.options.map((opt, j) => (
                      <div key={j}><strong>{String.fromCharCode(65 + j)}.</strong> {opt}</div>
                    ))}
                    {q.type === 'fill' && <p className="fst-italic">Fill in the blank</p>}
                    {q.type === 'truefalse' && <p>A. True <br /> B. False</p>}
                    {q.type === 'match-the-following' && (
                      <div className="mb-2">
                        <p className="fw-bold mb-1">Match Pairs:</p>
                        {q.pairs?.map((pair, idx) => (
                          <li key={idx}>{pair.left} —&gt; {pair.right}</li>
                        ))}
                      </div>
                    )}
                    {q.type !== 'match-the-following' && (
                      <p>
                        <strong>Correct:</strong>{' '}
                        {typeof q.correctAnswer === 'object'
                          ? JSON.stringify(q.correctAnswer)
                          : q.correctAnswer}
                      </p>
                    )}

                    <div className="mt-auto d-flex justify-content-end">
                      <button
                        className={`btn btn-sm ${isSelected ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                        onClick={() => handleSelect(id)}
                      >
                        {isSelected ? 'Remove' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-auto py-3">
        <p className="text-muted mb-0">&copy; 2025 QUIZZE. All rights reserved.</p>
      </footer>
    </div>
  );
}
