import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function ManageQuiz() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token'); // 👈 JWT saved during login
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const quizzesPerPage = 6;

  // 🔥 Fetch quizzes from backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3000/api/quiz/my-quizzes", { // 👈 adjust base URL if needed
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`, // send token
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch quizzes");
        }

        setQuizzes(data.quizzes || []);
        setFilteredQuizzes(data.quizzes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchQuizzes();
    } else {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
    }
  }, [token]);

  // 🔍 Search filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = quizzes.filter(q =>
      q.title.toLowerCase().includes(value)
    );
    setFilteredQuizzes(filtered);
    setCurrentPage(1);
  };

  // 🗑 Delete quiz (API call + UI update)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete quiz");

      // Remove from UI
      const updated = quizzes.filter(q => q._id !== id);
      setQuizzes(updated);
      setFilteredQuizzes(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  // ✏️ Edit/View Quiz
const handleEdit = (quiz) => {
  // ✅ Navigate with quizId
  navigate(`/preview-finalize-quiz/${quiz._id}`);
};


  // Pagination
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

      {/* Quiz Cards */}
     <div className="container-fluid my-4">
  <div className="row g-4 px-4 justify-content-start">
    {paginatedQuizzes.map((quiz) => (
      <div key={quiz._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="card shadow-sm h-100">
          <div className="card-body d-flex flex-column">
            <div className="flex-grow-1">
              <h5 className="card-title text-capitalize fw-bold">
                {quiz.title || 'Untitled Quiz'}
              </h5>
              <p className="card-text text-muted">
                {quiz.description || 'No description provided.'}
              </p>
              <p className="mb-1"><strong>Time Limit:</strong> {quiz.timeLimit || 0} min</p>
              <p className="mb-1"><strong>Difficulty:</strong> {quiz.difficulty || 'N/A'}</p>
              <p className="text-muted fst-italic">
                Created: {new Date(quiz.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(quiz)}>
                ✏️ View Quiz
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(quiz._id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
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
