    // File: src/pages/QuizOverview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import BackToDashboardButton from "../components/BackToDashboardButton";

export default function QuizOverview() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const creatorEmail = sessionStorage.getItem("userEmail");
    const stored = JSON.parse(localStorage.getItem(`quizzes_${creatorEmail}`)) || [];
    setQuizzes(stored);
  }, []);

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", width: "100vw", backgroundColor: "#f0f3f9" }}
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
          <h4 className="mb-0 fw-bold">Quiz Overview</h4>
          <BackToDashboardButton text="Dashboard" />
        </div>
      </div>

      {/* Quiz List */}
      <div className="container mt-4 px-3" style={{ flexGrow: 1 }}>
        {quizzes.length === 0 ? (
          <p className="text-center text-muted mt-5">No quizzes found.</p>
        ) : (
          quizzes.map((quiz, i) => (
            <div
              key={i}
              className="bg-white shadow rounded p-4 mb-4"
              style={{ borderLeft: "6px solid #015794" }}
            >
              <h2 className="fw-bold">{quiz.meta?.title || "Untitled Quiz"}</h2>

              <h5 className="text-muted mb-2">
                <strong>Code:</strong> {quiz.code}
              </h5>

              <h6 className="text-muted mb-3">
                <strong>Created On:</strong>{" "}
                {new Date(quiz.createdAt).toLocaleString() || "N/A"}
              </h6>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/view-results")}
              >
                View Attempts
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
