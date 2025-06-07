// // src/components/BackToDashboardButton.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function BackToDashboardButton({ className = '' }) {
//   const navigate = useNavigate();
//   const role = localStorage.getItem('userRole');

//   const handleClick = () => {
//     navigate(role === 'creator' ? '/creator' : '/student');
//   };

//   return (
//     <button className={`btn btn-light ${className}`} onClick={handleClick}>
//        Dashboard
//     </button>
//   );
// }
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackToDashboardButton({ text = "Dashboard", className = "" }) {
  const navigate = useNavigate();

  const goToDashboard = () => {
    const role = localStorage.getItem('userRole');
    navigate(role === 'creator' ? '/creator' : '/student');
  };

  return (
    <button
      className={`btn fw-bold ${className}`}
      onClick={goToDashboard}
      style={{
        backgroundColor: '#ffffff',
        color: '#000',
        border: '1px solid #ccc',
        boxShadow: 'none',
        cursor: 'pointer',
        transition: 'none'
      }}
    >
      {text}
    </button>
  );
}
