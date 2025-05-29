// File: src/pages/JoinQuiz.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import bulb1 from '../assets/icon-bulb1.png';
import pencil1 from '../assets/icon-pencil1.png';
import trophy1 from '../assets/icon-trophy1.png';
import question1 from '../assets/icon-question1.png';

export default function JoinQuiz() {
  const navigate = useNavigate();

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
        <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '39%', left: '8%', width: '185px', opacity: 2, transform: 'rotate(-1deg)' }} />
        <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '5%', width: '205px', opacity: 3, transform: 'rotate(7deg)' }} />
        <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '1%', left: '92.5%', transform: 'translateX(-49%) rotate(-2deg)', width: '210px', opacity: 2.5, zIndex: 0 }} />
        <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '34%', right: '2%', width: '215px', opacity: 2, transform: 'translateX(-19%) rotate(-1deg)' }} />

      <div className="text-white pt-4 pb-3 px-4" style={{ background: 'linear-gradient(to right, #015794, #437FAA)', borderBottomLeftRadius: '80px', borderBottomRightRadius: '80px', width: '100%' , zIndex:1}}>
        <div className="container d-flex justify-content-between align-items-start">
          <img src={logo} alt="Logo" style={{ width: '160px' }} />
          <a href="/student" className="text-white fw-bold" style={{ fontSize: '1.1rem', marginTop: '5px' }}>Home</a>
        </div>
        <div className="text-center mt-3">
          <h1 className="fw-bold">Join A Quiz</h1>
          <p className="lead">Got the code? Game on!</p>
        </div>
      </div>

      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 mt-4">
        <div className="bg-white shadow rounded p-4" style={{ width: '100%', maxWidth: '600px' }}>
          <h4 className="mb-3">Quiz Code</h4>
          <input
            type="text"
            className="form-control mb-3 shadow-sm"
            placeholder="Unlock the Quiz, Let the Brain Games Begin!"
          />
          <div className="text-center">
            <button className="btn btn-primary px-5" onClick={() => alert('Join logic will go here')}>Join</button>
          </div>
        </div>
      </div>

      <footer className="text-center mt-5 mb-3">
        <p className="text-muted">&copy; 2025 QUIZZE. All rights reserved.</p>
      </footer>
    </div>
  );
}