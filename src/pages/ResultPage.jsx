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

  const normalize = str => (str || '').replace(/\s+/g, '').toLowerCase();

  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('finalQuizMeta')) || {};
    const qs = JSON.parse(localStorage.getItem('finalQuizQuestions')) || [];
    const ans = JSON.parse(localStorage.getItem('studentAnswers')) || {};
    const origin = localStorage.getItem('fromPage') || '';

    setQuizMeta(meta);
    setQuestions(qs);
    setAnswers(ans);
    setFromPage(origin);

    let sc = 0;
    qs.forEach((q, i) => {
      const userAns = ans[i];
      if (!userAns) return;

      if (q.type === 'match') {
        const isCorrect = q.options?.every((pair, idx) =>
          normalize(userAns[idx]) === normalize(pair.right)
        );
        if (isCorrect) sc++;
      } else if (q.type === 'fill') {
        if (normalize(userAns) === normalize(q.correctAnswer)) sc++;
      } else {
        if (normalize(userAns) === normalize(q.correctAnswer)) sc++;
      }
    });

    setScore(sc);
    setPercentage(Math.round((sc / qs.length) * 100));

    if (meta.isCertificate === true && sc === qs.length) {
      setShowCertLoader(true);
      setTimeout(() => {
        navigate('/certificate');
      }, 3000);
    }

    setTimeout(() => {
      const ctx = document.getElementById('resultChart')?.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Correct', 'Wrong'],
          datasets: [{
            label: 'Result',
            data: [sc, qs.length - sc],
            backgroundColor: ['#28a745', '#dc3545']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }, 500);
  }, []);

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
    <div
      className="d-flex justify-content-center align-items-center text-center"
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        flexDirection: 'column'
      }}
    >
      <h2 className="fw-bold">🏆 Generating your certificate...</h2>
      <p className="text-muted mt-2">Please wait a few seconds...</p>
    </div>
  );
}


  return (
    <div className="d-flex flex-column min-vh-100 w-100" style={{ backgroundColor: '#f9fafe' }}>
      {/* Header */}
      <div className="text-white py-3 px-4" style={{
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
      <div className="mx-auto mt-4 mb-5" style={{ width: '100%', maxWidth: '600px', height: '300px' }}>
        <canvas id="resultChart" height="300"></canvas>
      </div>

      {/* Question Breakdown */}
      <div className="px-4 mb-5" style={{ maxWidth: '950px', width: '100%', margin: '0 auto' }}>
        {questions.map((q, index) => {
          const userAnswer = answers[index];
          let isCorrect = false;

          if (q.type === 'match') {
            isCorrect = q.options?.every((pair, i) =>
              normalize(userAnswer?.[i]) === normalize(pair.right)
            );
          } else {
            isCorrect = normalize(userAnswer) === normalize(q.correctAnswer);
          }

          return (
            <div key={index} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-2">Q{index + 1}: {q.question}</h5>

                {q.type !== 'match' ? (
                  <>
                    <p className="mb-1">
                      <strong>Your Answer:</strong>{" "}
                      <span className={isCorrect ? 'text-success' : 'text-danger'}>
                        {userAnswer || <em>Not Answered</em>}
                      </span>
                    </p>
                    <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                  </>
                ) : (
                  <>
                    <p className="fw-bold">Your Matches:</p>
                    {q.options.map((pair, i) => (
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

      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}


