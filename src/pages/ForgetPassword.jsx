// File: src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo1 from "../assets/logo1.png";
import emailIcon from "../assets/icon-email.png";
import bulb from "../assets/icon-bulb.png";
import pencil from "../assets/icon-pencil.png";
import trophy from "../assets/icon-trophy.png";
import question from "../assets/icon-question.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔁 Change URL if your backend uses a different route
      await axios.post("http://localhost:3000/api/auth/forgot-password", {
        email,
      });

      alert("If this email is registered, a reset link has been sent.");
      navigate("/login");
    } catch (err) {
      console.error("Forgot password error:", err);
      alert(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-relative d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #015794, #437FAA)",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Background Icons */}
      <img
        src={pencil}
        alt="Pencil"
        className="position-absolute"
        style={{
          top: "5%",
          left: "5%",
          width: "175px",
          opacity: 2,
          transform: "rotate(-1deg)",
        }}
      />
      <img
        src={trophy}
        alt="Trophy"
        className="position-absolute"
        style={{
          bottom: "5%",
          left: "8%",
          width: "230px",
          opacity: 2,
          transform: "rotate(-32deg)",
        }}
      />
      <img
        src={question}
        alt="Question"
        className="position-absolute"
        style={{
          bottom: "59%",
          left: "89%",
          transform: "translateX(-50%) rotate(73deg)",
          width: "320px",
          opacity: 2,
          zIndex: 0,
        }}
      />
      <img
        src={bulb}
        alt="Bulb"
        className="position-absolute"
        style={{
          bottom: "4%",
          right: "2%",
          width: "320px",
          opacity: 2,
          transform: "rotate(-17deg)",
        }}
      />

      {/* Card */}
      <div
        className="bg-light shadow px-4 py-3 position-relative"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "40px",
          zIndex: 1,
        }}
      >
        <div className="text-center">
          <img src={logo1} alt="Logo1" style={{ width: "200px" }} />
          <h5 className="mt-2 mb-3">Forgot Password</h5>
          <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
            Enter your registered email and we’ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleForgotPassword}>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <img src={emailIcon} alt="Email" width="20" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>

          <p className="text-center mt-3 mb-1">
            Remembered your password?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
