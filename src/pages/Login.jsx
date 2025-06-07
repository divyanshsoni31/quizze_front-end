// File: src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../assets/logo1.png';
import emailIcon from '../assets/icon-email.png';
import lockIcon from '../assets/icon-lock.png';
import bulb from '../assets/icon-bulb.png';
import pencil from '../assets/icon-pencil.png';
import trophy from '../assets/icon-trophy.png';
import question from '../assets/icon-question.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = (e) => {
  e.preventDefault();

  try {
    const stored = localStorage.getItem(email);

    if (!stored) {
      alert("❌ No user found with this email");
      return;
    }

    const user = JSON.parse(stored);

    if (!user.password || !user.role) {
      alert("⚠️ Invalid user data found.");
      return;
    }

    if (!user.verified) {
      alert("⚠️ Email not verified. Please complete OTP verification.");
      return;
    }

    if (user.password !== password) {
      alert("❌ Incorrect password");
      return;
    }

    // ✅ Store session info
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userName", user.name || "User");

    // ✅ Redirect
    navigate(user.role === "student" ? "/student" : "/creator");

  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong while logging in. Please try again.");
  }
};


  return (
    <div
      className="position-relative d-flex justify-content-center align-items-center"
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #015794, #437FAA)',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      {/* Background Icons */}
          <img src={pencil} alt="Pencil" className="position-absolute" style={{ top: '5%', left: '5%', width: '175px', opacity: 2, transform: 'rotate(-1deg)' }} />
          <img src={trophy} alt="Trophy" className="position-absolute" style={{ bottom: '5%', left: '8%', width: '230px', opacity: 2, transform: 'rotate(-32deg)' }} />
          <img src={question} alt="Question" className="position-absolute" style={{ bottom: '59%', left: '89%', transform: 'translateX(-50%) rotate(73deg)', width: '320px', opacity: 2, zIndex: 0 }} />
          <img src={bulb} alt="Bulb" className="position-absolute" style={{ bottom: '4%', right: '2%', width: '320px', opacity: 2, transform: 'rotate(-17deg)' }} />
      
      <div className="bg-light shadow px-4 py-3 position-relative" style={{ width: '100%', maxWidth: '500px', borderRadius: '40px', zIndex: 1 }}>
         <div className="text-center">
          <img src={logo1} alt="Logo1" style={{ width: '200px' }} />
          <h5 className="mt-2 mb-3">Login to QUIZZE</h5>
        </div>

        <form onSubmit={handleLogin}>
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

          <div className="mb-3 input-group">
            <span className="input-group-text">
              <img src={lockIcon} alt="Password" width="20" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>

          <p className="text-center mt-3">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}
