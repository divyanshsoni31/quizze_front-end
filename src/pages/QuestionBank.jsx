// // File: src/pages/QuestionBank.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function QuestionBank() {
//   const navigate = useNavigate();
//   const [allQuestions, setAllQuestions] = useState([]);
//   const [selectedQuestions, setSelectedQuestions] = useState([]);
//   const [usedIds, setUsedIds] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState('');

//   useEffect(() => {
//     // Fetch default dummy and user-added questions
//     const bank = JSON.parse(localStorage.getItem('questionBank')) || [];
//     const used = JSON.parse(localStorage.getItem('usedQuestionIds')) || [];
//     const selected = JSON.parse(localStorage.getItem('selectedQuestionBankQuestions')) || [];

//     setAllQuestions(bank);
//     setUsedIds(used);
//     setSelectedQuestions(selected);
//   }, []);

//   const handleSelect = (question) => {
//     const exists = selectedQuestions.find(q => q.id === question.id);
//     const updated = exists
//       ? selectedQuestions.filter(q => q.id !== question.id)
//       : [...selectedQuestions, question];

//     setSelectedQuestions(updated);
//   };

//   const handleUseSelected = () => {
//     localStorage.setItem('selectedQuestionBankQuestions', JSON.stringify(selectedQuestions));

//     const updatedUsedIds = [...new Set([...usedIds, ...selectedQuestions.map(q => q.id)])];
//     localStorage.setItem('usedQuestionIds', JSON.stringify(updatedUsedIds));

//     navigate('/create-quiz');
//   };

//   const subjects = [...new Set(allQuestions.map(q => q.subject || 'General'))];
//   const filtered = selectedSubject
//     ? allQuestions.filter(q => q.subject === selectedSubject)
//     : allQuestions;

//   return (
//     <div
//       className="position-relative d-flex flex-column"
//       style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}
//     >
//       <div
//         className="text-white px-4 pt-3 pb-4"
//         style={{
//           background: 'linear-gradient(to right, #015794, #437FAA)',
//           borderBottomLeftRadius: '60px',
//           borderBottomRightRadius: '60px',
//         }}
//       >
//         <div className="container d-flex justify-content-between align-items-center">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h3 className="fw-bold mb-0">Question Bank</h3>
//           <button
//             className="btn btn-light text-primary fw-bold"
//             onClick={handleUseSelected}
//             disabled={selectedQuestions.length === 0}
//           >
//             Use Selected
//           </button>
//         </div>
//         <div className="container mt-3">
//           <label className="form-label text-white">Filter by Subject</label>
//           <select
//             className="form-select"
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//           >
//             <option value="">All Subjects</option>
//             {subjects.map((sub, idx) => (
//               <option key={idx} value={sub}>{sub}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="container my-4">
//         {filtered.map((q) => {
//           const isUsed = usedIds.includes(q.id);
//           const isSelected = selectedQuestions.find(sel => sel.id === q.id);

//           return (
//             <div
//               key={q.id}
//               className={`card mb-3 shadow-sm ${isUsed ? 'border border-warning bg-warning-subtle' : ''}`}
//             >
//               <div className="card-body">
//                 <h5 className="card-title">
//                   {q.question}
//                   {isUsed && <span className="badge bg-warning text-dark ms-2">Used</span>}
//                 </h5>

//                 {/* MCQ */}
//                 {q.type === 'mcq' && q.options?.map((opt, i) => (
//                   <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
//                 ))}

//                 {/* True/False */}
//                 {q.type === 'truefalse' && (
//                   <div>
//                     <strong>A.</strong> True <br />
//                     <strong>B.</strong> False
//                   </div>
//                 )}

//                 {/* Fill in the blank */}
//                 {q.type === 'fill' && (
//                   <div><em>Student will fill in the blank</em></div>
//                 )}

//                 {/* Match the Following */}
//                 {q.type === 'match' && q.options?.length > 0 && (
//                   <div>
//                     <em>Match the following:</em>
//                     <ul className="mb-0">
//                       {q.options.map((pair, idx) => (
//                         <li key={idx}>{pair.left} — {pair.right}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <p className="mt-2">
//                   <strong>Correct:</strong>{' '}
//                   {q.type === 'match' ? '[See above]' : q.correctAnswer}
//                 </p>

//                 <button
//                   className={`btn btn-sm ${isSelected ? 'btn-danger' : 'btn-outline-success'} mt-2`}
//                   onClick={() => handleSelect(q)}
//                 >
//                   {isSelected ? 'Remove' : 'Select'}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }







































// File: src/pages/QuestionBank.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';


const dummySubjects = [
  {
    name: 'General Knowledge',
    description: 'Basic general knowledge questions including geography, science, and history.',
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
        correctAnswer: 'Paris'
      },
      {
        id: 2,
        type: 'truefalse',
        question: 'The earth is flat.',
        options: ['True', 'False'],
        correctAnswer: 'False'
      },
      {
        id: 3,
        type: 'fill',
        question: '____ is the largest planet in our solar system.',
        correctAnswer: 'Jupiter'
      }
    ]
  },
  {
    name: 'Mathematics',
    description: 'Questions based on basic arithmetic and algebra.',
    questions: [
      {
        id: 4,
        type: 'mcq',
        question: 'What is 5 + 7?',
        options: ['10', '11', '12', '13'],
        correctAnswer: '12'
      },
      {
        id: 5,
        type: 'fill',
        question: 'The square root of 144 is ____.',
        correctAnswer: '12'
      }
    ]
  }
];

export default function QuestionBank() {
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(dummySubjects[0]);
  const usedQuestions = JSON.parse(localStorage.getItem('selectedQuestionBankQuestions')) || [];
  const usedIds = usedQuestions.map(q => q.id);


  const handleSelect = (question) => {
    const exists = selectedQuestions.find(q => q.id === question.id);
    setSelectedQuestions(
      exists
        ? selectedQuestions.filter(q => q.id !== question.id)
        : [...selectedQuestions, question]
    );
  };

  const handleUseSelected = () => {
    localStorage.setItem('selectedQuestionBankQuestions', JSON.stringify(selectedQuestions));
    navigate('/create-quiz');
  };

  return (
    <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}>
      
      {/* Header */}
      <div
        className="text-white px-4 pt-3 pb-4 w-100"
        style={{
          background: 'linear-gradient(to right, #015794, #437FAA)',
          borderBottomLeftRadius: '60px',
          borderBottomRightRadius: '60px',
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h3 className="fw-bold mb-0">Question Bank</h3>
          <button className="btn btn-light" onClick={handleUseSelected}>Use Selected</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid mt-4 px-5 flex-grow-1">
        <label className="form-label fw-bold">Select Subject</label>
        <select
          className="form-select"
          value={selectedSubject.name}
          onChange={(e) => {
            const subject = dummySubjects.find(sub => sub.name === e.target.value);
            setSelectedSubject(subject);
            setSelectedQuestions([]);
          }}
        >
          {dummySubjects.map((sub, idx) => (
            <option key={idx} value={sub.name}>{sub.name}</option>
          ))}
        </select>
        <p className="mt-2 text-muted fst-italic">{selectedSubject.description}</p>

        <div className="row mt-3">
          {selectedSubject.questions.map((q, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{q.question}</h5>
                  <div className="mb-2">
                    {q.type === 'mcq' &&
                      q.options.map((opt, i) => (
                        <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
                      ))
                    }
                    {q.type === 'truefalse' && (
                      <div><strong>A.</strong> True <br /><strong>B.</strong> False</div>
                    )}
                    {q.type === 'fill' && (
                      <div className="fst-italic">Student will fill in the blank</div>
                    )}
                  </div>
                  <p className="mt-auto"><strong>Correct:</strong> {q.correctAnswer}</p>
                  <button className="btn btn-sm btn-outline-success mt-2" onClick={() => handleSelect(q)}>
                    {selectedQuestions.find(sel => sel.id === q.id) ? 'Remove' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center mt-auto py-3">
        <p className="text-muted mb-0">&copy; 2025 QUIZZE. All rights reserved.</p>
      </footer>
    </div>
  );
}