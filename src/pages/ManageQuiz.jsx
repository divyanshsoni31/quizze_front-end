import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function ManageQuiz() {
  const navigate = useNavigate();
  const creatorEmail = localStorage.getItem('userEmail');
  const quizzesKey = `quizzes_${creatorEmail}`;

  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 6;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(quizzesKey)) || [];
    setQuizzes(stored);
    setFilteredQuizzes(stored);
  }, [quizzesKey]);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    const updated = quizzes.filter(q => q.id !== id);
    setQuizzes(updated);
    setFilteredQuizzes(updated);
    localStorage.setItem(quizzesKey, JSON.stringify(updated));
  };

  const handleEdit = (quiz) => {
    localStorage.setItem('createdQuizMeta', JSON.stringify(quiz.meta));
    localStorage.setItem('createdQuizQuestions', JSON.stringify(quiz.questions));
    navigate('/preview-quiz');
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = quizzes.filter(q => q.meta.title.toLowerCase().includes(value));
    setFilteredQuizzes(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
  const startIdx = (currentPage - 1) * quizzesPerPage;
  const paginatedQuizzes = filteredQuizzes.slice(startIdx, startIdx + quizzesPerPage);

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
          <h4 className="mb-0 fw-bold">Manage Quizzes</h4>
          <button className="btn btn-light" onClick={() => navigate('/creator')}>Dashboard</button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container my-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search by quiz title..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Quiz Cards Section */}
      <div className="container-fluid flex-grow-1 d-flex flex-column">
        <div className="row g-4 px-4 flex-grow-1">
          {paginatedQuizzes.length === 0 ? (
            <div className="col-12 text-center text-muted">No quizzes found.</div>
          ) : (
            paginatedQuizzes.map((quiz, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
  <div className="flex-grow-1">
    <h5 className="card-title text-capitalize fw-bold">
      {quiz.meta.title || 'Untitled Quiz'}
    </h5>
    <p className="card-text text-muted">{quiz.meta.description || 'No description provided.'}</p>
    <p className="mb-1"><strong>Time Limit:</strong> {quiz.meta.timeLimit || 0} min</p>
    <p className="mb-1"><strong>Difficulty:</strong> {quiz.meta.difficulty || 'N/A'}</p>
    <p className="text-muted fst-italic">Created: {new Date(quiz.createdAt).toLocaleString()}</p>
  </div>
  
  <div className="d-flex justify-content-between mt-3">
    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(quiz)}>
      ✏️ Edit
    </button>
    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(quiz.id)}>
      🗑 Delete
    </button>
  </div>
</div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="text-center my-3">
          <ul className="pagination justify-content-center mb-0">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-muted py-3 bg-light w-100 mt-auto">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}










// // File: src/pages/ManageQuiz.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function ManageQuiz() {
//   const navigate = useNavigate();
//   const [quizzes, setQuizzes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const formatDate = (isoString) => {
//   const date = new Date(isoString);
//   return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
// };


//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('quizzes')) || [];
//     setQuizzes(stored);
//   }, []);

//   const handleDelete = (quizId) => {
//     if (window.confirm("Are you sure you want to delete this quiz?")) {
//       const updated = quizzes.filter(q => q.id !== quizId);
//       setQuizzes(updated);
//       localStorage.setItem('quizzes', JSON.stringify(updated));
//     }
//   };

//   const handleEdit = (quiz) => {
//     localStorage.setItem('createdQuizMeta', JSON.stringify(quiz.meta));
//     localStorage.setItem('createdQuizQuestions', JSON.stringify(quiz.questions));
//     localStorage.setItem('editingQuizId', quiz.id);
//     navigate('/preview-quiz');
//   };

//   const filteredQuizzes = quizzes.filter(q =>
//     q.meta?.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f9fafe', width: '100vw' }}>
//       {/* Header */}
//       <div className="text-white py-3 px-4" style={{
//         background: 'linear-gradient(to right, #015794, #437FAA)',
//         borderBottomLeftRadius: '60px',
//         borderBottomRightRadius: '60px'
//       }}>
//         <div className="d-flex justify-content-between align-items-center container-fluid">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Manage Quizzes</h4>
//           <button className="btn btn-light" onClick={() => navigate('/creator')}>Back to Dashboard</button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="container-fluid my-4 px-4">
//         <div className="row justify-content-center">
//           <div className="col-md-6">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search quiz by title..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Quiz List */}
//       <div className="container-fluid px-4">
//         {filteredQuizzes.length === 0 ? (
//           <p className="text-center text-muted">No quizzes found.</p>
//         ) : (
//           <div className="row">
//             {filteredQuizzes.map((quiz) => (
//               <div className="col-lg-4 col-md-6 mb-4" key={quiz.id}>
//                 <div className="card shadow-sm h-100">
//                   <div className="card-body d-flex flex-column justify-content-between">
//                     <div>
//                       <h5 className="card-title fw-bold">{quiz.meta.title}</h5>
//                       <p className="card-text">{quiz.meta.description}</p>
//                        <small className="text-muted">Created: {formatDate(quiz.meta.createdAt)}</small>
//                     </div>
//                     <div className="d-flex justify-content-between mt-3">
//                       <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(quiz)}>
//                         Edit
//                       </button>
//                       <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(quiz.id)}>
//                         Delete
//                       </button>
                      
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
//         © 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }
