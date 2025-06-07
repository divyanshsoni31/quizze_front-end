// File: src/pages/OtpVerification.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bulb from '../assets/icon-bulb.png';
import pencil from '../assets/icon-pencil.png';
import trophy from '../assets/icon-trophy.png';
import question from '../assets/icon-question.png';
import logo1 from '../assets/logo1.png';

export default function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();

    if (otp === '123456') {
      const email = Object.keys(localStorage).find((key) => {
  try {
    const user = JSON.parse(localStorage.getItem(key));
    return user && user.verified === false && user.password;
  } catch {
    return false;
  }
});


      if (email) {
        const user = JSON.parse(localStorage.getItem(email));
        user.verified = true;
        localStorage.setItem(email, JSON.stringify(user));

        if (user.role === 'student') navigate('/student');
        else navigate('/creator');
      } else {
        setError('No unverified user found.');
      }
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #1565C0, #1E88E5)', overflow: 'hidden', padding: '20px' }}>
      {/* Background Icons */}
        <img src={pencil} alt="Pencil" className="position-absolute" style={{ top: '5%', left: '5%', width: '175px', opacity: 2, transform: 'rotate(-1deg)' }} />
        <img src={trophy} alt="Trophy" className="position-absolute" style={{ bottom: '5%', left: '8%', width: '230px', opacity: 2, transform: 'rotate(-32deg)' }} />
        <img src={question} alt="Question" className="position-absolute" style={{ bottom: '59%', left: '89%', transform: 'translateX(-50%) rotate(73deg)', width: '320px', opacity: 2, zIndex: 0 }} />
        <img src={bulb} alt="Bulb" className="position-absolute" style={{ bottom: '4%', right: '2%', width: '320px', opacity: 2, transform: 'rotate(-17deg)' }} />

      <div className="bg-light shadow px-4 py-3 position-relative" style={{ width: '100%', maxWidth: '500px', borderRadius: '40px', zIndex: 1 }}>
        <div className="text-center">
          <img src={logo1} alt="Logo1" style={{ width: '200px' }} />
          <h5 className="mt-2 mb-3">Email Verification</h5>
          <p>Enter the 6-digit OTP sent to your email</p>
        </div>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            className="form-control mb-2"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          {error && <div className="text-danger mb-2 text-center">{error}</div>}
          <button type="submit" className="btn btn-success w-100">Verify</button>
        </form>
      </div>
    </div>
  );
}































// // File: src/pages/OtpVerification.jsx
// import React, { useState } from 'react';
// import logo1 from '../assets/logo1.png';
// import bulb from '../assets/icon-bulb.png';
// import pencil from '../assets/icon-pencil.png';
// import trophy from '../assets/icon-trophy.png';
// import question from '../assets/icon-question.png';

// export default function OtpVerification() {
//   const [otp, setOtp] = useState('');

//   const handleChange = (e) => {
//     setOtp(e.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (otp.length === 6) {
//       alert('OTP Verified Successfully!');
//     } else {
//       alert('Please enter a valid 6-digit OTP.');
//     }
//   };

//   return (
//     <div
//       className="position-relative d-flex justify-content-center align-items-center"
//       style={{
//         height: '100vh',
//         width: '100vw',
//         background: 'linear-gradient(135deg, #015794, #437FAA)',
//         overflow: 'hidden',
//         padding: '20px',
//       }}
//     >
//       {/* Background Icons */}
//         <img src={pencil} alt="Pencil" className="position-absolute" style={{ top: '5%', left: '5%', width: '175px', opacity: 2, transform: 'rotate(-1deg)' }} />
//         <img src={trophy} alt="Trophy" className="position-absolute" style={{ bottom: '5%', left: '8%', width: '230px', opacity: 2, transform: 'rotate(-32deg)' }} />
//         <img src={question} alt="Question" className="position-absolute" style={{ bottom: '59%', left: '89%', transform: 'translateX(-50%) rotate(73deg)', width: '320px', opacity: 2, zIndex: 0 }} />
//         <img src={bulb} alt="Bulb" className="position-absolute" style={{ bottom: '4%', right: '2%', width: '320px', opacity: 2, transform: 'rotate(-17deg)' }} />

//       <div className="bg-light shadow px-4 py-3 position-relative" style={{ width: '100%', maxWidth: '500px', borderRadius: '40px', zIndex: 1 }}>
//         <div className="text-center">
//           <img src={logo1} alt="Logo" style={{ width: '200px' }} />
//           <h5 className="mt-2 mb-3">Verify Your Email</h5>
//           <p>We’ve sent a 6-digit OTP to your email address.</p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3 input-group">
//             <input
//               type="text"
//               maxLength={6}
//               className="form-control text-center"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100">Verify</button>

//           <p className="text-center mt-3">
//             Didn't receive the OTP? <a href="#">Resend</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
