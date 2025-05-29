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

export default function Register() {
  const navigate = useNavigate();
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
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const userRecord = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        verified: false,
      };
      localStorage.setItem(formData.email, JSON.stringify(userRecord));
      navigate('/verify');
      // console.log("Navigation to OTP triggered");
      // window.location.href = "/verify";

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
                required
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
              required
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
              required
            >
              <option value="">Role</option>
              <option value="student">Student</option>
              <option value="faculty">Creator</option>
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
              required
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
              required
            />
            {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100 mt-2">Register</button>

          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}















// // File: src/pages/Register.jsx
// import React, { useState } from 'react';
// import logo1 from '../assets/logo1.png';
// import userIcon from '../assets/icon-user.png';
// import emailIcon from '../assets/icon-email.png';
// import lockIcon from '../assets/icon-lock.png';
// import lockOpenIcon from '../assets/icon-lockopen.png';
// import roleIcon from '../assets/icon-role.png';
// import bulb from '../assets/icon-bulb.png';
// import pencil from '../assets/icon-pencil.png';
// import trophy from '../assets/icon-trophy.png';
// import question from '../assets/icon-question.png';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validate = () => {
//     const namePattern = /^[A-Za-z]{2,}$/;
//     const emailPattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const newErrors = {};

//     if (!namePattern.test(formData.firstName)) newErrors.firstName = "First Name should contain only letters and be at least 2 characters long";
//     if (!namePattern.test(formData.lastName)) newErrors.lastName = "Last Name should contain only letters and be at least 2 characters long";
//     if (!emailPattern.test(formData.email)) newErrors.email = "Please enter a valid email address";
//     if (!formData.role) newErrors.role = "Select a role";
//     if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
//     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//     } else {
//       setErrors({});
//       alert('Registration successful!');
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

//       <div className="bg-light shadow px-4 py-3 position-relative" style={{ width: '100%', maxWidth: '750px', borderRadius: '63px', zIndex: 1 }}>
//         <div className="text-center">
//           <img src={logo1} alt="Logo" style={{ width: '220px' }} />
//           <h5 className="mt-2 mb-3">Create your QUIZZE account!</h5>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={userIcon} alt="First Name" width="20" />
//             </span>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
//               placeholder="First Name"
//               required
//             />
//             {errors.firstName && <div className="invalid-feedback d-block">{errors.firstName}</div>}
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={userIcon} alt="Last Name" width="20" />
//             </span>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
//               placeholder="Last Name"
//               required
//             />
//             {errors.lastName && <div className="invalid-feedback d-block">{errors.lastName}</div>}
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={emailIcon} alt="Email" width="20" />
//             </span>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//               placeholder="Email"
//               required
//             />
//             {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={roleIcon} alt="Role" width="20" />
//             </span>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className={`form-select ${errors.role ? 'is-invalid' : ''}`}
//               required
//             >
//               <option value="">Role</option>
//               <option value="student">Student</option>
//               <option value="faculty">Creator</option>
//             </select>
//             {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={lockIcon} alt="Password" width="20" />
//             </span>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className={`form-control ${errors.password ? 'is-invalid' : ''}`}
//               placeholder="Password"
//               required
//             />
//             {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={lockOpenIcon} alt="Confirm Password" width="20" />
//             </span>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
//               placeholder="Confirm Password"
//               required
//             />
//             {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
//           </div>

//           <button type="submit" className="btn btn-success w-100 mt-2">Register</button>

//           <p className="text-center mt-3">
//             Already have an account? <a href="/login">Login</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }









































// // File: src/pages/Register.jsx
// import React from 'react';
// import logo1 from '../assets/logo1.png';
// import userIcon from '../assets/icon-user.png';
// import emailIcon from '../assets/icon-email.png';
// import lockIcon from '../assets/icon-lock.png';
// import lockOpenIcon from '../assets/icon-lockopen.png';
// import roleIcon from '../assets/icon-role.png';
// import bulb from '../assets/icon-bulb.png';
// import pencil from '../assets/icon-pencil.png';
// import trophy from '../assets/icon-trophy.png';
// import question from '../assets/icon-question.png';

// export default function Register() {
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
//       <img src={pencil} alt="Pencil" className="position-absolute" style={{ top: '5%', left: '5%', width: '175px', opacity: 2, transform: 'rotate(-1deg)' }} />
//       <img src={trophy} alt="Trophy" className="position-absolute" style={{ bottom: '5%', left: '8%', width: '230px', opacity: 2, transform: 'rotate(-32deg)' }} />
//       <img src={question} alt="Question" className="position-absolute" style={{ bottom: '59%', left: '89%', transform: 'translateX(-50%) rotate(73deg)', width: '320px', opacity: 2, zIndex: 0 }} />
//       <img src={bulb} alt="Bulb" className="position-absolute" style={{ bottom: '4%', right: '2%', width: '320px', opacity: 2, transform: 'rotate(-17deg)' }} />

