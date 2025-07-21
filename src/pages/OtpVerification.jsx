import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bulb from '../assets/icon-bulb.png';
import pencil from '../assets/icon-pencil.png';
import trophy from '../assets/icon-trophy.png';
import question from '../assets/icon-question.png';
import logo1 from '../assets/logo1.png';

export default function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
  e.preventDefault();
  const regData = JSON.parse(localStorage.getItem('pendingRegister'));

  if (!regData || !otp) {
    setError("Missing registration data or OTP.");
    return;
  }

  try {
    await axios.post('http://localhost:3000/api/auth/register', {
      ...regData,
      otp
    });

    localStorage.removeItem('pendingRegister');

    if (regData.role === 'student') navigate('/student');
    else navigate('/creator');

  } catch (err) {
    const msg = err?.response?.data?.error || "OTP verification failed.";
    setError(`❌ ${msg}`);
  }
};


  const handleResendOtp = async () => {
  const regData = JSON.parse(localStorage.getItem('pendingRegister'));
  const email = regData?.email;

  if (!email) {
    setError("No email found. Please register again.");
    return;
  }

  try {
    await axios.post('http://localhost:3000/api/otp', { email });
    setSuccess("✅ OTP resent to your email.");
    setError('');
  } catch (err) {
    const msg = err?.response?.data?.error || "❌ Failed to resend OTP.";
    setError(msg);
    setSuccess('');
    console.error(err);
  }
};

  return (
    <div className="position-relative d-flex justify-content-center align-items-center"
      style={{ height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #1565C0, #1E88E5)', overflow: 'hidden', padding: '20px' }}>

      {/* Background Icons */}
      <img src={pencil} alt="Pencil" className="position-absolute" style={{ top: '5%', left: '5%', width: '175px', transform: 'rotate(-1deg)' }} />
      <img src={trophy} alt="Trophy" className="position-absolute" style={{ bottom: '5%', left: '8%', width: '230px', transform: 'rotate(-32deg)' }} />
      <img src={question} alt="Question" className="position-absolute" style={{ bottom: '59%', left: '89%', transform: 'translateX(-50%) rotate(73deg)', width: '320px' }} />
      <img src={bulb} alt="Bulb" className="position-absolute" style={{ bottom: '4%', right: '2%', width: '320px', transform: 'rotate(-17deg)' }} />

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
          {success && <div className="text-success mb-2 text-center">{success}</div>}
          <button type="submit" className="btn btn-success w-100">Verify</button>
        </form>

        <p className="text-center mt-2">
          Didn't receive OTP? 
          <button type="button" onClick={handleResendOtp} className="btn btn-outline-primary w-100 mt-3"disabled={resending}>
            {resending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Resending...
              </>
            ) : (
              "Resend OTP"
            )}
          </button>
        </p>
      </div>
    </div>
  );
}
