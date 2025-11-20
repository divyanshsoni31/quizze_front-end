// File: src/pages/StudentDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this line
import logo from '../assets/logo.png';
import bulb1 from '../assets/icon-bulb1.png';
import pencil1 from '../assets/icon-pencil1.png';
import trophy1 from '../assets/icon-trophy1.png';
import question1 from '../assets/icon-question1.png';

export default function StudentDashboard() {
  const navigate = useNavigate(); // ✅ Add this line
  return (
    <div
      className="position-relative d-flex flex-column"
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Background Icons */}
        <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '43%', left: '4%', width: '185px', opacity: 2, transform: 'rotate(-1deg)' }} />
        <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '1%', width: '205px', opacity: 3, transform: 'rotate(7deg)' }} />
        <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '1%', left: '92.5%', transform: 'translateX(-49%) rotate(-2deg)', width: '210px', opacity: 2.5, zIndex: 0 }} />
        <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '34%', right: '2%', width: '215px', opacity: 2, transform: 'translateX(-19%) rotate(-1deg)' }} />

      <div className="text-white pt-4 pb-3 px-4" style={{ background: 'linear-gradient(to right, #015794, #437FAA)', borderBottomLeftRadius: '80px', borderBottomRightRadius: '80px', width: '100%', zIndex: 1 }}>
        <div className="container d-flex justify-content-between align-items-start">
          <img src={logo} alt="Logo" style={{ width: '160px' }} />
          <a href="/" className="text-white fw-bold" style={{ fontSize: '1.1rem', marginTop: '5px' }}>Logout</a>
        </div>
        <div className="text-center mt-3">
          <h1 className="fw-bold">Welcome to Quizze</h1>
          <p className="lead">Join quizzes and view your performance with ease</p>
        </div>
      </div>
      

      <div className="container flex-grow-1 d-flex justify-content-center align-items-center flex-wrap gap-4 mt-5">
        <div className="bg-white shadow p-4 text-center rounded" style={{ width: '340px', minHeight: '200px' }}>
          <h3 className="fw-bold">Join Quiz</h3>
          <p>Have a great time in learning with fun!</p>
          <button className="btn btn-primary px-4" onClick={() => navigate('/join-quiz')}>Join</button>
          
        </div>

        <div className="bg-white shadow p-4 text-center rounded" style={{ width: '340px', minHeight: '200px' }}>
          <h3 className="fw-bold">View Results</h3>
          <p>You have done a great job, don't worry!</p>
          <button className="btn btn-success px-4" onClick={() => navigate('/my-attempts')}>View</button>
        </div>
      </div>

      <footer className="text-center mt-5 mb-3">
        <p className="text-muted">&copy; 2025 QUIZZE. All rights reserved.</p>
      </footer>
    </div>
  );
}

