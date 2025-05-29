import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function AttemptQuiz() {
  const [quizMeta, setQuizMeta] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('finalQuizMeta')) || {};
    const storedQuestions = JSON.parse(localStorage.getItem('finalQuizQuestions')) || [];
    setQuizMeta(meta);
    setQuestions(storedQuestions);
    setTimeLeft((meta.timeLimit || 1) * 60);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = () => {
    console.log('Answers submitted:', answers);
    alert('Quiz submitted! (You will be redirected to results soon.)');
  };

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe' }}>
      {/* Scroll Progress Bar */}
      <div style={{
        height: '5px',
        background: '#015794',
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

      {/* Meta */}
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
                  <div className="row fw-semibold mb-2">
                    <div className="col">Left Side</div>
                    <div className="col">Right Side</div>
                  </div>
                  {q.options.map((pair, i) => (
                    <div className="row mb-2" key={i}>
                      <div className="col">A{i + 1}: {pair.left}</div>
                      <div className="col">{(i + 1) * 11}: {pair.right}</div>
                    </div>
                  ))}
                  <textarea
                    className="form-control mt-2"
                    rows="2"
                    placeholder="Write matching pairs, e.g. A1-11, A2-22"
                    value={answers[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="text-center mb-4">
        <button className="btn btn-primary px-5 py-2" onClick={handleSubmit}>
          Submit Quiz
        </button>
      </div>

      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
