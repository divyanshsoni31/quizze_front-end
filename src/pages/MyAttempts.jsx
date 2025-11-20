import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function MyAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [filteredAttempts, setFilteredAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch attempts from backend API
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:3000/api/quiz/my-attempts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setAttempts(data.attempts.reverse());
          setFilteredAttempts(data.attempts.reverse());
        } else {
          console.error("Failed to fetch attempts:", data.message);
        }
      } catch (err) {
        console.error("Error fetching attempts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  // ✅ Handle search
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    setFilteredAttempts(
      attempts.filter((a) =>
        a.quizMeta?.title?.toLowerCase().includes(lowerSearch)
      )
    );
  }, [searchTerm, attempts]);

  // ✅ Format date
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", width: "100vw", backgroundColor: "#f4f8ff" }}
    >
      {/* Header */}
      <header
        className="py-3 px-4 text-white"
        style={{
          background: "linear-gradient(to right, #015794, #3A82B9)",
          borderBottomLeftRadius: "60px",
          borderBottomRightRadius: "60px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center container-fluid">
          <img
            src={logo}
            alt="Quizze Logo"
            style={{ width: "110px", cursor: "pointer" }}
            onClick={() => navigate("/creator-dashboard")}
          />
          <h4 className="mb-0 fw-bold text-center flex-grow-1">My Attempts</h4>
          <button className="btn btn-light" onClick={() => navigate('/creator')}>
            ← Back
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="container my-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search by quiz title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Content */}
      <div className="container-fluid flex-grow-1 d-flex flex-column justify-content-start my-2">
        {loading ? (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted fs-5">
            Loading your attempts...
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted fs-5">
            No attempts found.
          </div>
        ) : (
          <div className="row g-4 px-4 justify-content-start">
            {filteredAttempts.map((a, i) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-4" key={i}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="flex-grow-1">
                      <h5 className="card-title text-primary fw-bold">
                        {a.quizMeta?.title || "Untitled Quiz"}
                      </h5>
                      <p className="text-muted mb-1">
                        <strong>Quiz Code:</strong> {a.quizCode}
                      </p>
                      <p className="text-muted mb-1">
                        <strong>Score:</strong> {a.score} / {a.total} (
                        {a.percentage}%)
                      </p>
                      <div className="progress my-2" style={{ height: "8px" }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${a.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-muted small mb-3">
                        Attempted on: {formatDate(a.attemptedAt)}
                      </p>
                    </div>
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() =>
                        navigate("/result", { state: { attemptId: a.attemptId } })
                      }
                    >
                      View Result
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-3 bg-light mt-auto">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
