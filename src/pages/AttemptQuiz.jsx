// File: src/pages/AttemptQuiz.jsx
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
  const submittedRef = useRef(false); // prevent double submit

  // Normalize incoming question shapes into a predictable format
  const normalizeQuestions = (rawQs = []) => {
    return rawQs.map((q) => {
      const typeMap = {
        'match-the-following': 'match',
        'match-the following': 'match', // defensive
        match: 'match',
        mcq: 'mcq',
        'multiple-choice': 'mcq',
        truefalse: 'truefalse',
        'true-false': 'truefalse',
        fill: 'fill',
        'fill-in-the-blank': 'fill',
      };

      const normalizedType = typeMap[q.type] || (q.pairs ? 'match' : q.type);

      // For match questions the pairs may be in `pairs` or `pairs` or `options`
      const pairs = q.pairs || q.pairs || q.options?.pairs || q.options || (q.type === 'match' && q.options) || [];

      return {
        // stable fields used by rendering & scoring
        id: q._id || q.id || Date.now() + Math.random(),
        type: normalizedType,
        question: q.questionText || q.question || q.title || '',
        options: normalizedType === 'match' ? (pairs.map ? pairs : []) : (q.options || q.choices || []),
        // correctAnswer can be in different shapes; preserve as-is
        correctAnswer: q.correctAnswer ?? q.answer ?? (normalizedType === 'match' ? pairs : undefined),
      };
    });
  };

  // Load quiz data from localStorage (set by JoinQuiz flow)
  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('finalQuizMeta')) || {};
    const qsRaw = JSON.parse(localStorage.getItem('finalQuizQuestions')) || [];
    const normalized = normalizeQuestions(qsRaw);
    setQuizMeta(meta);
    setQuestions(normalized);
    setTimeLeft((meta.timeLimit || 1) * 60);
  }, []);

  // Timer + auto-submit
  useEffect(() => {
    if (timeLeft <= 0 && questions.length > 0 && !submittedRef.current) {
      handleSubmit(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, questions]);

  // Prevent browser back — auto-submit if they try to leave
  useEffect(() => {
    const handlePopState = () => {
      if (!submittedRef.current && questions.length > 0) {
        handleSubmit(true);
      }
    };
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [questions]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // handle change for regular answers (mcq, truefalse, fill)
  const handleChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  // Special handler for match answers (object mapping pairIndex -> selectedRight)
  const handleMatchChange = (qIndex, pairIndex, value) => {
    setAnswers(prev => {
      const current = prev[qIndex] || {};
      return { ...prev, [qIndex]: { ...current, [pairIndex]: value } };
    });
  };

  // Prepare shuffled options for match-right-sides (so dropdowns are randomized per user)
  const shuffledOptions = useMemo(() => {
    const map = {};
    questions.forEach((q, i) => {
      if (q.type === 'match') {
        const rights = (q.options || []).map(p => p.right ?? p).filter(Boolean);
        // shuffle
        map[i] = [...rights].sort(() => Math.random() - 0.5);
      }
    });
    return map;
  }, [questions]);

  // Submission & scoring
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

    // persist student answers locally
    localStorage.setItem('studentAnswers', JSON.stringify(answers));

    const studentEmail = localStorage.getItem('userEmail') || 'anonymous';
    const studentName =
      localStorage.getItem('userFullName') ||
      `${(localStorage.getItem('firstName') || '').trim()} ${(localStorage.getItem('lastName') || '').trim()}`.trim() ||
      'Anonymous';

    // scoring strategy: try to be robust depending on available correctAnswer shape
    let score = 0;
    const normalize = str => (str ?? '').toString().trim().replace(/\s+/g, '').toLowerCase();

    questions.forEach((q, i) => {
      const userAns = answers[i];
      const correct = q.correctAnswer;

      if (q.type === 'match') {
        // correct might be array of pairs [{left,right}] or object mapping
        const expectedPairs = Array.isArray(correct) ? correct : q.options;
        if (!expectedPairs || expectedPairs.length === 0 || !userAns) return;

        let matched = 0;
        expectedPairs.forEach((pair, j) => {
          const expectedRight = (pair.right ?? pair) || '';
          const provided = userAns?.[j] ?? '';
          if (normalize(provided) === normalize(expectedRight)) matched++;
        });
        if (matched === expectedPairs.length) score++;
      } else if (q.type === 'fill') {
        if (!userAns || !correct) return;
        if (normalize(userAns) === normalize(correct)) score++;
      } else {
        // mcq / truefalse
        if (!userAns || correct === undefined) return;
        // correct may be letter 'A'/'B' or the option value itself; handle both:
        const correctLetter = typeof correct === 'string' && /^[A-Z]$/i.test(correct) ? correct.toUpperCase() : null;
        if (correctLetter) {
          if (userAns === correctLetter) score++;
        } else {
          // compare normalized option text
          // find the option text corresponding to user's selected letter (A/B/C...)
          const optIndex = (userAns && userAns.length === 1 && /[A-Z]/i.test(userAns)) ? userAns.charCodeAt(0) - 65 : null;
          const selectedText = (optIndex !== null && q.options && q.options[optIndex]) ? q.options[optIndex] : userAns;
          if (normalize(selectedText) === normalize(correct)) score++;
        }
      }
    });

    const attemptKey = `attemptedResults_${quizMeta.code || quizMeta.quizId || quizMeta.id || 'unknown'}`;
    const existing = JSON.parse(localStorage.getItem(attemptKey)) || [];

    const newAttempt = {
      quizCode: quizMeta.code || quizMeta.quizId || quizMeta.id || 'unknown',
      studentEmail,
      studentName,
      role: localStorage.getItem('userRole') || 'student',
      score,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((score / questions.length) * 100) : 0,
      attemptedAt: new Date().toISOString(),
      answers,
      questions,
      quizMeta,
    };

    const updated = [...existing.filter(r => r.studentEmail !== studentEmail), newAttempt];
    localStorage.setItem(attemptKey, JSON.stringify(updated));

    navigate('/result');
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe' }}>
      {/* Scroll progress bar */}
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
          <h4 className="mb-0 fw-bold" style={{ textAlign: 'center', flex: 1 }}>{quizMeta.title || 'Quiz Title'}</h4>
          <span className="badge bg-light text-dark fs-6 px-3 py-2">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="container mt-3 text-center">
        <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
        <p className="fw-bold">Total Questions: {questions.length}</p>
      </div>

      {/* Questions - simplified layout (no cards) */}
      <div className="container my-4 flex-grow-1">
        {questions.map((q, index) => (
          <div key={q.id || index} style={{ marginBottom: '1.25rem' }}>
            <div>
              <strong>Q{index + 1}:</strong>&nbsp;
              <span>{q.question}</span>
            </div>

            {/* MCQ */}
            {q.type === 'mcq' && Array.isArray(q.options) && (
              <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <div className="form-check" key={i} style={{ marginBottom: '0.35rem' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        id={`q-${index}-opt-${i}`}
                        name={`q-${index}`}
                        value={letter}
                        checked={answers[index] === letter}
                        onChange={() => handleChange(index, letter)}
                      />
                      <label className="form-check-label" htmlFor={`q-${index}-opt-${i}`}>
                        <strong style={{ marginRight: 6 }}>{letter}.</strong> {opt}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* True/False */}
            {q.type === 'truefalse' && (
              <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {['True', 'False'].map((val, i) => (
                  <div className="form-check" key={i} style={{ marginBottom: '0.35rem' }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`q-${index}-tf-${i}`}
                      name={`q-${index}`}
                      value={val}
                      checked={answers[index] === val}
                      onChange={() => handleChange(index, val)}
                    />
                    <label className="form-check-label" htmlFor={`q-${index}-tf-${i}`}>{val}</label>
                  </div>
                ))}
              </div>
            )}

            {/* Fill in the blank */}
            {q.type === 'fill' && (
              <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your answer"
                  value={answers[index] || ''}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </div>
            )}

            {/* Match the Following (interactive dropdowns) */}
            {q.type === 'match' && Array.isArray(q.options) && (
              <div style={{ marginTop: '0.5rem', paddingLeft: '0.25rem' }}>
                <div className="fw-bold mb-2">Match the Following</div>
                {q.options.map((pair, i) => {
                  const leftText = pair.left ?? pair.l ?? '';
                  const allRightOptions = shuffledOptions[index] || [];
                  const selected = answers[index] || {};
                  const used = Object.entries(selected)
                    .filter(([key]) => Number(key) !== i)
                    .map(([_, val]) => val);

                  return (
                    <div className="d-flex align-items-center mb-2" key={i}>
                      <div style={{ width: '35%', fontWeight: 600 }}>A{i + 1}: {leftText}</div>
                      <div style={{ width: '65%' }}>
                        <select
                          className="form-select"
                          value={selected[i] || ''}
                          onChange={(e) => handleMatchChange(index, i, e.target.value)}
                        >
                          <option value="">Select...</option>
                          {allRightOptions.map((opt, idx) => (
                            <option key={idx} value={opt} disabled={used.includes(opt) && selected[i] !== opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
