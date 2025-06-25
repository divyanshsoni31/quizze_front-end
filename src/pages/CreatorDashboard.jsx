// File: src/pages/CreatorDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import bulb1 from '../assets/icon-bulb1.png';
import pencil1 from '../assets/icon-pencil1.png';
import trophy1 from '../assets/icon-trophy1.png';
import question1 from '../assets/icon-question1.png';

export default function CreatorDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#fff', overflow: 'hidden' }}>
      {/* Background Icons */}
      <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '43%', left: '4%', width: '185px', opacity: 2, transform: 'rotate(-1deg)' }} />
      <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '1%', width: '205px', opacity: 3, transform: 'rotate(7deg)' }} />
      <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '1%', left: '92.5%', transform: 'translateX(-49%) rotate(-2deg)', width: '210px', opacity: 2.5, zIndex: 0 }} />
      <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '34%', right: '2%', width: '215px', opacity: 2, transform: 'translateX(-19%) rotate(-1deg)' }} />

     {/* Header */}
<div className="text-white pt-4 pb-3 px-4" style={{
  background: 'linear-gradient(to right, #015794, #437FAA)',
  borderBottomLeftRadius: '80px',
  borderBottomRightRadius: '80px',
  width: '100%',
  zIndex: 1
}}>
  <div className="container d-flex justify-content-between align-items-center flex-wrap">
    <img src={logo} alt="Logo" style={{ width: '160px' }} />

    <div className="d-flex gap-2 flex-wrap justify-content-end">
      {/* ✅ New Button: View My Quiz Attempts as Creator */}
      <button className="btn btn-outline-light fw-bold" onClick={() => navigate('/student-results')}>
        My Attempts
      </button>

      <button className="btn btn-outline-light fw-bold" onClick={() => navigate('/join-quiz')}>Join Quiz</button>
      <button className="btn btn-outline-light fw-bold" onClick={() => navigate('/create-quiz')}>Create Quiz</button>
      <button className="btn btn-outline-light fw-bold" onClick={() => navigate('/manage-quiz')}>View Quizzes</button>
      <button className="btn btn-light fw-bold" onClick={handleLogout}>Logout</button>
    </div>
  </div>

  <div className="text-center mt-3">
    <h1 className="fw-bold">Welcome, Creator!</h1>
    <p className="lead">Manage your quizzes and track student performance with ease.</p>
  </div>
</div>


      {/* Dashboard Boxes */}
      <div className="container flex-grow-1 d-flex justify-content-center align-items-center flex-wrap gap-4 mt-5">
        {/* Create Quiz Box */}
        <div className="bg-white shadow p-4 text-center rounded" style={{ width: '300px', minHeight: '200px' }}>
          <h3 className="fw-bold">Create New Quiz</h3>
          <p>Design and publish a quiz for your students.</p>
          <button className="btn btn-primary px-4" onClick={() => navigate('/create-quiz')}>Create Quiz</button>
        </div>

        {/* Manage Quiz Box */}
        <div className="bg-white shadow p-4 text-center rounded" style={{ width: '300px', minHeight: '200px' }}>
          <h3 className="fw-bold">Manage Quizzes</h3>
          <p>Manage every quiz that you created.</p>
          <button className="btn btn-secondary px-4" onClick={() => navigate('/manage-quiz')}>View Quizzes</button>
        </div>

        {/* View Results Box */}
        <div className="bg-white shadow p-4 text-center rounded" style={{ width: '300px', minHeight: '200px' }}>
          <h3 className="fw-bold">Quiz Results</h3>
          <p>Check scores and performance analytics.</p>
          <button className="btn btn-success px-4" onClick={() => navigate('/view-results')}>View Results</button>
        </div>
      </div>

      <footer className="text-center mt-5 mb-3">
        <p className="text-muted">&copy; 2025 QUIZZE. All rights reserved.</p>
      </footer>
    </div>
  );
}
