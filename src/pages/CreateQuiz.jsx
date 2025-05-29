// File: src/pages/CreateQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [questionType, setQuestionType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [useQuestionBank, setUseQuestionBank] = useState(false);
  const [quizMeta, setQuizMeta] = useState({
    title: '',
    description: '',
    numberOfQuestions: '',
    timeLimit: '',
    difficulty: '',
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: '',
    question: '',
    options: [],
    correctAnswer: ''
  });

  useEffect(() => {
    const storedQuestions = localStorage.getItem('selectedQuestionBankQuestions');
    if (storedQuestions) {
      const parsed = JSON.parse(storedQuestions);
      setQuestions(prev => [...prev, ...parsed]);
      localStorage.removeItem('selectedQuestionBankQuestions');
    }
  }, []);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!currentQuestion.question || !currentQuestion.correctAnswer) return;
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ type: '', question: '', options: [], correctAnswer: '' });
    setQuestionType('');
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  };

  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    setQuizMeta(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, side, value) => {
    const updated = [...currentQuestion.options];
    updated[index] = { ...updated[index], [side]: value };
    setCurrentQuestion({ ...currentQuestion, options: updated });
  };

  const renderQuestionInputs = () => {
    switch (questionType) {
      case 'mcq':
        return (
          <>
            <label className="form-label mt-3">Options</label>
            {["A", "B", "C", "D"].map((opt, idx) => (
              <div className="input-group mb-2" key={idx}>
                <span className="input-group-text">{opt}</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${opt}`}
                  value={currentQuestion.options[idx] || ''}
                  onChange={(e) => {
                    const updated = [...currentQuestion.options];
                    updated[idx] = e.target.value;
                    setCurrentQuestion({ ...currentQuestion, options: updated });
                  }}
                  required
                />
              </div>
            ))}
            <label className="form-label">Correct Option</label>
            <select
              className="form-select mb-3"
              value={currentQuestion.correctAnswer}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
              required
            >
              <option value="">Select correct option</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </>
        );

      case 'truefalse':
        return (
          <>
            <label className="form-label mt-3">Options</label>
            <div className="input-group mb-2">
              <span className="input-group-text">A</span>
              <input type="text" className="form-control" value="True" readOnly />
            </div>
            <div className="input-group mb-2">
              <span className="input-group-text">B</span>
              <input type="text" className="form-control" value="False" readOnly />
            </div>
            <label className="form-label">Correct Answer</label>
            <select
              className="form-select mb-3"
              value={currentQuestion.correctAnswer}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
              required
            >
              <option value="">Select</option>
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          </>
        );

      case 'fill':
        return (
          <>
            <label className="form-label">Correct Answer</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter correct answer"
              value={currentQuestion.correctAnswer}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
              required
            />
          </>
        );

      case 'match':
        return (
          <>
            <label className="form-label mt-3">Pairs</label>
            {[0, 1, 2].map((idx) => (
              <div className="row mb-2" key={idx}>
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text">{`A${idx + 1}`}</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Left ${idx + 1}`}
                      value={currentQuestion.options[idx]?.left || ''}
                      onChange={(e) => handleOptionChange(idx, 'left', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text">{`${(idx + 1) * 11}`}</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Right ${idx + 1}`}
                      value={currentQuestion.options[idx]?.right || ''}
                      onChange={(e) => handleOptionChange(idx, 'right', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <label className="form-label">Correct Matching</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. A1-11, A2-22, A3-33"
              value={currentQuestion.correctAnswer}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
              required
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="text-white px-4 pt-3 pb-4" style={{ background: 'linear-gradient(to right, #015794, #437FAA)', borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <img src={logo} alt="Logo" style={{ width: '140px' }} />
          <a href="/creator" className="text-white fw-bold">Dashboard</a>
        </div>
        <div className="text-center mt-2">
          <h1 className="fw-bold">Create a New Quiz</h1>
          <p className="lead">Fill out the form below to create your quiz</p>
        </div>
      </div>

      {/* Form */}
      <div className="container-fluid my-5 px-5" style={{ maxWidth: '100%' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Meta */}
          <div className="mb-3">
            <label className="form-label">Quiz Title</label>
            <input type="text" className="form-control" name="title" value={quizMeta.title} onChange={handleMetaChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Quiz Description</label>
            <textarea className="form-control" name="description" value={quizMeta.description} onChange={handleMetaChange} rows="3" required />
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">No. of Questions</label>
              <input type="number" className="form-control" name="numberOfQuestions" value={quizMeta.numberOfQuestions} onChange={handleMetaChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Time Limit (minutes)</label>
              <input type="number" className="form-control" name="timeLimit" value={quizMeta.timeLimit} onChange={handleMetaChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Difficulty</label>
              <select className="form-select" name="difficulty" value={quizMeta.difficulty} onChange={handleMetaChange}>
                <option value="">Select</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Question Section */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={useQuestionBank}
              onChange={() => {
                const newState = !useQuestionBank;
                setUseQuestionBank(newState);
                if (newState) navigate('/question-bank');
              }}
            />
            <label className="form-check-label">Use Questions from Question Bank</label>
          </div>

          {!useQuestionBank && (
            <>
              <div className="mb-3">
                <label className="form-label">Question Type</label>
                <select className="form-select" value={questionType} onChange={(e) => {
                  setQuestionType(e.target.value);
                  setCurrentQuestion({ ...currentQuestion, type: e.target.value, options: [] });
                }}>
                  <option value="">Select Type</option>
                  <option value="mcq">Multiple Choice</option>
                  <option value="truefalse">True / False</option>
                  <option value="fill">Fill in the Blank</option>
                  <option value="match">Match the Following</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  placeholder="Enter your question"
                />
              </div>
              {renderQuestionInputs()}
            </>
          )}

          <div className="text-center mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={handleAddQuestion} disabled={useQuestionBank}>Add Question</button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                localStorage.setItem('createdQuizQuestions', JSON.stringify(questions));
                localStorage.setItem('createdQuizMeta', JSON.stringify(quizMeta));
                navigate('/preview-quiz');
              }}
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>

      <footer className="text-center mt-auto py-3 text-muted">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}




















// // File: src/pages/CreateQuiz.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';
// import bulb1 from '../assets/icon-bulb1.png';
// import pencil1 from '../assets/icon-pencil1.png';
// import trophy1 from '../assets/icon-trophy1.png';
// import question1 from '../assets/icon-question1.png';

// export default function CreateQuiz() {
//   const navigate = useNavigate();
//   const [questionType, setQuestionType] = useState('');
//   const [questions, setQuestions] = useState([]);
//   const [useQuestionBank, setUseQuestionBank] = useState(false);
//   const [quizTitle, setQuizTitle] = useState('');
//   const [quizDescription, setQuizDescription] = useState('');

//   const [currentQuestion, setCurrentQuestion] = useState({
//     type: '',
//     question: '',
//     options: ['', '', '', ''],
//     correctAnswer: ''
//   });

//   const handleAddQuestion = () => {
//     setQuestions([...questions, currentQuestion]);
//     setCurrentQuestion({ type: '', question: '', options: ['', '', '', ''], correctAnswer: '' });
//     setQuestionType('');
//   };

//   const handleQuestionChange = (e) => {
//     setCurrentQuestion({ ...currentQuestion, question: e.target.value });
//   };

//   const handleOptionChange = (index, value) => {
//     const updatedOptions = [...currentQuestion.options];
//     updatedOptions[index] = value;
//     setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
//   };

//   const renderQuestionInputs = () => {
//     switch (questionType) {
//       case 'mcq':
//         return (
//           <>
//             <label className="form-label mt-3">Options</label>
//             {["A", "B", "C", "D"].map((opt, idx) => (
//               <div className="input-group mb-2" key={idx}>
//                 <span className="input-group-text">{opt}</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder={`Option ${opt}`}
//                   value={currentQuestion.options[idx]}
//                   onChange={(e) => handleOptionChange(idx, e.target.value)}
//                   required
//                 />
//               </div>
//             ))}
//             <label className="form-label">Correct Option</label>
//             <select
//               className="form-select mb-3"
//               value={currentQuestion.correctAnswer}
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
//               required
//             >
//               <option value="">Select correct option</option>
//               <option value="A">A</option>
//               <option value="B">B</option>
//               <option value="C">C</option>
//               <option value="D">D</option>
//             </select>
//           </>
//         );

//       case 'truefalse':
//         return (
//           <>
//             <label className="form-label mt-3">Options</label>
//             <div className="input-group mb-2">
//               <span className="input-group-text">A</span>
//               <input type="text" className="form-control" value="True" readOnly />
//             </div>
//             <div className="input-group mb-2">
//               <span className="input-group-text">B</span>
//               <input type="text" className="form-control" value="False" readOnly />
//             </div>
//             <label className="form-label">Correct Answer</label>
//             <select
//               className="form-select mb-3"
//               value={currentQuestion.correctAnswer}
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
//               required
//             >
//               <option value="">Select</option>
//               <option value="True">True</option>
//               <option value="False">False</option>
//             </select>
//           </>
//         );

//       case 'fill':
//         return (
//           <>
//             <p className="text-muted fst-italic">Student will fill in the blank during quiz. No options required.</p>
//             <label className="form-label">Correct Answer</label>
//             <input
//               type="text"
//               className="form-control mb-3"
//               placeholder="Enter correct answer"
//               value={currentQuestion.correctAnswer}
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
//               required
//             />
//           </>
//         );

//       case 'match':
//         return (
//           <>
//             <label className="form-label mt-3">Pairs (Match the Following)</label>
//             {[1, 2, 3].map((_, idx) => (
//               <div className="row mb-2" key={idx}>
//                 <div className="col">
//                   <input type="text" className="form-control" placeholder={`A${idx + 1}`} required />
//                 </div>
//                 <div className="col">
//                   <input type="text" className="form-control" placeholder={`1${idx + 1}`} required />
//                 </div>
//               </div>
//             ))}
//             <label className="form-label mt-2">Correct Matching Description</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="e.g. A1-1A, A2-2B"
//               value={currentQuestion.correctAnswer}
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
//               required
//             />
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f8f9fa', overflow: 'hidden' }}>
//       {/* Icons */}
//           <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '48%', left: '3%', width: '185px', opacity: 2, transform: 'rotate(-1deg)' }} />
//           <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '5%', width: '205px', opacity: 3, transform: 'rotate(7deg)' }} />
//           <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '22%', left: '87%', transform: 'translateX(-49%) rotate(-2deg)', width: '210px', opacity: 2.5, zIndex: 0 }} />
//           <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '61%' , left: '83%' , width: '215px', opacity: 2, transform: 'translateX(-19%) rotate(-1deg)' }} />

//       {/* Header */}
//       <div className="text-white px-4 pt-3 pb-4" style={{ background: 'linear-gradient(to right, #015794, #437FAA)', borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px', width: '100%' }}>
//         <div className="container d-flex justify-content-between align-items-center">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px' }} />
//           <a href="/creator" className="text-white fw-bold">Dashboard</a>
//         </div>
//         <div className="text-center mt-2">
//           <h1 className="fw-bold">Create a New Quiz</h1>
//           <p className="lead">Fill out the form below to create your quiz</p>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="container my-5 d-flex justify-content-center">
//         <div className="bg-white shadow p-4 rounded w-100" style={{ maxWidth: '900px' }}>
//           <form onSubmit={(e) => e.preventDefault()}>
//             <div className="mb-3">
//               <label className="form-label">Quiz Title</label>
//               <input type="text" className="form-control" placeholder="Enter quiz title" required value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Quiz Description</label>
//               <textarea className="form-control" placeholder="Describe the quiz" rows="3" required value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)}></textarea>
//             </div>
//             <h5 className="fw-bold mb-3">Add a New Question</h5>
//             <div className="form-check form-switch mb-3">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={useQuestionBank}
//                 onChange={() => {
//                   const newState = !useQuestionBank;
//                   setUseQuestionBank(newState);
//                   if (newState) navigate('/question-bank');
//                 }}
//               />
//               <label className="form-check-label">Use Questions from Question Bank</label>
//             </div>

//             {!useQuestionBank && (
//               <>
//                 <div className="mb-3">
//                   <label className="form-label">Question Type</label>
//                   <select
//                     className="form-select"
//                     required
//                     value={questionType}
//                     onChange={(e) => {
//                       setQuestionType(e.target.value);
//                       setCurrentQuestion({ ...currentQuestion, type: e.target.value });
//                     }}
//                   >
//                     <option value="">Select question type</option>
//                     <option value="mcq">Multiple Choice</option>
//                     <option value="fill">Fill in the Blank</option>
//                     <option value="match">Match the Following</option>
//                     <option value="truefalse">True / False</option>
//                   </select>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Question</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter your question here"
//                     required
//                     value={currentQuestion.question}
//                     onChange={handleQuestionChange}
//                   />
//                 </div>
//                 {renderQuestionInputs()}
//               </>
//             )}

//             {/* Buttons */}
//             <div className="text-center mt-4">
//               <button type="button" className="btn btn-secondary px-4 me-2" onClick={handleAddQuestion} disabled={useQuestionBank}>
//                 Add Question
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-info px-4 me-2"
//                 onClick={() => {
//                   localStorage.setItem('createdQuizQuestions', JSON.stringify(questions));
//                   localStorage.setItem('createdQuizMeta', JSON.stringify({ title: quizTitle, description: quizDescription }));
//                   navigate('/preview-quiz');
//                 }}
//               >
//                 Preview Quiz
//               </button>
//               <button type="submit" className="btn btn-success px-4">Create Quiz</button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <footer className="text-center mt-auto mb-3">
//         <p className="text-muted">&copy; 2025 QUIZZE. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }



































// // File: src/pages/CreateQuiz.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';
// import bulb1 from '../assets/icon-bulb1.png';
// import pencil1 from '../assets/icon-pencil1.png';
// import trophy1 from '../assets/icon-trophy1.png';
// import question1 from '../assets/icon-question1.png';

// export default function CreateQuiz() {
//   const navigate = useNavigate();
//   const [questionType, setQuestionType] = useState('');
//   const [questions, setQuestions] = useState([]);
//   const [useQuestionBank, setUseQuestionBank] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState({
//     type: '',
//     question: '',
//     options: ['', '', '', ''],
//     correctAnswer: ''
//   });

//   const handleAddQuestion = () => {
//     setQuestions([...questions, currentQuestion]);
//     setCurrentQuestion({ type: '', question: '', options: ['', '', '', ''], correctAnswer: '' });
//     setQuestionType('');
//   };

//   const handleQuestionChange = (e) => {
//     setCurrentQuestion({ ...currentQuestion, question: e.target.value });
//   };

//   const handleOptionChange = (index, value) => {
//     const updatedOptions = [...currentQuestion.options];
//     updatedOptions[index] = value;
//     setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
//   };

//   const renderQuestionInputs = () => {
//     switch (questionType) {
//       case 'mcq':
//         return (
//           <>
//             <label className="form-label mt-3">Options</label>
//             {["A", "B", "C", "D"].map((opt, idx) => (
//               <div className="input-group mb-2" key={idx}>
//                 <span className="input-group-text">{opt}</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder={`Option ${opt}`}
//                   value={currentQuestion.options[idx]}
//                   onChange={(e) => handleOptionChange(idx, e.target.value)}
//                   required
//                 />
//               </div>
//             ))}
//             <label className="form-label">Correct Option</label>
//             <select
//               className="form-select mb-3"
//               value={currentQuestion.correctAnswer}
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
//               required
//             >
//               <option value="">Select correct option</option>
//               <option value="A">A</option>
//               <option value="B">B</option>
//               <option value="C">C</option>
//               <option value="D">D</option>
//             </select>
//           </>
//         );

//       case 'truefalse':
//         return (
//           <>
//             <label className="form-label mt-3">Options</label>
//             <div className="input-group mb-2">
//               <span className="input-group-text">A</span>
//               <input
//                 type="text"
//                 className="form-control"
//                 value="True"
//                 readOnly
//               />
//             </div>
//             <div className="input-group mb-2">
//               <span className="input-group-text">B</span>
//               <input
//                 type="text"
//                 className="form-control"
//                 value="False"
//                 readOnly
//               />
//             </div>
//             <label className="form-label">Correct Answer</label>
//             <select
//               className="form-select mb-3"
//               value={currentQuestion.correctAnswer}
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
//               required
//             >
//               <option value="">Select</option>
//               <option value="True">True</option>
//               <option value="False">False</option>
//             </select>
//           </>
//         );

//       case 'fill':
//         return (
//           <>
//             <p className="text-muted fst-italic">Student will fill in the blank during quiz. No options required.</p>
//             <label className="form-label">Correct Answer</label>
//             <input
//               type="text"
//               className="form-control mb-3"
//               placeholder="Enter correct answer"
//               value={currentQuestion.correctAnswer}
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
//               required
//             />
//           </>
//         );

//       case 'match':
//         return (
//           <>
//             <label className="form-label mt-3">Pairs (Match the Following)</label>
//             {[1, 2, 3].map((_, idx) => (
//               <div className="row mb-2" key={idx}>
//                 <div className="col">
//                   <input type="text" className="form-control" placeholder={`A${idx + 1}`} required />
//                 </div>
//                 <div className="col">
//                   <input type="text" className="form-control" placeholder={`1${idx + 1}`} required />
//                 </div>
//               </div>
//             ))}
//             <label className="form-label mt-2">Correct Matching Description</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="e.g. A1-1A, A2-2B"
//               value={currentQuestion.correctAnswer}
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
//               required
//             />
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//      <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f8f9fa', overflow: 'hidden' }}>
//       {/* Background Icons */}
//           <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '48%', left: '3%', width: '185px', opacity: 2, transform: 'rotate(-1deg)' }} />
//           <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '5%', width: '205px', opacity: 3, transform: 'rotate(7deg)' }} />
//           <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '22%', left: '87%', transform: 'translateX(-49%) rotate(-2deg)', width: '210px', opacity: 2.5, zIndex: 0 }} />
//           <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '61%' , left: '83%' , width: '215px', opacity: 2, transform: 'translateX(-19%) rotate(-1deg)' }} />


//       {/* Header */}
//       <div className="text-white px-4 pt-3 pb-4 position-relative" style={{ background: 'linear-gradient(to right, #015794, #437FAA)', borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px', width: '100%' }}>
//         <div className="container d-flex justify-content-between align-items-center">
//           <img src={logo} alt="Quizze Logo" style={{ width: '140px', marginTop: '4px' }} />
//           <a href="/creator" className="text-white fw-bold" style={{ fontSize: '1rem', marginTop: '5px' }}>Dashboard</a>
//         </div>
//         <div className="text-center mt-2">
//           <h1 className="fw-bold">Create a New Quiz</h1>
//           <p className="lead">Fill out the form below to create your quiz</p>
//         </div>
//       </div>
//       {/* Main Form */}
//       <div className="container my-5 d-flex justify-content-center">
//         <div className="bg-white shadow p-4 rounded w-100" style={{ maxWidth: '900px' }}>
//           <form>
//             <div className="mb-3">
//               <label className="form-label">Quiz Title</label>
//               <input type="text" className="form-control" placeholder="Enter quiz title" required />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Quiz Description</label>
//               <textarea className="form-control" placeholder="Describe the quiz" rows="3" required></textarea>
//             </div>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Number of Questions</label>
//                 <input type="number" className="form-control" placeholder="e.g. 10" required />
//               </div>
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Time Limit (minutes)</label>
//                 <input type="number" className="form-control" placeholder="e.g. 30" required />
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="form-label">Difficulty Level</label>
//               <select className="form-select" required>
//                 <option value="">Select Difficulty</option>
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//               </select>
//             </div>
//             <h5 className="fw-bold mb-3">Add a New Question</h5>
//             <div className="form-check form-switch mb-3">
//             <input
//                  className="form-check-input"
//                  type="checkbox"
//                  id="toggleQuestionBank"
//                  checked={useQuestionBank}
//                  onChange={() => {
//                    const newState = !useQuestionBank;
//                    setUseQuestionBank(newState);
//                    if (newState) {
//                      navigate('/question-bank');  // 🔁 redirect to page
//                    }
//                  }}
//                    />
//                    <label className="form-check-label" htmlFor="toggleQuestionBank">
//                      Use Questions from Question Bank
//                    </label>
//               </div>

//             {!useQuestionBank && (
//               <>
//                 <div className="mb-3">
//                   <label className="form-label">Question Type</label>
//                   <select
//                     className="form-select"
//                     required
//                     value={questionType}
//                     onChange={(e) => {
//                       setQuestionType(e.target.value);
//                       setCurrentQuestion({ ...currentQuestion, type: e.target.value });
//                     }}
//                   >
//                     <option value="">Select question type</option>
//                     <option value="mcq">Multiple Choice</option>
//                     <option value="fill">Fill in the Blank</option>
//                     <option value="match">Match the Following</option>
//                     <option value="truefalse">True / False</option>
//                   </select>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Question</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter your question here"
//                     required
//                     value={currentQuestion.question}
//                     onChange={handleQuestionChange}
//                   />
//                 </div>
//                 {renderQuestionInputs()}
//               </>
//             )}
            

//             <div className="text-center mt-4">
//               <div className="text-center mt-4">
//   <button
//     type="button"
//     className="btn btn-secondary px-4 me-2"
//     onClick={handleAddQuestion}
//     disabled={useQuestionBank}
//   >
//     Add Question
//   </button>

//   <button
//     type="button"
//     className="btn btn-info px-4 me-2"
//     onClick={() => {
//       localStorage.setItem('createdQuizQuestions', JSON.stringify(questions));
//       localStorage.setItem(
//         'createdQuizMeta',
//         JSON.stringify({ title: quizTitle, description: quizDescription })
//       );
//       navigate('/preview-quiz');
//     }}
//   >
//     Preview Quiz
//   </button>

//   <button type="submit" className="btn btn-success px-4">
//     Create Quiz
//   </button>
// </div>
//             </div>
//           </form>
//         </div>
//       </div>

//       <footer className="text-center mt-auto mb-3">
//         <p className="text-muted">&copy; 2025 QUIZZE. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }








