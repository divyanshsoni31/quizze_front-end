// import React, { useEffect, useState } from 'react';
// import Chart from 'chart.js/auto';
// import logo from '../assets/logo.png';
// import BackToDashboardButton from '../components/BackToDashboardButton';

// export default function StudentResults() {
//   const [attempts, setAttempts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const resultsPerPage = 6;
//   const userEmail = localStorage.getItem('userEmail');

//   // Load quiz attempts
//   useEffect(() => {
//     const quizKeys = Object.keys(localStorage).filter(key => key.startsWith('attemptedResults_'));
//     const allResults = [];

//     quizKeys.forEach((key) => {
//       const results = JSON.parse(localStorage.getItem(key)) || [];
//       results.forEach((r) => {
//         if (r.studentEmail === userEmail) {
//           allResults.push({ ...r, quizCode: key.replace('attemptedResults_', '') });
//         }
//       });
//     });

//     setAttempts(allResults);
//   }, [userEmail]);

//   // Render charts only for current page
//   useEffect(() => {
//     const startIdx = (currentPage - 1) * resultsPerPage;
//     const current = attempts.slice(startIdx, startIdx + resultsPerPage);

//     current.forEach((attempt, idx) => {
//       const chartId = `chart-${startIdx + idx}`;
//       const correct = attempt.score;
//       const wrong = attempt.total - correct;

//       const ctx = document.getElementById(chartId)?.getContext('2d');
//       if (ctx) {
//         new Chart(ctx, {
//           type: 'bar',
//           data: {
//             labels: ['Correct', 'Wrong'],
//             datasets: [{
//               label: 'Your Result',
//               data: [correct, wrong],
//               backgroundColor: ['#28a745', '#dc3545']
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: { y: { beginAtZero: true } }
//           }
//         });
//       }
//     });
//   }, [attempts, currentPage]);

//   const totalPages = Math.ceil(attempts.length / resultsPerPage);
//   const startIndex = (currentPage - 1) * resultsPerPage;
//   const currentAttempts = attempts.slice(startIndex, startIndex + resultsPerPage);

//   return (
//     <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f0f3f9' }}>
      
//       {/* Header */}
//       <div className="text-white py-3 px-4" style={{
//         background: 'linear-gradient(to right, #015794, #437FAA)',
//         borderBottomLeftRadius: '60px',
//         borderBottomRightRadius: '60px'
//       }}>
//         <div className="d-flex justify-content-between align-items-center container-fluid">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">My Quiz Results</h4>
//           <BackToDashboardButton text="Dashboard" />
//         </div>
//       </div>

//       {/* Results Grid */}
//       <div className="container-fluid px-4 py-4" style={{ flexGrow: 1 }}>
//         {attempts.length === 0 ? (
//           <p className="text-muted text-center">No results found.</p>
//         ) : (
//           <>
//             <div className="row">
//               {currentAttempts.map((attempt, idx) => {
//                 const chartId = `chart-${startIndex + idx}`;
//                 const correct = attempt.score;
//                 const total = attempt.total;

//                 return (
//                   <div className="col-12 col-sm-6 col-lg-4 mb-4" key={chartId}>
//                     <div className="card shadow-sm h-100">
//                       <div className="card-body">
//                         <h5 className="fw-bold">{attempt.quizMeta?.title || 'Untitled Quiz'}</h5>
//                         <p className="text-muted">{attempt.quizMeta?.description}</p>
//                         <p><strong>Date:</strong> {new Date(attempt.attemptedAt).toLocaleString()}</p>
//                         <p><strong>Score:</strong> {correct} / {total}</p>
//                         <p><strong>Percentage:</strong> {attempt.percentage}%</p>
//                         <div style={{ width: '100%', height: '200px' }}>
//                           <canvas id={chartId}></canvas>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="text-center mt-3">
//                 <nav>
//                   <ul className="pagination justify-content-center">
//                     {Array.from({ length: totalPages }, (_, i) => (
//                       <li
//                         key={i}
//                         className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => setCurrentPage(i + 1)}
//                         >
//                           {i + 1}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </nav>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Footer */}
//       <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
//         © 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import logo from '../assets/logo.png';
import BackToDashboardButton from '../components/BackToDashboardButton';

export default function StudentResults() {
  const [attempts, setAttempts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;
  const userEmail = localStorage.getItem('userEmail');

  // ✅ Load quiz attempts
  useEffect(() => {
    const quizKeys = Object.keys(localStorage).filter(key => key.startsWith('attemptedResults_'));
    const allResults = [];

    quizKeys.forEach((key) => {
      const results = JSON.parse(localStorage.getItem(key)) || [];
      results.forEach((r) => {
        if (r.studentEmail === userEmail) {
          allResults.push({ ...r, quizCode: key.replace('attemptedResults_', '') });
        }
      });
    });

    setAttempts(allResults);
  }, [userEmail]);

  // ✅ Render charts for current page
  useEffect(() => {
    const startIdx = (currentPage - 1) * resultsPerPage;
    const current = attempts.slice(startIdx, startIdx + resultsPerPage);

    current.forEach((attempt, idx) => {
      const chartId = `chart-${startIdx + idx}`;
      const correct = attempt.score;
      const total = attempt.total;
      const answers = attempt.answers || {};
      const answered = Object.keys(answers).length;
      const unanswered = total - answered;
      const wrong = total - correct - unanswered;

      const ctx = document.getElementById(chartId)?.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Correct', 'Wrong', ...(unanswered > 0 ? ['Unanswered'] : [])],
            datasets: [{
              label: 'Answer Comparison',
              data: [correct, wrong, ...(unanswered > 0 ? [unanswered] : [])],
              backgroundColor: ['#28a745', '#dc3545', ...(unanswered > 0 ? ['#6c757d'] : [])]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
          }
        });
      }
    });
  }, [attempts, currentPage]);

  const totalPages = Math.ceil(attempts.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentAttempts = attempts.slice(startIndex, startIndex + resultsPerPage);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f0f3f9' }}>
      
      {/* ✅ Header */}
      <div className="text-white py-3 px-4" style={{
        background: 'linear-gradient(to right, #015794, #437FAA)',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px'
      }}>
        <div className="d-flex justify-content-between align-items-center container-fluid">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h4 className="mb-0 fw-bold">My Quiz Results</h4>
          <BackToDashboardButton text="Dashboard" />
        </div>
      </div>

      {/* ✅ Results Grid */}
      <div className="container-fluid px-4 py-4" style={{ flexGrow: 1 }}>
        {attempts.length === 0 ? (
          <p className="text-muted text-center">No results found.</p>
        ) : (
          <>
            <div className="row">
              {currentAttempts.map((attempt, idx) => {
                const chartId = `chart-${startIndex + idx}`;
                const correct = attempt.score;
                const total = attempt.total;
                const answers = attempt.answers || {};
                const answered = Object.keys(answers).length;
                const unanswered = total - answered;
                const wrong = total - correct - unanswered;

                return (
                  <div className="col-12 col-sm-6 col-lg-4 mb-4" key={chartId}>
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="fw-bold">{attempt.quizMeta?.title || 'Untitled Quiz'}</h5>
                        <p className="text-muted">{attempt.quizMeta?.description}</p>
                        <p><strong>Date:</strong> {new Date(attempt.attemptedAt).toLocaleString()}</p>
                        <p><strong>Score:</strong> {correct} / {total}</p>
                        <p><strong>Percentage:</strong> {attempt.percentage}%</p>

                        <div style={{ width: '100%', height: '200px' }}>
                       <canvas id={chartId}></canvas>
                </div>
                <div className="text-center mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      localStorage.setItem('finalQuizMeta', JSON.stringify(attempt.quizMeta));
                      localStorage.setItem('finalQuizQuestions', JSON.stringify(attempt.questions || []));
                      localStorage.setItem('studentAnswers', JSON.stringify(attempt.answers || {}));
                      localStorage.setItem('fromPage', 'student-results');

                      window.location.href = '/result';  // 🔄 navigate to detailed result page
                         }}
                        >
    View Details
  </button>
</div>


                        {/* ✅ Breakdown under chart */}
                        <div className="mt-3 small">
                          <p className="mb-1"><strong>Correct:</strong> {correct}</p>
                          <p className="mb-1"><strong>Wrong:</strong> {wrong}</p>
                          {unanswered > 0 && (
                            <p className="mb-1"><strong>Unanswered:</strong> {unanswered}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="text-center mt-3">
                <nav>
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i}
                        className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
