// File: src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../assets/logo1.png';
import userIcon from '../assets/icon-user.png';
import emailIcon from '../assets/icon-email.png';
import lockIcon from '../assets/icon-lock.png';
import lockOpenIcon from '../assets/icon-lockopen.png';
import roleIcon from '../assets/icon-role.png';
import bulb from '../assets/icon-bulb.png';
import pencil from '../assets/icon-pencil.png';
import trophy from '../assets/icon-trophy.png';
import question from '../assets/icon-question.png';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const namePattern = /^[A-Za-z]+$/;
    const emailPattern = /^(?=.*[A-Za-z])[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!formData.firstName.trim() || !namePattern.test(formData.firstName)) newErrors.firstName = "Valid First Name is required";
    if (!formData.lastName.trim() || !namePattern.test(formData.lastName)) newErrors.lastName = "Valid Last Name is required";
    if (!emailPattern.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.role) newErrors.role = "Select a role";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsSubmitting(true); // 🔄 START LOADING

  const userData = {
    firstname: formData.firstName,
    lastname: formData.lastName,
    email: formData.email.toLowerCase(),
    role: formData.role,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };

  try {
    await axios.post('http://localhost:3000/api/otp', { email: userData.email });
    localStorage.setItem('pendingRegister', JSON.stringify(userData));
    navigate('/verify');
  } catch (error) {
    const msg = error?.response?.data?.error || "Something went wrong.";
    setErrors({ email: `❌ ${msg}` });
  } finally {
    setIsSubmitting(false); // 🔁 END LOADING
  }
};




  return (
    <div className="position-relative d-flex justify-content-center align-items-center"
      style={{ height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #015794, #437FAA)', overflow: 'hidden', padding: '20px' }}>
      
      {/* Background Icons */}
      <img src={pencil} alt="Pencil" className="position-absolute" style={{ top: '5%', left: '5%', width: '175px', transform: 'rotate(-1deg)' }} />
      <img src={trophy} alt="Trophy" className="position-absolute" style={{ bottom: '5%', left: '8%', width: '230px', transform: 'rotate(-32deg)' }} />
      <img src={question} alt="Question" className="position-absolute" style={{ bottom: '59%', left: '89%', transform: 'translateX(-50%) rotate(73deg)', width: '320px' }} />
      <img src={bulb} alt="Bulb" className="position-absolute" style={{ bottom: '4%', right: '2%', width: '320px', transform: 'rotate(-17deg)' }} />

      <div className="bg-light shadow px-4 py-3 position-relative" style={{ width: '100%', maxWidth: '750px', borderRadius: '63px', zIndex: 1 }}>
        <div className="text-center">
          <img src={logo1} alt="Logo" style={{ width: '220px' }} />
          <h5 className="mt-2 mb-3">Create your QUIZZE account!</h5>
        </div>

        <form onSubmit={handleSubmit}>
          {['firstName', 'lastName'].map((field, index) => (
            <div key={index} className="mb-2 input-group">
              <span className="input-group-text">
                <img src={userIcon} alt={field} width="20" />
              </span>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                placeholder={field === 'firstName' ? 'First Name' : 'Last Name'}
              />
              {errors[field] && <div className="invalid-feedback d-block">{errors[field]}</div>}
            </div>
          ))}

          <div className="mb-2 input-group">
            <span className="input-group-text">
              <img src={emailIcon} alt="Email" width="20" />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
            />
            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
          </div>

          <div className="mb-2 input-group">
            <span className="input-group-text">
              <img src={roleIcon} alt="Role" width="20" />
            </span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`form-select ${errors.role ? 'is-invalid' : ''}`}
            >
              <option value="">Role</option>
              <option value="student">Student</option>
              <option value="creator">Creator</option>
            </select>
            {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
          </div>

          <div className="mb-2 input-group">
            <span className="input-group-text">
              <img src={lockIcon} alt="Password" width="20" />
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Password"
            />
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>

          <div className="mb-2 input-group">
            <span className="input-group-text">
              <img src={lockOpenIcon} alt="Confirm Password" width="20" />
            </span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
          </div>

            <button type="submit" className="btn btn-success w-100 mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending OTP...
                </>
              ) : (
                "Register"
              )}
            </button>
          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

