// File: src/pages/QuizOverview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import BackToDashboardButton from "../components/BackToDashboardButton";

export default function QuizOverview() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");

        if (!userId || !token) {
          console.log("Missing userId or token in localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/quiz/quiz_overview/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("API Response:", data);

        // 🔥 FIXED HERE
        if (data.success && Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes);
        } else {
          console.log("Unexpected data:", data);
        }

      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", width: "100vw", backgroundColor: "#f0f3f9" }}
    >
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

      <div className="container-fluid mt-4 px-4" style={{ flexGrow: 1 }}>
        {quizzes.length === 0 ? (
          <div className="text-center mt-5">
            <p className="text-muted">No quizzes found.</p>
          </div>
        ) : (
          <div className="table-responsive bg-white shadow rounded p-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Quiz Title</th>
                  <th>Code</th>
                  <th>Created On</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={quiz._id || index}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{quiz.title}</td>
                    <td>{quiz.code}</td>
                    <td>{new Date(quiz.createdAt).toLocaleString()}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/QuizAttemptedByStudents/${quiz._id}`)}
                      >
                        View Attempts
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
