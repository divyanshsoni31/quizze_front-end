import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackToDashboardButton from "../components/BackToDashboardButton";
import logo from "../assets/logo.png";

export default function AllAttempter() {
  const { quizId } = useParams();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `http://localhost:3000/api/quiz/attempts/${quizId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Attempts Response:", data);

        if (data.success) {
          setAttempts(data.attempts);
        }
      } catch (err) {
        console.error("Error fetching attempts:", err);
      }
    };

    fetchAttempts();
  }, [quizId]);

  return (
    <div className="d-flex flex-column"
      style={{ minHeight: "100vh", width: "100vw", backgroundColor: "#f0f3f9" }}>

      <div className="text-white py-3 px-4"
        style={{
          background: "linear-gradient(to right, #015794, #437FAA)",
          borderBottomLeftRadius: "60px",
          borderBottomRightRadius: "60px",
        }}>
        <div className="d-flex justify-content-between align-items-center container-fluid">
          <img src={logo} alt="Quizze Logo" style={{ width: "140px" }} />
          <h4 className="mb-0 fw-bold">Quiz Attempts</h4>
          <BackToDashboardButton text="Dashboard" />
        </div>
      </div>

      <div className="container-fluid mt-4 px-4" style={{ flexGrow: 1 }}>
        {attempts.length === 0 ? (
          <div className="text-center mt-5">
            <p className="text-muted">No attempts found.</p>
          </div>
        ) : (
          <div className="table-responsive bg-white shadow rounded p-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Percentage</th>
                </tr>
              </thead>

              <tbody>
                {attempts.map((a, index) => {
                  const percentage = ((a.correctCount / a.totalQuestions) * 100).toFixed(2);

                  return (
                    <tr key={a._id}>
                      <td>{index + 1}</td>
                      <td>{a.attemptedByName}</td>
                      <td>{a.quizTitle}</td>
                      <td>{new Date(a.attemptedAt).toLocaleString()}</td>
                      <td>{a.correctCount} / {a.totalQuestions}</td>
                      <td><strong>{percentage}%</strong></td>
                    </tr>
                  );
                })}
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
