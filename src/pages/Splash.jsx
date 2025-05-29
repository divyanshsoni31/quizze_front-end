// File: src/pages/Splash.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import pencil from '../assets/icon-pencil.png';
import trophy from '../assets/icon-trophy.png';
import bulb from '../assets/icon-bulb.png';
import question from '../assets/icon-question.png';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 5500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="position-relative d-flex justify-content-center align-items-center"
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #015794, #437FAA)',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <img src={logo} alt="Quizze Logo" style={{ width: '390px', zIndex: 2 }} />
      {/* <p className="text-light mt-4 fs-5 text-center" style={{ zIndex: 2 }}>
        <em>The smarter way to challenge, learn & grow!</em>
      </p> */}

      {/* Positioned decorative icons */}
      <img src={pencil} alt="Pencil" className="position-absolute" style={{ top: '10%', left: '12%', width: '140px' }} />
      <img src={trophy} alt="Trophy" className="position-absolute" style={{ bottom: '10%', left: '10%', width: '160px' }} />
      <img src={question} alt="Question" className="position-absolute" style={{ top: '5%', right: '10%', width: '250px' }} />
      <img src={bulb} alt="Bulb" className="position-absolute" style={{ bottom: '5%', right: '10%', width: '250px' }} />
    </div>
  );
}

// File: src/pages/Splash.jsx
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';
// import pencil from '../assets/icon-pencil.png';
// import trophy from '../assets/icon-trophy.png';
// import bulb from '../assets/icon-bulb.png';
// import question from '../assets/icon-question.png';

// export default function Splash() {
//   const navigate = useNavigate();

// //   useEffect(() => {
// //     const timer = setTimeout(() => navigate('/login'), 7500);
// //     return () => clearTimeout(timer);
// //   }, [navigate]);

//   return (
//     <div
//       className="position-relative d-flex justify-content-center align-items-center"
//       style={{
//         height: '100vh',
//         width: '100vw',
//         background: 'linear-gradient(135deg, #015794, #437FAA)',
//         overflow: 'hidden',
//         flexDirection: 'column',
//       }}
//     >
//       <img src={logo} alt="Quizze Logo" style={{ width: '390px', zIndex: 2 }} />

//       {/* Rotating Icons */}
//       <div className="orbit-container orbit1">
//         <img src={pencil} alt="Pencil" className="orbit-icon1" style={{ top: '10%', left: '12%', width: '140px' }} />
//       </div>
//       <div className="orbit-container orbit2">
//         <img src={trophy} alt="Trophy" className="orbit-icon2"   />
//       </div>
//       <div className="orbit-container orbit3">
//         <img src={question} alt="Question" className="orbit-icon3" />
//       </div>
//       <div className="orbit-container orbit4">
//         <img src={bulb} alt="Bulb" className="orbit-icon41" />
//       </div>

//       {/* Inline styles for animation */}
//       <style>{`
//         .orbit-container {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform-origin: center center;
//           animation: orbit 15s linear infinite;
//         }

//         .orbit-icon {
//           width: 100px;
//         }

//         .orbit1 { transform: rotate(0deg) translateX(200px) rotate(0deg); }
//         .orbit2 { transform: rotate(90deg) translateX(200px) rotate(-90deg); }
//         .orbit3 { transform: rotate(180deg) translateX(200px) rotate(-180deg); }
//         .orbit4 { transform: rotate(270deg) translateX(200px) rotate(-270deg); }

//         @keyframes orbit {
//           0%   { transform: rotate(0deg) translateX(200px) rotate(0deg); }
//           100% { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }
