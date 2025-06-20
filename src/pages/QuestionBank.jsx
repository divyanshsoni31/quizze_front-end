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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function QuestionBank() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  // Load subjects from localStorage
  useEffect(() => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('questionBank_'));
    const subjects = keys.map(k => k.replace('questionBank_', ''));
    setSubjectList(subjects);
    if (subjects.length > 0) setSelectedSubject(subjects[0]);
  }, []);

  // Load questions for selected subject
  useEffect(() => {
    if (selectedSubject) {
      const loaded = JSON.parse(localStorage.getItem(`questionBank_${selectedSubject}`)) || [];
      setQuestions(loaded);
      setSelectedQuestions([]);
      setEditingIndex(null);
      setEditData(null);
    }
  }, [selectedSubject]);

  const handleSelect = (q) => {
    const exists = selectedQuestions.find(sel => sel.id === q.id);
    if (exists) {
      setSelectedQuestions(prev => prev.filter(sel => sel.id !== q.id));
    } else {
      setSelectedQuestions(prev => [...prev, q]);
    }
  };

  const handleDelete = (id) => {
    const updated = questions.filter(q => q.id !== id);
    localStorage.setItem(`questionBank_${selectedSubject}`, JSON.stringify(updated));
    setQuestions(updated);
  };

  const handleSaveEdit = () => {
    const updated = [...questions];
    updated[editingIndex] = { ...editData, ownerEmail: userEmail };
    localStorage.setItem(`questionBank_${selectedSubject}`, JSON.stringify(updated));
    setQuestions(updated);
    setEditingIndex(null);
    setEditData(null);
  };

  const handleUseSelected = () => {
    localStorage.setItem('selectedQuestionBankQuestions', JSON.stringify(selectedQuestions));
    navigate('/create-quiz');
  };

  return (
    <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="text-white px-4 pt-3 pb-4 w-100" style={{
        background: 'linear-gradient(to right, #015794, #437FAA)',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px'
      }}>
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h3 className="fw-bold mb-0 text-center flex-grow-1 text-uppercase text-nowrap">Question Bank</h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-light border-0"
              style={{ boxShadow: 'none' }}
              onClick={handleUseSelected}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#fff'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#fff'}
            >Use Selected</button>
            <button
              className="btn btn-outline-light border-0"
              style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
              onClick={() => navigate('/create-quiz')}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'transparent'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >Back</button>
          </div>
        </div>
      </div>

      {/* Subject Select */}
      <div className="container mt-4">
        <label className="form-label fw-bold">Select Subject</label>
        <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          {subjectList.map((sub, i) => (
            <option key={i} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      {/* Question List */}
      <div className="container mt-4">
        <div className="row">
          {questions.map((q, i) => {
            const isOwner = q.ownerEmail === userEmail;
            const isSelected = selectedQuestions.find(sel => sel.id === q.id);

            return (
              <div className="col-md-6 col-lg-4 mb-4" key={q.id || i}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    {editingIndex === i ? (
                      <>
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editData.question}
                          onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                        />
                        {editData.type === 'mcq' && editData.options.map((opt, j) => (
                          <input
                            key={j}
                            className="form-control mb-2"
                            placeholder={`Option ${String.fromCharCode(65 + j)}`}
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...editData.options];
                              newOptions[j] = e.target.value;
                              setEditData({ ...editData, options: newOptions });
                            }}
                          />
                        ))}
                        {editData.type === 'fill' && (
                          <input
                            className="form-control mb-2"
                            value={editData.correctAnswer}
                            onChange={(e) => setEditData({ ...editData, correctAnswer: e.target.value })}
                          />
                        )}
                        {editData.type === 'match' && editData.options?.map((pair, j) => (
                          <div className="d-flex mb-2 gap-2" key={j}>
                            <input
                              className="form-control"
                              placeholder={`Left ${j + 1}`}
                              value={pair.left}
                              onChange={(e) => {
                                const newOptions = [...editData.options];
                                newOptions[j].left = e.target.value;
                                setEditData({ ...editData, options: newOptions });
                              }}
                            />
                            <input
                              className="form-control"
                              placeholder={`Right ${j + 1}`}
                              value={pair.right}
                              onChange={(e) => {
                                const newOptions = [...editData.options];
                                newOptions[j].right = e.target.value;
                                setEditData({ ...editData, options: newOptions });
                              }}
                            />
                          </div>
                        ))}
                        <button className="btn btn-sm btn-success me-2" onClick={handleSaveEdit}>✅ Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditingIndex(null); setEditData(null); }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title">{q.question}</h5>
                        {q.type === 'mcq' && q.options.map((opt, j) => (
                          <div key={j}><strong>{String.fromCharCode(65 + j)}.</strong> {opt}</div>
                        ))}
                        {q.type === 'fill' && <p className="fst-italic">Fill in the blank</p>}
                        {q.type === 'truefalse' && <p>A. True <br /> B. False</p>}
                        {q.type === 'match' && (
                          <div className="mb-2">
                            <p className="fw-bold mb-1">Match Pairs:</p>
                            {q.options?.map((pair, idx) => (
                              <div key={idx} className="d-flex justify-content-between px-2">
                                <span>🔹 {pair.left}</span>
                                <span>➡ {pair.right}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {q.type !== 'match' && (
                          <p><strong>Correct:</strong> {q.correctAnswer}</p>
                        )}

                        <div className="mt-auto d-flex justify-content-between">
                          <button
                            className={`btn btn-sm ${isSelected ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                            onClick={() => handleSelect(q)}
                          >
                            {isSelected ? 'Remove' : 'Select'}
                          </button>
                          {isOwner && (
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-outline-warning" onClick={() => {
                                setEditingIndex(i);
                                setEditData(q);
                              }}>Edit</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(q.id)}>Delete</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-auto py-3">
        <p className="text-muted mb-0">&copy; 2025 QUIZZE. All rights reserved.</p>
      </footer>
    </div>
  );
}

