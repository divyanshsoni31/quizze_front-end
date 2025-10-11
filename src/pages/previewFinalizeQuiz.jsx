// File: src/pages/ViewFinalQuiz.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

export default function ViewFinalQuiz() {
    const navigate = useNavigate();
    const { id } = useParams(); // ✅ get quiz id from URL
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!id) {
        console.error("❌ No quizId found in URL");
        return;
      }

      const res = await axios.get(
        `http://localhost:3000/api/quiz/my-quizzes/${id}`,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.data.success) {
        setQuiz(res.data.quiz);
      }
    } catch (err) {
      console.error("❌ Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchQuiz();
}, [id]);

    if (loading) return <p className="text-center mt-5">⏳ Loading...</p>;
    if (!quiz) return <p className="text-center mt-5 text-danger">⚠️ Quiz not found.</p>;

    const getSubjectName = () => {
        return quiz.subject === "Other" ? quiz.customSubject : quiz.subject;
    };

    return (
        <div
            className="d-flex flex-column"
            style={{ minHeight: "100vh", width: "100vw", backgroundColor: "#f9fafe" }}
        >
            {/* Header */}
            <div
                className="text-white py-3 px-4"
                style={{
                    background: "linear-gradient(to right, #015794, #437FAA)",
                    borderBottomLeftRadius: "60px",
                    borderBottomRightRadius: "60px",
                }}
            >
                <div className="d-flex justify-content-between align-items-center container-fluid">
                    <img src={logo} alt="Quizze Logo" style={{ width: "140px" }} />
                    <h4 className="mb-0 fw-bold">Finalized Quiz</h4>
                    <button className="btn btn-light" onClick={() => navigate("/manage-quiz")}>
                        Back
                    </button>
                </div>
            </div>

            {/* Meta Info */}
            <div className="container mt-4">
                <h2 className="fw-bold">{quiz.title || "Untitled Quiz"}</h2>
                <p className="text-muted mb-1">
                    {quiz.description || "No description provided."}
                </p>
                <p className="fw-semibold text-dark">📚 Subject: {getSubjectName()}</p>
                <div className="d-flex gap-4 text-muted flex-wrap">
                    <span>📝 Questions: {quiz.questions?.length || 0}</span>
                    <span>⏱ Time: {quiz.timeLimit || 0} mins</span>
                    <span>📊 Difficulty: {quiz.difficulty || "Not set"}</span>
                </div>
            </div>

            {/* Questions */}
            <div className="container my-4 flex-grow-1">
                {quiz.questions.map((q, index) => (
                    <div key={q._id || index} className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-2">
                                <span className="badge bg-primary me-2">Q{index + 1}</span>
                                <strong>{q.questionText || q.question}</strong>
                            </h5>

                            {q.type === "mcq" &&
                                q.options?.map((opt, i) => (
                                    <div key={i}>
                                        <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
                                    </div>
                                ))}

                            {q.type === "truefalse" && (
                                <>
                                    <div><strong>A.</strong> True</div>
                                    <div><strong>B.</strong> False</div>
                                </>
                            )}

                            {q.type === "fill" && (
                                <p className="text-muted fst-italic">
                                    Student will fill in the blank.
                                </p>
                            )}

                            {(q.type === "match" || q.type === "match-the-following") &&
                                Array.isArray(q.pairs || q.options) && (
                                    <>
                                        <p className="text-muted mb-1">Match the following:</p>
                                        {(q.pairs || q.options).map((pair, idx) => (
                                            <div className="row mb-2" key={idx}>
                                                <div className="col-md-6">
                                                    <strong>{String.fromCharCode(65 + idx)}</strong>: {pair.left}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>{idx + 1}</strong>: {pair.right}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                            {(q.type === "match" || q.type === "match-the-following") ? (
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
                                    {typeof q.correctAnswer === "object"
                                        ? JSON.stringify(q.correctAnswer)
                                        : q.correctAnswer}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quiz Code */}
            <div className="text-center mb-4">
                {quiz.code ? (
                    <>
                        <p className="mb-2">
                            <strong className="text-muted">Quiz Code:</strong>{" "}
                            <span className="fw-bold text-primary">{quiz.code}</span>
                        </p>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                                navigator.clipboard.writeText(quiz.code);
                                alert("✅ Quiz code copied!");
                            }}
                        >
                            📋 Copy Quiz Code
                        </button>
                    </>
                ) : (
                    <p className="text-danger fw-semibold">⚠️ Quiz code not available.</p>
                )}
            </div>

            <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
                © 2025 QUIZZE. All rights reserved.
            </footer>
        </div>
    );
}
