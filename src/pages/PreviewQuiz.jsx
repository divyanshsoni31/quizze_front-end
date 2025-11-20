// File: src/pages/PreviewQuiz.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function PreviewQuiz() {
  const navigate = useNavigate();
  const [quizMeta, setQuizMeta] = useState({});
  const [questions, setQuestions] = useState([]);
  const [quizCode, setQuizCode] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
    const manualQs = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
    const bankQs = JSON.parse(localStorage.getItem('selectedQuestionBankQuestions')) || [];
    const combined = [...manualQs, ...bankQs.filter(q => !manualQs.find(mq => mq.id === q.id))];

    setQuizMeta(meta);
    setQuestions(combined);

    const creatorEmail = localStorage.getItem('userEmail');
    const quizzesKey = `quizzes_${creatorEmail}`;
    const existingQuizzes = JSON.parse(localStorage.getItem(quizzesKey)) || [];

    const existing = existingQuizzes.find(q => q.meta.title === meta.title || q.id === meta.id);
    if (existing) setQuizCode(existing.code);
  }, []);

  const getSubjectName = () => {
    return quizMeta.subject === 'Other' ? quizMeta.customSubject : quizMeta.subject;
  };

  const handleFinalize = async () => {
  try {
    const creatorEmail = sessionStorage.getItem("userEmail");
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");   // 🔑 JWT token
    const quizMeta = JSON.parse(localStorage.getItem("createdQuizMeta"));
    const questions = JSON.parse(localStorage.getItem("createdQuizQuestions")) || [];

    // ✅ Format questions according to backend
    const formattedQuestions = questions.map((q) => {
      // normalize type
      let type =
        q.type === "truefalse"
          ? "true-false"
          : q.type === "fill"
          ? "fill-in-the-blank"
          : q.type === "match"
          ? "match-the-following"
          : q.type; // mcq stays mcq

      let questionData = {
        type,
        questionText: q.question || q.questionText,
        correctAnswer: q.correctAnswer || "",
      };

      if (type === "mcq") {
        questionData.options = q.options || [];
      }

      if (type === "match-the-following") {
        // frontend keeps options = correct pairs
        const pairs = q.options || q.pairs || [];
        questionData.pairs = pairs;
        questionData.correctAnswer = pairs; // ✅ backend expects this duplication
      }

      return {
        fromBank: q.fromBank || false,
        questionData,
      };
    });

    // ✅ Final payload
    const payload = {
      title: quizMeta?.title || "Untitled Quiz",
      description: quizMeta?.description || "",
      numQuestions: formattedQuestions.length,
      userId,
      subject: quizMeta?.subject || "General",
      timeLimit: Number(quizMeta?.timeLimit) || 0,
      difficulty: quizMeta?.difficulty || "easy",
      certificate: quizMeta?.certificate || false,
      questions: formattedQuestions,
    };

    console.log("📤 Sending quiz payload:", JSON.stringify(payload, null, 2));

    const response = await fetch("http://localhost:3000/api/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // ✅ use Bearer format
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create quiz");

    setQuizCode(
      data.code ||
        `QUIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    );

    alert("✅ Quiz successfully finalized & saved to backend!");

    // 🧹 Clear local data
    localStorage.removeItem("createdQuizMeta");
    localStorage.removeItem("createdQuizQuestions");
    localStorage.removeItem("finalQuizMeta");
    localStorage.removeItem("finalQuizQuestions");
    localStorage.removeItem("selectedQuestionBankQuestions");
    localStorage.setItem("quizReset", "true");

    navigate("/creator");
  } catch (err) {
    console.error("❌ Error finalizing quiz:", err);
    alert("⚠️ Failed to finalize quiz. Check console/logs.");
  }
};


  const handleDelete = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);

    setQuestions(updated);
    localStorage.setItem('createdQuizQuestions', JSON.stringify(updated));
    localStorage.setItem('tempQuestions', JSON.stringify(updated));
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditData(questions[index]);
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const updated = [...(editData.options || [])];
    updated[index] = value;
    setEditData({ ...editData, options: updated });
  };

  const handleMatchChange = (index, side, value) => {
    const updated = [...(editData.options || [])];
    updated[index] = { ...updated[index], [side]: value };
    setEditData({ ...editData, options: updated });
  };

  const saveEdit = () => {
    const updated = [...questions];
    updated[editingIndex] = editData;
    setQuestions(updated);
    setEditingIndex(null);
    setEditData(null);
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
          <h4 className="mb-0 fw-bold">Preview Quiz</h4>
          <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="container mt-4">
        <h2 className="fw-bold">{quizMeta.title || 'Untitled Quiz'}</h2>
        <p className="text-muted mb-1">{quizMeta.description || 'No description provided.'}</p>
        <p className="fw-semibold text-dark">📚 Subject: {getSubjectName()}</p>
        <div className="d-flex gap-4 text-muted flex-wrap">
          <span>📝 Questions: {questions.length}</span>
          <span>⏱ Time: {quizMeta.timeLimit || 0} mins</span>
          <span>📊 Difficulty: {quizMeta.difficulty || 'Not set'}</span>
        </div>
      </div>

      {/* Questions */}
      <div className="container my-4 flex-grow-1">
        {questions.map((q, index) => (
          <div key={index} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-2">
                  <span className="badge bg-primary me-2">Q{index + 1}</span>
                  <strong>{q.question}</strong>
                </h5>
                {editingIndex !== index && (
                  <div>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(index)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(index)}>Delete</button>
                  </div>
                )}
              </div>

              {editingIndex === index ? (
                <>
                  <input type="text" className="form-control mb-2" value={editData.question} onChange={(e) => handleEditChange('question', e.target.value)} />
                  {editData.type === 'mcq' && ['A', 'B', 'C', 'D'].map((label, i) => (
                    <div className="input-group mb-2" key={i}>
                      <span className="input-group-text">{label}</span>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.options?.[i] || ''}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                      />
                    </div>
                  ))}
                  {editData.type === 'truefalse' && (
                    <select className="form-select mb-2" value={editData.correctAnswer} onChange={(e) => handleEditChange('correctAnswer', e.target.value)}>
                      <option value="">Select</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  )}
                  {editData.type === 'fill' && (
                    <input type="text" className="form-control mb-2" value={editData.correctAnswer} onChange={(e) => handleEditChange('correctAnswer', e.target.value)} />
                  )}
                  {editData.type === 'match' && (editData.options || []).map((pair, i) => (
                    <div className="row mb-2" key={i}>
                      <div className="col">
                        <input type="text" className="form-control" placeholder={`Left ${i + 1}`} value={pair.left} onChange={(e) => handleMatchChange(i, 'left', e.target.value)} />
                      </div>
                      <div className="col">
                        <input type="text" className="form-control" placeholder={`Right ${i + 1}`} value={pair.right} onChange={(e) => handleMatchChange(i, 'right', e.target.value)} />
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-sm btn-success mt-2" onClick={saveEdit}>Save</button>
                </>
              ) : (
                <>
                  {q.type === 'mcq' && q.options?.map((opt, i) => (
                    <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
                  ))}
                  {q.type === 'truefalse' && (
                    <>
                      <div><strong>A.</strong> True</div>
                      <div><strong>B.</strong> False</div>
                    </>
                  )}
                  {q.type === 'fill' && <p className="text-muted fst-italic">Student will fill in the blank.</p>}
                  {(q.type === 'match' || q.type === 'match-the-following') && Array.isArray(q.options) && (
                    <>
                      <p className="text-muted mb-1">Match the following:</p>
                      {q.options.map((pair, idx) => (
                        <div className="row mb-2" key={idx}>
                          <div className="col-md-6"><strong>{String.fromCharCode(65 + idx)}</strong>: {pair.left}</div>
                          <div className="col-md-6"><strong>{idx + 1}</strong>: {pair.right}</div>
                        </div>
                      ))}
                    </>
                  )}
                  {(q.type === 'match' || q.type === 'match-the-following') ? (
                    <div className="mt-2 text-muted">
                      <p className="fw-bold">Correct:</p>
                      <ul className="mb-0">
                        {Array.isArray(q.correctAnswer) && q.correctAnswer.length > 0 ? (
                          q.correctAnswer.map((pair, idx) => (
                            <li key={idx}>
                              {pair.left} —&gt; {pair.right}
                            </li>
                          ))
                        ) : (
                          <li>No matching pairs available</li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-2 text-muted">
                      <strong>Correct:</strong>{" "}
                      {typeof q.correctAnswer === 'object'
                        ? JSON.stringify(q.correctAnswer)
                        : q.correctAnswer}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Final Buttons */}
      <div className="text-center mb-4">
        {quizCode ? (
          <>
            <p className="mb-2">
              <strong className="text-muted">Quiz Code:</strong>{' '}
              <span className="fw-bold text-primary">{quizCode}</span>
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap mb-3">
              <button className="btn btn-outline-primary" onClick={() => {
                navigator.clipboard.writeText(quizCode);
                alert('✅ Quiz code copied to clipboard!');
              }}>
                📋 Copy Quiz Code
              </button>
              <button className="btn btn-outline-dark" onClick={() => {
                const link = `${window.location.origin}/join-quiz?code=${quizCode}`;
                navigator.clipboard.writeText(link);
                alert('🔗 Join link copied to clipboard!');
              }}>
                📎 Copy Join Link
              </button>
            </div>
          </>
        ) : (
          <p className="text-danger fw-semibold">⚠️ Quiz code will be generated after you finalize the quiz.</p>
        )}
        <button className="btn btn-success px-4 py-2 fw-bold" onClick={handleFinalize}>
          Finalize Quiz
        </button>
      </div>

      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
