// File: src/pages/ResultPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import logo from '../assets/logo.png';

export default function ResultPage() {
  const navigate = useNavigate();
  const [quizMeta, setQuizMeta] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [fromPage, setFromPage] = useState('');
  const [showCertLoader, setShowCertLoader] = useState(false);

  // Safe normalizer: handles strings, numbers, arrays, objects, null
  const normalize = (val) => {
    if (val == null) return '';
    if (Array.isArray(val)) return val.map(v => normalize(v)).join('').toLowerCase();
    if (typeof val === 'object') return JSON.stringify(val).toLowerCase();
    return String(val).replace(/\s+/g, '').toLowerCase();
  };

  // Helper to get display text for MCQ correct answer
  const getCorrectTextForMCQ = (q) => {
    // q.correctAnswer may be 'A'/'B' etc OR the option text itself
    const correct = q.correctAnswer;
    if (!correct && q.correct === undefined) return ''; // nothing found
    // if correct is a single letter
    if (typeof correct === 'string' && /^[A-Z]$/i.test(correct.trim())) {
      const idx = correct.trim().toUpperCase().charCodeAt(0) - 65;
      if (Array.isArray(q.options) && q.options[idx] !== undefined) return `${correct.toUpperCase()}. ${q.options[idx]}`;
      return correct.toUpperCase();
    }
    // otherwise, if correct matches one of the options, find letter
    if (Array.isArray(q.options)) {
      for (let i = 0; i < q.options.length; i++) {
        if (normalize(q.options[i]) === normalize(correct)) {
          const letter = String.fromCharCode(65 + i);
          return `${letter}. ${q.options[i]}`;
        }
      }
    }
    // fallback: show raw correct value
    return String(correct ?? q.correct ?? '');
  };

  // Helper to compute selected text for MCQ given stored answer (letter or text)
  const getSelectedTextForMCQ = (q, userAns) => {
    if (!userAns) return '';
    // if userAns is letter
    if (typeof userAns === 'string' && /^[A-Z]$/i.test(userAns.trim())) {
      const idx = userAns.trim().toUpperCase().charCodeAt(0) - 65;
      if (Array.isArray(q.options) && q.options[idx] !== undefined) return `${userAns.toUpperCase()}. ${q.options[idx]}`;
      return userAns.toUpperCase();
    }
    // else maybe userAns is already option text
    return String(userAns);
  };

  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('finalQuizMeta')) || {};
    const qs = JSON.parse(localStorage.getItem('finalQuizQuestions')) || [];
    const ans = JSON.parse(localStorage.getItem('studentAnswers')) || {};
    const origin = localStorage.getItem('fromPage') || '';

    setQuizMeta(meta);
    setQuestions(qs);
    setAnswers(ans);
    setFromPage(origin);

    // scoring
    let sc = 0;
    qs.forEach((q, i) => {
      const userAns = ans[i];

      // MCQ
      if (q.type === 'mcq' || q.type === 'multiple-choice') {
        if (!userAns) return;
        // compute selected text and correct text normalized
        const selectedText = (() => {
          if (typeof userAns === 'string' && /^[A-Z]$/i.test(userAns.trim())) {
            const idx = userAns.trim().toUpperCase().charCodeAt(0) - 65;
            return q.options?.[idx] ?? userAns;
          }
          return userAns;
        })();
        const correctVal = q.correctAnswer ?? q.correct ?? null;
        // If correct is letter, map to option; else compare text
        let correctText;
        if (typeof correctVal === 'string' && /^[A-Z]$/i.test(correctVal.trim())) {
          const idx = correctVal.trim().toUpperCase().charCodeAt(0) - 65;
          correctText = q.options?.[idx] ?? correctVal;
        } else {
          correctText = correctVal;
        }
        if (normalize(selectedText) && normalize(selectedText) === normalize(correctText)) sc++;
      }
      // True/False
      else if (q.type === 'truefalse' || q.type === 'true-false') {
        if (!userAns) return;
        const correctVal = q.correctAnswer ?? q.correct ?? null;
        // correct may be boolean or 'True'/'False' or 'true' etc.
        if (normalize(userAns) === normalize(correctVal)) sc++;
      }
      // Fill
      else if (q.type === 'fill' || q.type === 'fill-in-the-blank') {
        if (!userAns) return;
        const correctVal = q.correctAnswer ?? q.correct ?? null;
        if (normalize(userAns) === normalize(correctVal)) sc++;
      }
      // Match
      else if (q.type === 'match' || q.type === 'match-the-following' || q.type === 'match-the following') {
        // userAns expected to be object like {0: 'Structure', 1: 'Design', ...}
        const expectedPairs = q.pairs ?? q.options ?? q.correctAnswer ?? [];
        if (!Array.isArray(expectedPairs) || expectedPairs.length === 0) return;
        if (!userAns || typeof userAns !== 'object') return;

        const allMatched = expectedPairs.every((pair, idx) => {
          const expectedRight = (pair.right ?? pair) ?? '';
          return normalize(userAns[idx]) === normalize(expectedRight);
        });
        if (allMatched) sc++;
      }
      // fallback generic
      else {
        if (!userAns) return;
        const correctVal = q.correctAnswer ?? q.correct ?? null;
        if (normalize(userAns) === normalize(correctVal)) sc++;
      }
    });

    setScore(sc);
    setPercentage(qs.length > 0 ? Math.round((sc / qs.length) * 100) : 0);

    if (meta.isCertificate === true && sc === qs.length) {
      setShowCertLoader(true);
      setTimeout(() => {
        navigate('/certificate');
      }, 3000);
    }

    // draw chart after small delay to ensure canvas exists
    setTimeout(() => {
      const ctx = document.getElementById('resultChart')?.getContext('2d');
      if (!ctx) return;
      // destroy existing chart instance if any (safeguard)
      // (Chart.js v3+ keeps instances internally; recreating allowed but multiple instances on same canvas may duplicate)
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Correct', 'Wrong'],
          datasets: [{
            label: 'Result',
            data: [sc, (qs.length - sc)],
            backgroundColor: ['#28a745', '#dc3545']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
      });
    }, 300);
  }, [navigate]);

  const handleBack = () => {
    switch (fromPage) {
      case 'view-results':
        navigate('/view-results');
        break;
      case 'student-results':
        navigate('/student-results');
        break;
      default:
        navigate('/creator');
    }
  };

  if (showCertLoader) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column text-center"
        style={{ height: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}>
        <h2 className="fw-bold">🏆 Generating your certificate...</h2>
        <p className="text-muted mt-2">Please wait a few seconds...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-stretch" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe', overflowX: 'hidden' }}>
      {/* Header */}
      <div className="text-white py-3 px-4"
        style={{
          background: 'linear-gradient(to right, #015794, #437FAA)',
          borderBottomLeftRadius: '60px',
          borderBottomRightRadius: '60px'
        }}>
        <div className="d-flex justify-content-between align-items-center w-100">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h4 className="mb-0 fw-bold">Quiz Result</h4>
          <button className="btn btn-light" onClick={handleBack}>Back</button>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center mt-4 px-3" style={{ width: '100%' }}>
        <h2 className="fw-bold">{quizMeta.title || 'Quiz Title'}</h2>
        <p className="text-muted">{quizMeta.description}</p>
        <h5>Your Score: <span className="text-success">{score}</span> / {questions.length}</h5>
        <h6>Percentage: <strong>{percentage}%</strong></h6>
      </div>

      {/* Chart */}
      <div className="mx-auto mt-4 mb-4" style={{ width: '100%', maxWidth: '800px', height: '320px' }}>
        <canvas id="resultChart" height="320"></canvas>
      </div>

      {/* Questions */}
      <div className="px-4 mb-5 w-100" style={{ maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        {questions.map((q, index) => {
          const userAnswer = answers[index];
          let isCorrect = false;

          // Determine correctness for rendering
          if (q.type === 'match' || q.type === 'match-the-following' || q.type === 'match-the following') {
            const expected = q.pairs ?? q.options ?? [];
            isCorrect = Array.isArray(expected) && expected.length > 0 &&
              expected.every((pair, i) => normalize(userAnswer?.[i]) === normalize(pair.right));
          } else if (q.type === 'mcq' || q.type === 'multiple-choice') {
            // compute selected and correct text
            const selectedText = (() => {
              if (!userAnswer) return '';
              if (typeof userAnswer === 'string' && /^[A-Z]$/i.test(userAnswer.trim())) {
                const idx = userAnswer.trim().toUpperCase().charCodeAt(0) - 65;
                return q.options?.[idx] ?? userAnswer;
              }
              return userAnswer;
            })();
            const correctVal = q.correctAnswer ?? q.correct ?? null;
            let correctText;
            if (typeof correctVal === 'string' && /^[A-Z]$/i.test(correctVal.trim())) {
              const idx = correctVal.trim().toUpperCase().charCodeAt(0) - 65;
              correctText = q.options?.[idx] ?? correctVal;
            } else {
              correctText = correctVal;
            }
            isCorrect = normalize(selectedText) === normalize(correctText);
          } else if (q.type === 'truefalse' || q.type === 'true-false') {
            isCorrect = normalize(userAnswer) === normalize(q.correctAnswer ?? q.correct);
          } else {
            isCorrect = normalize(userAnswer) === normalize(q.correctAnswer ?? q.correct);
          }

          // Prepare display values
          const displayUser = (() => {
            if (q.type === 'mcq' || q.type === 'multiple-choice') return getSelectedTextForMCQ(q, userAnswer) || <em>Not Answered</em>;
            if (q.type === 'match' || q.type === 'match-the-following') return null;
            return userAnswer ?? <em>Not Answered</em>;
          })();

          const displayCorrect = (() => {
            if (q.type === 'mcq' || q.type === 'multiple-choice') return getCorrectTextForMCQ(q);
            if (q.type === 'match' || q.type === 'match-the-following') return null;
            return q.correctAnswer ?? q.correct ?? '';
          })();

          return (
            <div key={index} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-2">Q{index + 1}: {q.question || q.questionText}</h5>

                {q.type === 'match' || q.type === 'match-the-following' ? (
                  <>
                    <p className="fw-bold">Your Matches:</p>
                    {(q.pairs ?? q.options ?? []).map((pair, i) => (
                      <div key={i} className="row mb-1 align-items-center">
                        <div className="col-sm-5">🔹 <strong>{pair.left}</strong></div>
                        <div className="col-sm-7">
                          ➡ <span className={normalize(userAnswer?.[i]) === normalize(pair.right) ? 'text-success' : 'text-danger'}>
                            {userAnswer?.[i] || 'Not Answered'}{" "}
                            {normalize(userAnswer?.[i]) === normalize(pair.right)
                              ? '✅'
                              : `❌ (Correct: ${pair.right})`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="mb-1">
                      <strong>Your Answer:</strong>{" "}
                      <span className={isCorrect ? 'text-success' : 'text-danger'}>
                        {displayUser}
                      </span>
                    </p>
                    <p><strong>Correct Answer:</strong> {displayCorrect || <em>Not Provided</em>}</p>
                  </>
                )}

                <div className="mt-2">
                  {isCorrect
                    ? <span className="badge bg-success">Correct</span>
                    : <span className="badge bg-danger">Incorrect</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>  

      {/* Footer */}
      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
