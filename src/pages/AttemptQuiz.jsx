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
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ new guard
  const submittedRef = useRef(false); // ✅ prevents duplicate submission

  // Normalize incoming question shapes into a predictable format
  const normalizeQuestions = (rawQs = []) => {
    return rawQs.map((q) => {
      const typeMap = {
        'match-the-following': 'match',
        'match-the following': 'match',
        match: 'match',
        mcq: 'mcq',
        'multiple-choice': 'mcq',
        truefalse: 'truefalse',
        'true-false': 'truefalse',
        fill: 'fill',
        'fill-in-the-blank': 'fill',
      };

      const normalizedType = typeMap[q.type] || (q.pairs ? 'match' : q.type);
      const pairs = q.pairs || q.options?.pairs || q.options || [];

      return {
        id: q._id || q.id || Date.now() + Math.random(),
        type: normalizedType,
        question: q.questionText || q.question || q.title || '',
        options: normalizedType === 'match' ? (pairs.map ? pairs : []) : (q.options || q.choices || []),
        correctAnswer: q.correctAnswer ?? q.answer ?? (normalizedType === 'match' ? pairs : undefined),
      };
    });
  };

  // Load quiz data
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
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, questions]);

  // Prevent browser back
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

  // Scroll progress
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

  const handleChange = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleMatchChange = (qIndex, pairIndex, value) => {
    setAnswers((prev) => {
      const current = prev[qIndex] || {};
      return { ...prev, [qIndex]: { ...current, [pairIndex]: value } };
    });
  };

  const shuffledOptions = useMemo(() => {
    const map = {};
    questions.forEach((q, i) => {
      if (q.type === 'match') {
        const rights = (q.options || []).map((p) => p.right ?? p).filter(Boolean);
        map[i] = [...rights].sort(() => Math.random() - 0.5);
      }
    });
    return map;
  }, [questions]);

  // ✅ FINAL FIXED handleSubmit FUNCTION
  const handleSubmit = async (auto = false) => {
    // Prevent duplicate submission immediately
    if (submittedRef.current || isSubmitting) {
      console.warn("⛔ Duplicate submission prevented");
      return;
    }
    submittedRef.current = true;
    setIsSubmitting(true);

    try {
      const finalQuizMeta = JSON.parse(localStorage.getItem("finalQuizMeta") || "{}");
      const quizId = finalQuizMeta.code || finalQuizMeta._id || finalQuizMeta.id;
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");

      if (!quizId || !userId) {
        alert("Missing quiz or user information.");
        submittedRef.current = false;
        setIsSubmitting(false);
        return;
      }

      const formattedAnswers = questions.map((q, index) => {
        if (q.type === "match") {
          const selectedPairs = (q.options || []).map((pair, i) => ({
            left: pair.left ?? pair.l ?? "",
            right: answers[index]?.[i] || "",
          }));
          return { questionId: q.id, type: q.type, selectedPairs };
        } else if (q.type === "mcq") {
          const letter = answers[index];
          const optionIndex = letter ? letter.charCodeAt(0) - 65 : -1;
          const actualAnswer = q.options?.[optionIndex] || "";
          return {
            questionId: q.id,
            type: q.type,
            selectedAnswer: actualAnswer,
          };
        } else {
          return {
            questionId: q.id,
            type: q.type,
            selectedAnswer: answers[index] || "",
          };
        }
      });

      localStorage.setItem("studentAnswers", JSON.stringify(formattedAnswers));

      if (!auto) {
        const unanswered = formattedAnswers.some((a) => {
          if (a.type === "match") return a.selectedPairs.some((p) => !p.right);
          return !a.selectedAnswer;
        });

        if (unanswered && !window.confirm("Some questions are unanswered. Submit anyway?")) {
          submittedRef.current = false;
          setIsSubmitting(false);
          return;
        }
      }

      console.log("🚀 Submitting quiz attempt...");
      const response = await fetch("http://localhost:3000/api/quiz/attempt-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ quizId, userId, answers: formattedAnswers }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Backend Error:", data);
        alert(data.error || "Failed to submit quiz.");
        submittedRef.current = false;
        setIsSubmitting(false);
        return;
      }

      console.log("✅ Quiz submitted successfully:", data);
      localStorage.setItem("quizAttemptResult", JSON.stringify(data.result));

      // Delay navigation to ensure storage completes
      setTimeout(() => navigate("/my-attempts"), 300);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting the quiz.");
      submittedRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe' }}>
      <div style={{
        height: '5px',
        background: '#00004d',
        width: `${scrollProgress}%`,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100
      }} />
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

      <div className="container mt-3 text-center">
        <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
        <p className="fw-bold">Total Questions: {questions.length}</p>
      </div>

      <div className="container my-4 flex-grow-1">
        {questions.map((q, index) => (
          <div key={q.id || index} style={{ marginBottom: '1.25rem' }}>
            <div>
              <strong>Q{index + 1}:</strong>&nbsp;
              <span>{q.question}</span>
            </div>

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

      {/* ✅ Disable submit button when already submitting */}
      <div className="text-center mb-4">
        <button
          className="btn btn-primary px-5 py-2"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>

      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
