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

    // Chart render
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
        navigate('/creator'); // or '/student' based on role
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe' }}>
      {/* Header */}
      <div className="text-white py-3 px-4" style={{
        background: 'linear-gradient(to right, #015794, #437FAA)',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px'
      }}>
        <div className="d-flex justify-content-between align-items-center container-fluid">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h4 className="mb-0 fw-bold">Quiz Result</h4>
          <button className="btn btn-light" onClick={handleBack}>Back</button>
        </div>
      </div>

      {/* Summary */}
      <div className="container text-center mt-4">
        <h2 className="fw-bold">{quizMeta.title || 'Quiz Title'}</h2>
        <p className="text-muted">{quizMeta.description}</p>
        <h5>Your Score: <span className="text-success">{score}</span> / {questions.length}</h5>
        <h6>Percentage: <strong>{percentage}%</strong></h6>
      </div>

      {/* Chart */}
      <div style={{ width: '90%', maxWidth: '500px', height: '300px' }} className="mx-auto mt-4 mb-5">
        <canvas id="resultChart" height="300"></canvas>
      </div>

      {/* Detailed Breakdown */}
      <div className="container" style={{ maxWidth: '900px' }}>
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
                    : <span className="badge bg-danger">Incorrect</span>
                  }
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























// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Chart from 'chart.js/auto';
// import logo from '../assets/logo.png';

// export default function ResultPage() {
//   const navigate = useNavigate();
//   const [quizMeta, setQuizMeta] = useState({});
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [score, setScore] = useState(0);

//   const normalize = str => (str || '').replace(/\s+/g, '').toLowerCase();

//   useEffect(() => {
//     const meta = JSON.parse(localStorage.getItem('finalQuizMeta')) || {};
//     const qs = JSON.parse(localStorage.getItem('finalQuizQuestions')) || [];
//     const ans = JSON.parse(localStorage.getItem('studentAnswers')) || {};

//     setQuizMeta(meta);
//     setQuestions(qs);
//     setAnswers(ans);

//     let sc = 0;
//     qs.forEach((q, i) => {
//       const userAns = ans[i];
//       const correctAns = q.correctAnswer;

//       if (!userAns || !correctAns) return;

//       if (q.type === 'match' && typeof userAns === 'object' && typeof correctAns === 'object') {
//         const allMatch = Object.keys(correctAns).every(
//           k => normalize(correctAns[k]) === normalize(userAns[k])
//         );
//         if (allMatch) sc++;
//       } else if (normalize(userAns) === normalize(correctAns)) {
//         sc++;
//       }
//     });

//     setScore(sc);

//     setTimeout(() => {
//       const ctx = document.getElementById('resultChart')?.getContext('2d');
//       if (!ctx) return;

//       new Chart(ctx, {
//         type: 'bar',
//         data: {
//           labels: ['Correct', 'Wrong'],
//           datasets: [{
//             label: 'Result',
//             data: [sc, qs.length - sc],
//             backgroundColor: ['#28a745', '#dc3545']
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           scales: {
//             y: { beginAtZero: true }
//           }
//         }
//       });
//     }, 300);
//   }, []);

//   return (
//     <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f9fafe' }}>
      
//       {/* Header */}
//       <div className="text-white py-3 px-4" style={{
//         background: 'linear-gradient(to right, #015794, #437FAA)',
//         borderBottomLeftRadius: '60px',
//         borderBottomRightRadius: '60px'
//       }}>
//         <div className="d-flex justify-content-between align-items-center container-fluid">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Quiz Results</h4>
//           <button className="btn btn-light" onClick={() => navigate('/creator')}>Back</button>
//         </div>
//       </div>

//       <div className="container mt-4 text-center">
//         <h2 className="fw-bold">{quizMeta.title || 'Quiz Result'}</h2>
//         <p className="text-muted">{quizMeta.description}</p>
//         <h4 className="mt-3">Your Score: <span className="text-success">{score}</span> / {questions.length}</h4>
//         <h6 className="text-muted">Percentage: {(questions.length ? ((score / questions.length) * 100).toFixed(2) : 0)}%</h6>
//       </div>

//       {/* Bar Chart */}
//       <div className="d-flex justify-content-center my-4" style={{ width: '100%' }}>
//         <div style={{ width: '90%', maxWidth: '500px', height: '300px' }}>
//           <canvas id="resultChart" height="300"></canvas>
//         </div>
//       </div>

//       {/* Answer Breakdown */}
//       <div className="container" style={{ maxWidth: '900px' }}>
//         {questions.map((q, index) => {
//           const userAns = answers[index] || '';
//           const correctAns = q.correctAnswer || '';
//           const isCorrect = (() => {
//             if (q.type === 'match' && typeof userAns === 'object' && typeof correctAns === 'object') {
//               return Object.keys(correctAns).every(
//                 k => normalize(correctAns[k]) === normalize(userAns[k])
//               );
//             }
//             return normalize(userAns) === normalize(correctAns);
//           })();

//           return (
//             <div key={index} className="card mb-3 shadow-sm">
//               <div className="card-body">
//                 <h5 className="fw-bold mb-2">Q{index + 1}: {q.question}</h5>

//                 {q.type === 'match' && Array.isArray(q.options) && (
//                   <div className="row mb-2 text-center">
//                     <div className="col"><strong>Left</strong></div>
//                     <div className="col"><strong>Right</strong></div>
//                   </div>
//                 )}
//                 {q.type === 'match' && q.options.map((pair, i) => (
//                   <div key={i} className="row mb-2 text-center align-items-center">
//                     <div className="col">{pair.left}</div>
//                     <div className="col">➡️ {pair.right}</div>
//                   </div>
//                 ))}

//                 <p className="mb-1">
//                   <strong>Your Answer:</strong>{" "}
//                   <span className={isCorrect ? 'text-success' : 'text-danger'}>
//                     {typeof userAns === 'object'
//                       ? Object.entries(userAns).map(([k, v]) => `${k}: ${v}`).join(', ')
//                       : userAns || <em>Not Answered</em>}
//                   </span>
//                 </p>
//                 <p className="mb-0">
//                   <strong>Correct Answer:</strong>{" "}
//                   {typeof correctAns === 'object'
//                     ? Object.entries(correctAns).map(([k, v]) => `${k}: ${v}`).join(', ')
//                     : correctAns}
//                 </p>

//                 {isCorrect
//                   ? <span className="badge bg-success mt-2">Correct</span>
//                   : <span className="badge bg-danger mt-2">Incorrect</span>}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="text-center my-4">
//         <button className="btn btn-primary" onClick={() => navigate('/creator')}>
//           Back to Dashboard
//         </button>
//       </div>

//       <footer className="text-center text-muted py-3 bg-light w-100 mt-auto">
//         © 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }
