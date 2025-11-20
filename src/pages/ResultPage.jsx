// File: src/pages/ResultPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Chart from "chart.js/auto";
import logo from "../assets/logo.png";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const attemptId = location.state?.attemptId;

  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fetch Attempt Details (if navigated from MyAttempts)
  const fetchAttemptResult = async (attemptId) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/quiz/attempt/${attemptId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch attempt result.");
      }

      setQuizResult(data.result);
      setLoading(false);
      renderChart(data.result.correctCount, data.result.wrongCount);
    } catch (err) {
      console.error("Error fetching attempt result:", err);
      setErrorMsg("Failed to load saved result.");
      setLoading(false);
    }
  };

  // ✅ Render Chart Function
  const renderChart = (correct, wrong) => {
    setTimeout(() => {
      const ctx = document.getElementById("resultChart")?.getContext("2d");
      if (!ctx) return;
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Correct", "Wrong"],
          datasets: [
            {
              label: "Result",
              data: [correct, wrong],
              backgroundColor: ["#28a745", "#dc3545"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        },
      });
    }, 300);
  };

  // ✅ Handle both sources (attempt from MyAttempts OR new quiz submission)
  useEffect(() => {
    const fetchQuizResult = async () => {
      const token = localStorage.getItem("token");

      // Case 1: Navigated from MyAttempts → Fetch by attemptId
      if (attemptId) {
        await fetchAttemptResult(attemptId);
        return;
      }

      // Case 2: Fresh attempt result (after quiz submission)
      try {
        const quizAttempt = JSON.parse(localStorage.getItem("quizAttemptResult"));
        const studentAnswers = JSON.parse(localStorage.getItem("studentAnswers")) || [];

        if (!token || !quizAttempt) {
          setErrorMsg("Missing token or quiz data.");
          setLoading(false);
          return;
        }

        const payload = {
          quizId: quizAttempt.quizId,
          userId: quizAttempt.attemptedById,
          answers: studentAnswers,
        };

        const response = await fetch("http://localhost:3000/api/quiz/attempt-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();

        setQuizResult(data.result);
        setLoading(false);
        renderChart(data.result.correctCount, data.result.wrongCount);
      } catch (err) {
        console.error("Error fetching result:", err);
        setErrorMsg("Failed to load quiz results.");
        setLoading(false);
      }
    };

    fetchQuizResult();
  }, [attemptId]);

  const handleBack = () => navigate('/my-attempts');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-center">
        <h4>Loading Result...</h4>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <h4 className="text-danger mb-3">{errorMsg}</h4>
        <button className="btn btn-primary" onClick={handleBack}>
          Go Back
        </button>
      </div>
    );
  }

  const result = quizResult;
  if (!result) return null;

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f9fafe",
        overflowX: "hidden",
      }}
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
        <div className="d-flex justify-content-between align-items-center w-100">
          <img src={logo} alt="Quizze Logo" style={{ width: "140px" }} />
          <h4 className="mb-0 fw-bold">Quiz Result</h4>
          <button className="btn btn-light" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center mt-4 px-3">
        <h2 className="fw-bold">{result.quizTitle || "Quiz Title"}</h2>
        <p className="text-muted mb-1">
          Attempted by: <strong>{result.attemptedByName}</strong>
        </p>
        <h5>
          Your Score: <span className="text-success">{result.score.toFixed(2)}%</span>
        </h5>
        <h6>
          Correct: <strong className="text-success">{result.correctCount}</strong>{" "}
          | Wrong: <strong className="text-danger">{result.wrongCount}</strong>
        </h6>
      </div>

      {/* Chart */}
      <div className="mx-auto mt-4 mb-4" style={{ width: "100%", maxWidth: "800px", height: "320px" }}>
        <canvas id="resultChart" height="320"></canvas>
      </div>

      {/* Questions */}
      <div className="px-4 mb-5 flex-grow-1" style={{ overflowY: "auto" }}>
        {result.questionResults?.map((q, index) => (
          <div key={index} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-2">
                Q{index + 1}: {q.questionText}
              </h5>
              <p>
                <strong>Your Answer:</strong>{" "}
                <span className={q.isCorrect ? "text-success" : "text-danger"}>
                  {q.userAnswer
                    ? Array.isArray(q.userAnswer)
                      ? q.userAnswer.map((p) => `${p.left} → ${p.right}`).join(", ")
                      : q.userAnswer
                    : "Not Answered"}
                </span>
              </p>
              <p>
                <strong>Correct Answer:</strong>{" "}
                {Array.isArray(q.correctAnswer)
                  ? q.correctAnswer.map((p) => `${p.left} → ${p.right}`).join(", ")
                  : q.correctAnswer || "N/A"}
              </p>
              <div className="mt-2">
                {q.isCorrect ? (
                  <span className="badge bg-success">Correct</span>
                ) : (
                  <span className="badge bg-danger">Incorrect</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