//       <div className="bg-light shadow px-4 py-3 position-relative" style={{ width: '100%', maxWidth: '750px', borderRadius: '63px', zIndex: 1 }}>
//         <div className="text-center">
//           <img src={logo1} alt="Logo" style={{ width: '220px' }} />
//           <h5 className="mt-2 mb-3">Create your QUIZZE account!</h5>
//         </div>

//         <form>
//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={userIcon} alt="First Name" width="20" />
//             </span>
//             <input type="text" className="form-control" placeholder="First Name" required />
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={userIcon} alt="Last Name" width="20" />
//             </span>
//             <input type="text" className="form-control" placeholder="Last Name" required />
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={emailIcon} alt="Email" width="20" />
//             </span>
//             <input type="email" className="form-control" placeholder="Email" required />
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={roleIcon} alt="Role" width="20" />
//             </span>
//             <select className="form-select" required>
//               <option value="">Role</option>
//               <option value="student">Student</option>
//               <option value="faculty">Faculty</option>
//             </select>
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={lockIcon} alt="Password" width="20" />
//             </span>
//             <input type="password" className="form-control" placeholder="Password" required />
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={lockOpenIcon} alt="Confirm Password" width="20" />
//             </span>
//             <input type="password" className="form-control" placeholder="Confirm Password" required />
//           </div>

//           <button type="submit" className="btn btn-success w-100 mt-2">Register</button>

//           <p className="text-center mt-3">
//             Already have an account? <a href="/login">Login</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }







































// // File: src/pages/Register.jsx
// import React from 'react';
// import logo1 from '../assets/logo1.png';
// import userIcon from '../assets/icon-user.png';
// import emailIcon from '../assets/icon-email.png';
// import lockIcon from '../assets/icon-lock.png';
// import lockOpenIcon from '../assets/icon-lockopen.png';
// import roleIcon from '../assets/icon-role.png';
// import bulb from '../assets/icon-bulb.png';
// import pencil from '../assets/icon-pencil.png';
// import trophy from '../assets/icon-trophy.png';
// import question from '../assets/icon-question.png';

// export default function Register() {
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
//         <img src={pencil} alt="Pencil" className="position-absolute" style={{ top: '5%', left: '5%', width: '140px', opacity: 2 }} />
//         <img src={trophy} alt="Trophy" className="position-absolute" style={{ bottom: '5%', left: '8%', width: '160px', opacity: 2 , transform: 'rotate(-25deg)'}} />
//         <img src={question} alt="Question" className="position-absolute" style={{ bottom: '64%', right: '22%', transform: 'translateX(50%)', width: '250px', opacity: 2 }} />
//         <img src={bulb} alt="Bulb" className="position-absolute" style={{ bottom: '5%', right: '8%', width: '250px', opacity: 2 }} />

//       <div className="bg-light shadow px-4 py-3" style={{ width: '100%', maxWidth: '750px', borderRadius: '63px' }}>
//         <div className="text-center">
//           <img src={logo1} alt="Logo" style={{ width: '220px' }} />
//           <h5 className="mt-2 mb-3">Create your QUIZZE account!</h5>
//         </div>

//         <form>
//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={userIcon} alt="First Name" width="20" />
//             </span>
//             <input type="text" className="form-control" placeholder="First Name" required />
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={userIcon} alt="Last Name" width="20" />
//             </span>
//             <input type="text" className="form-control" placeholder="Last Name" required />
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={emailIcon} alt="Email" width="20" />
//             </span>
//             <input type="email" className="form-control" placeholder="Email" required />
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={roleIcon} alt="Role" width="20" />
//             </span>
//             <select className="form-select" required>
//               <option value="">Role</option>
//               <option value="student">Student</option>
//               <option value="faculty">Faculty</option>
//             </select>
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={lockIcon} alt="Password" width="20" />
//             </span>
//             <input type="password" className="form-control" placeholder="Password" required />
//           </div>

//           <div className="mb-2 input-group">
//             <span className="input-group-text">
//               <img src={lockOpenIcon} alt="Confirm Password" width="20" />
//             </span>
//             <input type="password" className="form-control" placeholder="Confirm Password" required />
//           </div>

//           <button type="submit" className="btn btn-success w-100 mt-2">Register</button>

//           <p className="text-center mt-3">
//             Already have an account? <a href="/login">Login</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }


