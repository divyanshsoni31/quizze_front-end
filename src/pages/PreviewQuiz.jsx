// File: src/pages/PreviewQuiz.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function PreviewQuiz() {
  const navigate = useNavigate();
  const [quizMeta, setQuizMeta] = useState({});
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
    const manualQs = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
    const bankQs = JSON.parse(localStorage.getItem('selectedQuestionBankQuestions')) || [];
    const combined = [...manualQs, ...bankQs.filter(q => !manualQs.find(mq => mq.id === q.id))];
    setQuizMeta(meta);
    setQuestions(combined);
  }, []);

  const handleDelete = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
    localStorage.setItem('createdQuizQuestions', JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData({ ...questions[index] });
    document.getElementById('editModal').style.display = 'block';
  };

  const handleSaveEdit = () => {
    const updated = [...questions];
    updated[editingIndex] = editData;
    setQuestions(updated);
    localStorage.setItem('createdQuizQuestions', JSON.stringify(updated));
    setEditingIndex(null);
    setEditData({});
    document.getElementById('editModal').style.display = 'none';
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (i, value) => {
    const newOptions = [...editData.options];
    newOptions[i] = value;
    setEditData(prev => ({ ...prev, options: newOptions }));
  };

  const handleFinalize = () => {
    localStorage.setItem('finalQuizMeta', JSON.stringify(quizMeta));
    localStorage.setItem('finalQuizQuestions', JSON.stringify(questions));
    navigate('/attempt-quiz');
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe' }}>
      {/* Header */}
      <div className="text-white py-3 px-4" style={{
        background: 'linear-gradient(to right, #015794, #437FAA)',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px'
      }}>
        <div className="d-flex justify-content-between align-items-center container-fluid">
          <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
          <h4 className="mb-0 fw-bold">Preview Quiz</h4>
          <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
        </div>
      </div>

      {/* Meta */}
      <div className="container mt-4">
        <h2 className="fw-bold">{quizMeta.title || 'Untitled Quiz'}</h2>
        <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
        <div className="d-flex gap-4 text-muted">
          <span>📝 Questions: {questions.length}</span>
          <span>⏱ Time: {quizMeta.timeLimit || 0} mins</span>
          <span>📊 Difficulty: {quizMeta.difficulty || 'Not set'}</span>
        </div>
      </div>

      {/* Question List */}
      <div className="container my-4 flex-grow-1">
        {questions.map((q, index) => (
          <div key={index} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="card-title mb-2">
                  <span className="badge bg-primary me-2">Q{index + 1}</span>
                  <strong>{q.question}</strong>
                </h5>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(index)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Delete</button>
                </div>
              </div>

              {q.type === 'mcq' && q.options?.map((opt, i) => (
                <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
              ))}

              {q.type === 'truefalse' && (
                <>
                  <div><strong>A.</strong> True</div>
                  <div><strong>B.</strong> False</div>
                </>
              )}

              {q.type === 'fill' && (
                <p className="text-muted fst-italic">Student will fill in the blank.</p>
              )}

              {q.type === 'match' && Array.isArray(q.options) && (
                <>
                  <p className="text-muted mb-1">Match the following:</p>
                  {q.options.map((pair, idx) => (
                    <div className="row mb-2" key={idx}>
                      <div className="col-md-6"><strong>{`A${idx + 1}`}</strong>: {pair.left}</div>
                      <div className="col-md-6"><strong>{`${(idx + 1) * 11}`}</strong>: {pair.right}</div>
                    </div>
                  ))}
                </>
              )}

              <p className="mt-2 text-muted">
                <strong>Correct:</strong> {q.correctAnswer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-4">
        <button className="btn btn-success px-4 py-2 fw-bold" onClick={handleFinalize}>
          Finalize Quiz
        </button>
      </div>

      <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
        © 2025 QUIZZE. All rights reserved.
      </footer>

      {/* EDIT MODAL */}
      {editingIndex !== null && (
        <div id="editModal" className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow" style={{ width: '500px' }}>
            <h5>Edit Question</h5>
            <input
              type="text"
              className="form-control mb-3"
              value={editData.question}
              onChange={e => handleInputChange('question', e.target.value)}
            />

            {/* Edit inputs based on type */}
            {editData.type === 'mcq' && (
              <>
                {["A", "B", "C", "D"].map((label, i) => (
                  <input
                    key={i}
                    type="text"
                    className="form-control mb-2"
                    placeholder={`Option ${label}`}
                    value={editData.options[i]}
                    onChange={e => handleOptionChange(i, e.target.value)}
                  />
                ))}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Correct Option (A/B/C/D)"
                  value={editData.correctAnswer}
                  onChange={e => handleInputChange('correctAnswer', e.target.value)}
                />
              </>
            )}

            {editData.type === 'truefalse' && (
              <select
                className="form-select mb-2"
                value={editData.correctAnswer}
                onChange={e => handleInputChange('correctAnswer', e.target.value)}
              >
                <option value="">Select Correct Answer</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            )}

            {editData.type === 'fill' && (
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Correct Answer"
                value={editData.correctAnswer}
                onChange={e => handleInputChange('correctAnswer', e.target.value)}
              />
            )}

            {editData.type === 'match' && (
              <textarea
                className="form-control mb-2"
                placeholder="Correct Matching: A1-11, A2-22"
                value={editData.correctAnswer}
                onChange={e => handleInputChange('correctAnswer', e.target.value)}
              />
            )}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={() => {
                setEditingIndex(null);
                document.getElementById('editModal').style.display = 'none';
              }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}











// // File: src/pages/PreviewQuiz.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function PreviewQuiz() {
//   const navigate = useNavigate();
//   const [quizMeta, setQuizMeta] = useState({});
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
//     const manualQs = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
//     const bankQs = JSON.parse(localStorage.getItem('selectedQuestionBankQuestions')) || [];

//     const combined = [...manualQs, ...bankQs.filter(q => !manualQs.find(mq => mq.id === q.id))];
//     setQuizMeta(meta);
//     setQuestions(combined);
//   }, []);

//   const handleFinalize = () => {
//     localStorage.setItem('finalQuizMeta', JSON.stringify(quizMeta));
//     localStorage.setItem('finalQuizQuestions', JSON.stringify(questions));
//     navigate('/attempt-quiz');
//   };

//   return (
//     <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe' }}>
//       {/* Header */}
//       <div className="text-white py-3 px-4" style={{
//         background: 'linear-gradient(to right, #015794, #437FAA)',
//         borderBottomLeftRadius: '60px',
//         borderBottomRightRadius: '60px'
//       }}>
//         <div className="d-flex justify-content-between align-items-center container-fluid">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Preview Quiz</h4>
//           <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
//         </div>
//       </div>

//       {/* Quiz Meta */}
//       <div className="container mt-4">
//         <h2 className="fw-bold">{quizMeta.title || 'Untitled Quiz'}</h2>
//         <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
//         <div className="d-flex gap-4 text-muted">
//           <span>📝 Questions: {questions.length}</span>
//           <span>⏱ Time: {quizMeta.timeLimit || 0} mins</span>
//           <span>📊 Difficulty: {quizMeta.difficulty || 'Not set'}</span>
//         </div>
//       </div>

//       {/* Questions List */}
//       <div className="container my-4 flex-grow-1">
//         {questions.length === 0 ? (
//           <p className="text-center text-muted">No questions added yet.</p>
//         ) : (
//           questions.map((q, index) => (
//             <div key={index} className="card mb-3 shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title mb-2">
//                   <span className="badge bg-primary me-2">Q{index + 1}</span>
//                   <strong>{q.question}</strong>
//                 </h5>

//                 {/* MCQ */}
//                 {q.type === 'mcq' && q.options?.map((opt, i) => (
//                   <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
//                 ))}

//                 {/* True/False */}
//                 {q.type === 'truefalse' && (
//                   <>
//                     <div><strong>A.</strong> True</div>
//                     <div><strong>B.</strong> False</div>
//                   </>
//                 )}

//                 {/* Fill in the Blank */}
//                 {q.type === 'fill' && (
//                   <p className="text-muted fst-italic">Student will fill in the blank.</p>
//                 )}

//                 {/* Match the Following */}
//                 {q.type === 'match' && Array.isArray(q.options) && (
//                   <>
//                     <p className="text-muted mb-1">Match the following:</p>
//                     {q.options.map((pair, idx) => (
//                       <div className="row mb-2" key={idx}>
//                         <div className="col-md-6">
//                           <strong>{`A${idx + 1}`}</strong>: {pair.left}
//                         </div>
//                         <div className="col-md-6">
//                           <strong>{`${(idx + 1) * 11}`}</strong>: {pair.right}
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 )}

//                 {/* Correct Answer Display */}
//                 <p className="mt-2 text-muted">
//                   <strong>Correct:</strong>{" "}
//                   {q.type === 'match'
//                     ? q.correctAnswer || '[Matching format: A1-11, A2-22, ...]'
//                     : q.correctAnswer}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Finalize */}
//       <div className="text-center mb-4">
//         <button className="btn btn-success px-4 py-2 fw-bold" onClick={handleFinalize}>
//           Finalize Quiz
//         </button>
//       </div>

//       <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
//         © 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }








// // File: src/pages/PreviewQuiz.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function PreviewQuiz() {
//   const navigate = useNavigate();
//   const [quizMeta, setQuizMeta] = useState({});
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
//     const manualQs = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
//     const bankQs = JSON.parse(localStorage.getItem('selectedQuestionBankQuestions')) || [];

//     // Merge without duplication
//     const combined = [...manualQs];
//     bankQs.forEach(q => {
//       if (!manualQs.some(mq => mq.id === q.id)) {
//         combined.push(q);
//       }
//     });

//     setQuizMeta(meta);
//     setQuestions(combined);
//   }, []);

//   const handleFinalize = () => {
//     localStorage.setItem('finalQuizMeta', JSON.stringify(quizMeta));
//     localStorage.setItem('finalQuizQuestions', JSON.stringify(questions));
//     navigate('/attempt-quiz');
//   };

//   return (
//     <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f9fafe' }}>
//       {/* Header */}
//       <div className="text-white py-3 px-4" style={{
//         background: 'linear-gradient(to right, #015794, #437FAA)',
//         borderBottomLeftRadius: '60px',
//         borderBottomRightRadius: '60px'
//       }}>
//         <div className="d-flex justify-content-between align-items-center container-fluid">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Quiz Preview</h4>
//           <button className="btn btn-light fw-bold" onClick={() => navigate('/create-quiz')}>Back to Editor</button>
//         </div>
//       </div>

//       {/* Quiz Metadata */}
//       <div className="container mt-4">
//         <h2 className="fw-bold">{quizMeta.title || 'Untitled Quiz'}</h2>
//         <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
//         <div className="d-flex gap-4 text-muted">
//           <span>📝 Questions: {questions.length}</span>
//           <span>⏱ Time: {quizMeta.timeLimit || 0} mins</span>
//           <span>📊 Difficulty: {quizMeta.difficulty || 'Not set'}</span>
//         </div>
//       </div>

//       {/* Questions List */}
//       <div className="container my-4 flex-grow-1">
//         {questions.length === 0 ? (
//           <p className="text-center text-muted">No questions added yet.</p>
//         ) : (
//           questions.map((q, index) => (
//             <div key={index} className="card mb-3 shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title mb-2">
//                   <span className="badge bg-primary me-2">Q{index + 1}</span>
//                   {q.question}
//                 </h5>

//                 {/* MCQ */}
//                 {q.type === 'mcq' && q.options?.map((opt, i) => (
//                   <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
//                 ))}

//                 {/* True / False */}
//                 {q.type === 'truefalse' && (
//                   <>
//                     <div><strong>A.</strong> True</div>
//                     <div><strong>B.</strong> False</div>
//                   </>
//                 )}

//                 {/* Fill in the Blank */}
//                 {q.type === 'fill' && (
//                   <p className="text-muted fst-italic">Student will fill in the blank.</p>
//                 )}

//                 {/* Match the Following */}
//                 {q.type === 'match' && q.options?.length > 0 && (
//                   <div className="row">
//                     {q.options.map((pair, idx) => (
//                       <div key={idx} className="col-6 d-flex justify-content-between mb-2">
//                         <span><strong>{pair.left}</strong></span>
//                         <span>➡</span>
//                         <span>{pair.right}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <p className="mt-2 text-muted"><strong>Correct:</strong> {
//                   q.type === 'match'
//                     ? 'Shown above (left ➡ right)'
//                     : q.correctAnswer
//                 }</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Finalize Button */}
//       <div className="text-center mb-4">
//         <button className="btn btn-success px-4 py-2 fw-bold" onClick={handleFinalize}>
//           Finalize Quiz
//         </button>
//       </div>

//       <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
//         © 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }




















// // File: src/pages/PreviewQuiz.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function PreviewQuiz() {
//   const navigate = useNavigate();
//   const [quizMeta, setQuizMeta] = useState({});
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
//     const manualQs = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
//     const bankQs = JSON.parse(localStorage.getItem('selectedQuestionBankQuestions')) || [];

//     const allQs = [...manualQs, ...bankQs.filter(q => !manualQs.find(mq => mq.id === q.id))];
//     setQuizMeta(meta);
//     setQuestions(allQs);
//   }, []);

//   const handleFinalize = () => {
//     localStorage.setItem('finalQuizMeta', JSON.stringify(quizMeta));
//     localStorage.setItem('finalQuizQuestions', JSON.stringify(questions));
//     navigate('/attempt-quiz');
//   };

//   return (
//     <div
//       className="d-flex flex-column"
//       style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f2f7fc' }}
//     >
//       {/* Header */}
//       <div
//         className="text-white py-3 px-4"
//         style={{
//           background: 'linear-gradient(to right, #015794, #437FAA)',
//           borderBottomLeftRadius: '60px',
//           borderBottomRightRadius: '60px'
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center container-fluid">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Preview Quiz</h4>
//           <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
//         </div>
//       </div>

//       {/* Quiz Meta Info */}
//       <div className="container mt-4">
//         <h2 className="fw-bold">{quizMeta.title || 'Untitled Quiz'}</h2>
//         <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
//         <div className="d-flex gap-4 text-muted">
//           <span>📝 Questions: {questions.length}</span>
//           <span>⏱ Time: {quizMeta.timeLimit || 0} mins</span>
//           <span>📊 Difficulty: {quizMeta.difficulty || 'Not set'}</span>
//         </div>
//       </div>

//       {/* Questions */}
//       <div className="container my-4 flex-grow-1">
//         {questions.length === 0 ? (
//           <p className="text-center text-muted">No questions added yet.</p>
//         ) : (
//           questions.map((q, index) => (
//             <div key={index} className="card mb-3 shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title mb-2">
//                   <span className="badge bg-primary me-2">{index + 1}</span>
//                   {q.question}
//                 </h5>

//                 {/* MCQ */}
//                 {q.type === 'mcq' && q.options?.map((opt, i) => (
//                   <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
//                 ))}

//                 {/* True/False */}
//                 {q.type === 'truefalse' && (
//                   <>
//                     <div><strong>A.</strong> True</div>
//                     <div><strong>B.</strong> False</div>
//                   </>
//                 )}

//                 {/* Fill */}
//                 {q.type === 'fill' && (
//                   <p className="text-muted fst-italic">Student will fill in the blank.</p>
//                 )}

//                 {/* Match */}
//                 {q.type === 'match' && Array.isArray(q.options) && (
//                   <>
//                     <p className="text-muted fst-italic">Match the pairs:</p>
//                     <div className="row">
//                       {q.options.map((pair, idx) => (
//                         <div className="col-md-6" key={idx}>
//                           <div className="d-flex justify-content-between">
//                             <span><strong>{pair.left}</strong></span>
//                             <span>➡</span>
//                             <span className="text-muted">{pair.right}</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}

//                 <p className="mt-2 text-muted"><strong>Correct:</strong> {
//                   q.type === 'match' ? '[Matching pairs shown above]' : q.correctAnswer
//                 }</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Finalize Button */}
//       <div className="text-center mb-4">
//         <button className="btn btn-success px-4 py-2 fw-bold" onClick={handleFinalize}>
//           Finalize Quiz
//         </button>
//       </div>

//       <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
//         © 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }






// // File: src/pages/PreviewQuiz.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function PreviewQuiz() {
//   const navigate = useNavigate();
//   const [quizMeta, setQuizMeta] = useState({});
//   const [questions, setQuestions] = useState([]);

//   // Load quiz from localStorage
//   useEffect(() => {
//     const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
//     const storedQuestions = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
//     setQuizMeta(meta);
//     setQuestions(storedQuestions);
//   }, []);

//   // Delete question
//   const handleDelete = (index) => {
//     const updated = [...questions];
//     updated.splice(index, 1);
//     setQuestions(updated);
//     localStorage.setItem('createdQuizQuestions', JSON.stringify(updated));
//   };

//   // Placeholder for edit
//   const handleEdit = (index) => {
//     alert('🛠️ Edit functionality not implemented yet.');
//   };

//   // Finalize and navigate
//   const handleFinalize = () => {
//     localStorage.setItem('finalQuizMeta', JSON.stringify(quizMeta));
//     localStorage.setItem('finalQuizQuestions', JSON.stringify(questions));
//     navigate('/attempt-quiz'); // ✅ redirects to the quiz-taking page
//   };

//   return (
//     <div
//       className="d-flex flex-column"
//       style={{
//         minHeight: '100vh',
//         width: '100vw',
//         backgroundColor: '#f2f7fc',
//         overflowX: 'hidden'
//       }}
//     >
//       {/* Header */}
//       <div className="text-white py-3 px-4" style={{
//         background: 'linear-gradient(to right, #015794, #437FAA)',
//         borderBottomLeftRadius: '60px',
//         borderBottomRightRadius: '60px'
//       }}>
//         <div className="d-flex justify-content-between align-items-center container-fluid">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Preview Quiz</h4>
//           <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
//         </div>
//       </div>

//       {/* Quiz Info */}
//       <div className="container mt-4">
//         <h2 className="fw-bold">{quizMeta.title || 'Untitled Quiz'}</h2>
//         <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
//         <div className="d-flex gap-4 text-muted">
//           <span>📝 Questions: {questions.length}</span>
//           <span>⏱ Time: {quizMeta.timeLimit || 0} mins</span>
//           <span>📊 Difficulty: {quizMeta.difficulty || 'Not set'}</span>
//         </div>
//       </div>

//       {/* Question List */}
//       <div className="container my-4 flex-grow-1">
//         {questions.length === 0 ? (
//           <p className="text-center text-muted">No questions added yet.</p>
//         ) : (
//           questions.map((q, index) => (
//             <div key={index} className="card mb-3 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-start">
//                   <div>
//                     <h5 className="card-title mb-2">
//                       <span className="badge bg-primary me-2">{index + 1}</span>
//                       {q.question}
//                     </h5>
//                   </div>
//                   <div className="d-flex gap-2">
//                     <button className="btn btn-sm btn-warning" onClick={() => handleEdit(index)}>Edit</button>
//                     <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Delete</button>
//                   </div>
//                 </div>

//                 {q.type === 'mcq' && q.options?.map((opt, i) => (
//                   <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
//                 ))}
//                 {q.type === 'truefalse' && (
//                   <>
//                     <div><strong>A.</strong> True</div>
//                     <div><strong>B.</strong> False</div>
//                   </>
//                 )}
//                 {q.type === 'fill' && (
//                   <p className="text-muted fst-italic">Student will fill in the blank.</p>
//                 )}
//                 {q.type === 'match' && (
//                   <p className="text-muted fst-italic">Match the pairs.</p>
//                 )}

//                 <p className="mt-2"><strong>Correct:</strong> {q.correctAnswer}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Finalize Button */}
//       <div className="text-center mb-4">
//         <button className="btn btn-success px-4" onClick={handleFinalize}>
//           Finalize Quiz
//         </button>
//       </div>

//       <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
//         &copy; 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }




















// // File: src/pages/PreviewQuiz.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function PreviewQuiz() {
//   const navigate = useNavigate();
//   const [quizMeta, setQuizMeta] = useState({});
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
//     const storedQuestions = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
//     setQuizMeta(meta);
//     setQuestions(storedQuestions);
//   }, []);

//   const handleDelete = (index) => {
//     const updated = [...questions];
//     updated.splice(index, 1);
//     setQuestions(updated);
//     localStorage.setItem('createdQuizQuestions', JSON.stringify(updated));
//   };

//   const handleEdit = (index) => {
//     alert('Editing not implemented yet. You can add edit flow later.');
//   };

//   const handleFinalize = () => {
//     alert('Quiz finalized! You can now submit or export.');
//     // navigate('/final-quiz'); // optional
//   };

//   return (
//     <div
//   className="d-flex flex-column"
//   style={{
//     minHeight: '100vh',
//     width: '100vw',
//     backgroundColor: '#f2f7fc',
//     overflowX: 'hidden'
//   }}
// >
//       {/* Header */}
//       <div className="text-white py-3 px-4" style={{
//         background: 'linear-gradient(to right, #015794, #437FAA)',
//         borderBottomLeftRadius: '60px',
//         borderBottomRightRadius: '60px'
//       }}>
//         <div className="d-flex justify-content-between align-items-center container-fluid">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Preview Quiz</h4>
//           <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
//         </div>
//       </div>

//       {/* Quiz Info */}
//       <div className="container mt-4">
//         <h2 className="fw-bold">{quizMeta.title || 'Untitled Quiz'}</h2>
//         <p className="text-muted">{quizMeta.description || 'No description provided.'}</p>
//         <div className="d-flex gap-4 text-muted">
//           <span>📝 Questions: {questions.length}</span>
//           <span>⏱ Time: {quizMeta.timeLimit || 0} mins</span>
//           <span>📊 Difficulty: {quizMeta.difficulty || 'Not set'}</span>
//         </div>
//       </div>

//       {/* Questions List */}
//       <div className="container my-4 flex-grow-1">
//         {questions.length === 0 ? (
//           <p className="text-center text-muted">No questions added yet.</p>
//         ) : (
//           questions.map((q, index) => (
//             <div key={index} className="card mb-3 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-start">
//                   <div>
//                     <h5 className="card-title mb-2">
//                       <span className="badge bg-primary me-2">{index + 1}</span>
//                       {q.question}
//                     </h5>
//                   </div>
//                   <div className="d-flex gap-2">
//                     <button className="btn btn-sm btn-warning" onClick={() => handleEdit(index)}>Edit</button>
//                     <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Delete</button>
//                   </div>
//                 </div>

//                 {q.type === 'mcq' && q.options?.map((opt, i) => (
//                   <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</div>
//                 ))}
//                 {q.type === 'truefalse' && (
//                   <>
//                     <div><strong>A.</strong> True</div>
//                     <div><strong>B.</strong> False</div>
//                   </>
//                 )}
//                 {q.type === 'fill' && (
//                   <p className="text-muted fst-italic">Student will fill in the blank.</p>
//                 )}
//                 {q.type === 'match' && (
//                   <p className="text-muted fst-italic">Match the pairs.</p>
//                 )}

//                 <p className="mt-2"><strong>Correct:</strong> {q.correctAnswer}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Footer and Finalize */}
//       <div className="text-center mb-4">
//         <button className="btn btn-success px-4" onClick={handleFinalize} >Finalize Quiz</button>
//       </div>
//       <footer className="text-center text-muted py-3">
//         © 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }














// // File: src/pages/PreviewQuiz.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function PreviewQuiz() {
//   const navigate = useNavigate();
//   const [quizMeta, setQuizMeta] = useState({});
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
//     const storedQuestions = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
//     setQuizMeta(meta);
//     setQuestions(storedQuestions);
//   }, []);

//   const handleDelete = (index) => {
//     const updated = [...questions];
//     updated.splice(index, 1);
//     setQuestions(updated);
//     localStorage.setItem('createdQuizQuestions', JSON.stringify(updated));
//   };

//   const handleFinalize = () => {
//     alert("✅ Quiz finalized! Ready to submit or export.");
//   };

//   return (
//     <div
//       className="d-flex flex-column"
//       style={{
//         minHeight: '100vh',
//         width: '100vw',
//         backgroundColor: '#f2f7fc',
//         overflowX: 'hidden'
//       }}
//     >
//       {/* Header */}
//       <div
//         className="text-white px-4 pt-3 pb-4"
//         style={{
//           background: 'linear-gradient(to right, #015794, #437FAA)',
//           borderBottomLeftRadius: '60px',
//           borderBottomRightRadius: '60px',
//           width: '100%',
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Preview Quiz</h4>
//           <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
//         </div>
//         <div className="mt-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <h3 className="fw-bold">{quizMeta.title || 'Untitled Quiz'}</h3>
//           <p className="mb-0">{quizMeta.description || 'No description provided.'}</p>
//         </div>
//       </div>

//       {/* Questions */}
//       <div className="flex-grow-1 py-4" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
//         {questions.length === 0 ? (
//           <p className="text-center text-muted fs-5 mt-5">No questions added yet.</p>
//         ) : (
//           questions.map((q, index) => (
//             <div
//               key={index}
//               className="card mb-4 shadow-sm"
//               style={{ width: '100%' }}
//             >
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-start">
//                   <h5 className="card-title mb-3">
//                     <span className="badge bg-primary me-2">{index + 1}</span>
//                     {q.question}
//                   </h5>
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => handleDelete(index)}
//                   >
//                     Delete
//                   </button>
//                 </div>

//                 {q.type === 'mcq' && q.options?.length > 0 && (
//                   <>
//                     {["A", "B", "C", "D"].map((opt, i) => (
//                       <div key={i}>
//                         <strong>{opt}.</strong> {q.options[i] || <span className="text-muted">[empty]</span>}
//                       </div>
//                     ))}
//                     <p className="mt-2"><strong>Correct:</strong> {q.correctAnswer}</p>
//                   </>
//                 )}

//                 {q.type === 'truefalse' && (
//                   <>
//                     <div><strong>A.</strong> True</div>
//                     <div><strong>B.</strong> False</div>
//                     <p className="mt-2"><strong>Correct:</strong> {q.correctAnswer}</p>
//                   </>
//                 )}

//                 {q.type === 'fill' && (
//                   <>
//                     <p className="text-muted fst-italic">Student will fill in the blank.</p>
//                     <p className="mt-2"><strong>Answer:</strong> {q.correctAnswer}</p>
//                   </>
//                 )}

//                 {q.type === 'match' && (
//                   <>
//                     <p className="text-muted fst-italic">Match the following pairs.</p>
//                     <p className="mt-2"><strong>Answer:</strong> {q.correctAnswer}</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Finalize */}
//       <div className="text-center mb-4" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
//         <button
//           className="btn btn-success px-4 py-2"
//           onClick={handleFinalize}
//           style={{ fontWeight: 'bold', fontSize: '1rem' }}
//         >
//           Finalize Quiz
//         </button>
//       </div>

//       <footer className="text-center text-muted py-3 bg-light mt-auto w-100">
//         &copy; 2025 QUIZZE. All rights reserved.
//       </footer>
//     </div>
//   );
// }


























// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// export default function PreviewQuiz() {
//   const navigate = useNavigate();
//   const [quizMeta, setQuizMeta] = useState({});
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
//     const storedQuestions = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
//     setQuizMeta(meta);
//     setQuestions(storedQuestions);
//   }, []);

//   const handleDelete = (index) => {
//     const updated = [...questions];
//     updated.splice(index, 1);
//     setQuestions(updated);
//     localStorage.setItem('createdQuizQuestions', JSON.stringify(updated));
//   };

//   const handleEdit = (index) => {
//     const editQuestion = questions[index];
//     localStorage.setItem('editQuizQuestion', JSON.stringify({ ...editQuestion, index }));
//     navigate('/create-quiz');
//   };

//   const handleFinalize = () => {
//     alert('Quiz finalized! You can now submit or export it.');
//     // Future: navigate('/final-paper') or export as PDF
//   };

//   return (
//     <div className="position-relative" style={{ minHeight: '100vh', backgroundColor: '#f2f7fc' }}>
//       {/* Header */}
//       <div className="text-white py-3 px-4 mb-4"
//         style={{
//           background: 'linear-gradient(to right, #015794, #437FAA)',
//           borderBottomLeftRadius: '60px',
//           borderBottomRightRadius: '60px'
//         }}>
//         <div className="d-flex justify-content-between align-items-center container">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <h4 className="mb-0 fw-bold">Preview Quiz</h4>
//           <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
//         </div>
//         <div className="container mt-3">
//           <h3>{quizMeta.title}</h3>
//           <p className="mb-0">{quizMeta.description}</p>
//         </div>
//       </div>

//       {/* Questions */}
//       <div className="container mb-5">
//         {questions.length === 0 ? (
//           <p className="text-center text-muted">No questions added yet.</p>
//         ) : (
//           questions.map((q, index) => (
//             <div key={index} className="card mb-4 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between">
//                   <h5 className="card-title mb-3">
//                     <span className="badge bg-primary me-2">{index + 1}</span>
//                     {q.question}
//                   </h5>
//                   <div>
//                     <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(index)}>Edit</button>
//                     <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Delete</button>
//                   </div>
//                 </div>

//                 {/* MCQ */}
//                 {q.type === 'mcq' && (
//                   <>
//                     {['A', 'B', 'C', 'D'].map((opt, i) => (
//                       <div key={i}><strong>{opt}.</strong> {q.options[i]}</div>
//                     ))}
//                     <p className="mt-2"><strong>Correct:</strong> {q.correctAnswer}</p>
//                   </>
//                 )}

//                 {/* True / False */}
//                 {q.type === 'truefalse' && (
//                   <>
//                     <div><strong>A.</strong> True</div>
//                     <div><strong>B.</strong> False</div>
//                     <p className="mt-2"><strong>Correct:</strong> {q.correctAnswer}</p>
//                   </>
//                 )}

//                 {/* Fill in the blank */}
//                 {q.type === 'fill' && (
//                   <>
//                     <p className="text-muted fst-italic">Student will fill in the blank.</p>
//                     <p className="mt-2"><strong>Answer:</strong> {q.correctAnswer}</p>
//                   </>
//                 )}

//                 {/* Match the following */}
//                 {q.type === 'match' && (
//                   <>
//                     <p className="text-muted fst-italic">Match the pairs (not rendered here).</p>
//                     <p className="mt-2"><strong>Answer:</strong> {q.correctAnswer}</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Finalize Button */}
//       <div className="text-center mb-5">
//         <button className="btn btn-success px-5 py-2" onClick={handleFinalize}>Finalize Quiz</button>
//       </div>
//     </div>
//   );
// }

















// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import logo from '../assets/logo.png';

// // export default function PreviewQuiz() {
// //   const navigate = useNavigate();
// //   const [quizMeta, setQuizMeta] = useState({});
// //   const [questions, setQuestions] = useState([]);

// //   useEffect(() => {
// //     const meta = JSON.parse(localStorage.getItem('createdQuizMeta')) || {};
// //     const storedQuestions = JSON.parse(localStorage.getItem('createdQuizQuestions')) || [];
// //     setQuizMeta(meta);
// //     setQuestions(storedQuestions);
// //   }, []);

// //   const handleDelete = (index) => {
// //     const updated = [...questions];
// //     updated.splice(index, 1);
// //     setQuestions(updated);
// //     localStorage.setItem('createdQuizQuestions', JSON.stringify(updated));
// //   };

// //   const handleFinalize = () => {
// //     alert("Quiz finalized! You can now submit or export it.");
// //     // Navigate to final submission page or export PDF
// //   };

// //   return (
// //     <div className="position-relative" style={{ minHeight: '100vh', backgroundColor: '#f2f7fc' }}>
// //       {/* Header */}
// //       <div className="text-white py-3 px-4 mb-4" style={{
// //         background: 'linear-gradient(to right, #015794, #437FAA)',
// //         borderBottomLeftRadius: '60px',
// //         borderBottomRightRadius: '60px'
// //       }}>
// //         <div className="d-flex justify-content-between align-items-center container">
// //           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
// //           <h4 className="mb-0 fw-bold">Preview Quiz</h4>
// //           <button className="btn btn-light" onClick={() => navigate('/create-quiz')}>Back</button>
// //         </div>
// //         <div className="container mt-3">
// //           <h3>{quizMeta.title}</h3>
// //           <p className="mb-0">{quizMeta.description}</p>
// //         </div>
// //       </div>

// //       {/* Questions */}
// //       <div className="container">
// //         {questions.length === 0 ? (
// //           <p className="text-center text-muted">No questions added yet.</p>
// //         ) : (
// //           questions.map((q, index) => (
// //             <div key={index} className="card mb-4 shadow-sm">
// //               <div className="card-body">
// //                 <div className="d-flex justify-content-between">
// //                   <h5 className="card-title mb-2">
// //                     <span className="badge bg-primary me-2">{index + 1}</span>
// //                     {q.question}
// //                   </h5>
// //                   <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Delete</button>
// //                 </div>

// //                 {q.type === 'mcq' && (
// //                   <>
// //                     {["A", "B", "C", "D"].map((opt, i) => (
// //                       <div key={i}>
// //                         <strong>{opt}.</strong> {q.options[i]}
// //                       </div>
// //                     ))}
// //                     <p className="mt-2"><strong>Correct:</strong> {q.correctAnswer}</p>
// //                   </>
// //                 )}

// //                 {q.type === 'truefalse' && (
// //                   <>
// //                     <div><strong>A.</strong> True</div>
// //                     <div><strong>B.</strong> False</div>
// //                     <p className="mt-2"><strong>Correct:</strong> {q.correctAnswer}</p>
// //                   </>
// //                 )}

// //                 {q.type === 'fill' && (
// //                   <>
// //                     <p className="text-muted fst-italic">Student will fill in the blank.</p>
// //                     <p className="mt-2"><strong>Answer:</strong> {q.correctAnswer}</p>
// //                   </>
// //                 )}

// //                 {q.type === 'match' && (
// //                   <>
// //                     <p className="text-muted fst-italic">Match the pairs (not shown here).</p>
// //                     <p className="mt-2"><strong>Answer:</strong> {q.correctAnswer}</p>
// //                   </>
// //                 )}
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       {/* Finalize Button */}
// //       <div className="text-center mt-4 mb-5">
// //         <button className="btn btn-success px-4" onClick={handleFinalize}>Finalize Quiz</button>
// //       </div>
// //     </div>
// //   );
// // }
