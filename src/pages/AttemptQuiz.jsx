import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function AttemptQuiz() {
  const navigate = useNavigate();
  const [quizMeta, setQuizMeta] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const submittedRef = useRef(false); // 🔐 Prevent double submission

  // Load quiz data
  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('finalQuizMeta')) || {};
    const qs = JSON.parse(localStorage.getItem('finalQuizQuestions')) || [];
    setQuizMeta(meta);
    setQuestions(qs);
    setTimeLeft((meta.timeLimit || 1) * 60);
  }, []);

  // Handle timer and auto-submit on time out
  useEffect(() => {
    if (timeLeft <= 0 && questions.length > 0 && !submittedRef.current) {
      handleSubmit(true); // ⏰ auto-submit
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, questions]);

  // Prevent going back (🛑 disable browser back)
  useEffect(() => {
    const handlePopState = () => {
      if (!submittedRef.current && questions.length > 0) {
        handleSubmit(true); // Auto-submit if user tries to go back
      }
    };
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [questions]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((scrollTop / scrollHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = (auto = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    if (!auto) {
      const unanswered = questions.some((q, i) => {
        if (q.type === 'match') {
          const a = answers[i];
          return !a || Object.values(a).some(v => !v);
        }
        return answers[i] === undefined || answers[i] === '';
      });

      if (unanswered && !window.confirm('Some questions are unanswered. Submit anyway?')) {
        submittedRef.current = false;
        return;
      }
    }

    // Save answers
    localStorage.setItem('studentAnswers', JSON.stringify(answers));

    const studentEmail = localStorage.getItem('userEmail') || 'anonymous';
    const studentName =
      localStorage.getItem('userFullName') ||
      `${localStorage.getItem('firstName') || ''} ${localStorage.getItem('lastName') || ''}`.trim() ||
      'Anonymous';

    // Compute score
    let score = 0;
    const normalize = str => (str || '').toString().trim().replace(/\s+/g, '').toLowerCase();
    questions.forEach((q, i) => {
      const userAns = answers[i];
      const correctAns = q.correctAnswer;
      if (!userAns || !correctAns) return;

      if (q.type === 'match') {
        let matched = 0;
        q.options.forEach((pair, j) => {
          if (normalize(userAns?.[j]) === normalize(pair.right)) matched++;
        });
        if (matched === q.options.length) score++;
      } else if (q.type === 'fill') {
        if (normalize(userAns) === normalize(correctAns)) score++;
      } else {
        if (normalize(userAns) === normalize(correctAns)) score++;
      }
    });

    const attemptKey = `attemptedResults_${quizMeta.code}`;
    const existing = JSON.parse(localStorage.getItem(attemptKey)) || [];
    const newAttempt = {
      quizCode: quizMeta.code,
      studentEmail,
      studentName,
      role: localStorage.getItem('userRole') || 'student',
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      attemptedAt: new Date().toISOString(),
      answers,
      questions,
      quizMeta,
    };

    const updated = [...existing.filter(r => r.studentEmail !== studentEmail), newAttempt];
    localStorage.setItem(attemptKey, JSON.stringify(updated));
    navigate('/result');
  };

  const shuffledOptions = useMemo(() => {
    const map = {};
    questions.forEach((q, i) => {
      if (q.type === 'match') {
        const rights = q.options?.map(p => p.right) || [];
        map[i] = rights.sort(() => Math.random() - 0.5);
      }
    });
    return map;
  }, [questions]);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe' }}>
      {/* Scroll Progress */}
      <div style={{
        height: '5px',
        background: '#00004d',
        width: `${scrollProgress}%`,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100
      }} />

      {/* Header */}
      <div className="text-white py-3 px-4" style={{
        background: 'linear-gradient(to right, #015794, #437FAA)',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px'
      }}>
        <div className="d-flex justify-content-between align-items-center container-fluid">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h4 className="mb-0 fw-bold">{quizMeta.title || 'Quiz Title'}</h4>
          <span className="badge bg-light text-dark fs-6 px-3 py-2">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="container mt-3 text-center">
        <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
        <p className="fw-bold">Total Questions: {questions.length}</p>
      </div>

      {/* Questions */}
      <div className="container my-4 flex-grow-1">
        {questions.map((q, index) => (
          <div key={index} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5><strong>Q{index + 1}:</strong> {q.question}</h5>
              {q.type === 'mcq' && q.options?.map((opt, i) => (
                <div key={i} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`q-${index}`}
                    value={String.fromCharCode(65 + i)}
                    checked={answers[index] === String.fromCharCode(65 + i)}
                    onChange={() => handleChange(index, String.fromCharCode(65 + i))}
                  />
                  <label className="form-check-label">
                    {String.fromCharCode(65 + i)}. {opt}
                  </label>
                </div>
              ))}
              {q.type === 'truefalse' && ['True', 'False'].map((val, i) => (
                <div key={i} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`q-${index}`}
                    value={val}
                    checked={answers[index] === val}
                    onChange={() => handleChange(index, val)}
                  />
                  <label className="form-check-label">{val}</label>
                </div>
              ))}
              {q.type === 'fill' && (
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Type your answer"
                  value={answers[index] || ''}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}
              {q.type === 'match' && Array.isArray(q.options) && (
                <>
                  <p className="fw-bold mt-3">Match the Following</p>
                  {q.options.map((pair, i) => {
                    const selected = answers[index] || {};
                    const allRightOptions = shuffledOptions[index] || [];
                    const used = Object.entries(selected)
                      .filter(([key]) => Number(key) !== i)
                      .map(([_, val]) => val);

                    return (
                      <div className="row align-items-center mb-3" key={i}>
                        <div className="col-md-4 fw-semibold">A{i + 1}: {pair.left}</div>
                        <div className="col-md-8">
                          <select
                            className="form-select"
                            value={selected[i] || ''}
                            onChange={(e) => {
                              const updated = { ...selected, [i]: e.target.value };
                              setAnswers(prev => ({ ...prev, [index]: updated }));
                            }}
                          >
                            <option value="">Select...</option>
                            {allRightOptions.map((opt, idx) => (
                              <option
                                key={idx}
                                value={opt}
                                disabled={used.includes(opt) && selected[i] !== opt}
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="text-center mb-4">
        <button className="btn btn-primary px-5 py-2" onClick={() => handleSubmit(false)}>Submit Quiz</button>
      </div>

      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
