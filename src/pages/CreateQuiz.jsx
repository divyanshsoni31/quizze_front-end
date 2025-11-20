import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import bulb1 from '../assets/icon-bulb1.png';
import pencil1 from '../assets/icon-pencil1.png';
import trophy1 from '../assets/icon-trophy1.png';
import question1 from '../assets/icon-question1.png';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [questionType, setQuestionType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [useQuestionBank, setUseQuestionBank] = useState(false);

  const [quizMeta, setQuizMeta] = useState({
    title: '',
    description: '',
    subject: '',
    customSubject: '',
    timeLimit: '',
    difficulty: '',
    isCertificate: false,
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: '',
    question: '',
    options: [],
    correctAnswer: ''
  });

  useEffect(() => {
    const isReset = localStorage.getItem('quizReset');

    if (isReset === 'true') {
      localStorage.removeItem('quizReset');
      setQuizMeta({
        title: '',
        description: '',
        subject: '',
        customSubject: '',
        timeLimit: '',
        difficulty: '',
        isCertificate: false
      });

      setQuestions([]);
      setCurrentQuestion({
        type: '',
        question: '',
        options: [],
        correctAnswer: ''
      });

      localStorage.removeItem('tempQuizMeta');
      localStorage.removeItem('tempQuestions');
      localStorage.removeItem('finalQuizMeta');
      localStorage.removeItem('finalQuizQuestions');
      localStorage.removeItem('createdQuizMeta');
      localStorage.removeItem('createdQuizQuestions');

      return;
    }

    const storedQuestions = localStorage.getItem('selectedQuestionBankQuestions');
    if (storedQuestions) {
      const parsed = JSON.parse(storedQuestions);
      setQuestions(prev => [...prev, ...parsed]);
      localStorage.removeItem('selectedQuestionBankQuestions');
    }

    const tempMeta = localStorage.getItem('tempQuizMeta');
    const tempQues = localStorage.getItem('tempQuestions');

    if (tempMeta) {
      setQuizMeta(JSON.parse(tempMeta));
      localStorage.removeItem('tempQuizMeta');
    }

    if (tempQues) {
      const parsed = JSON.parse(tempQues);
      if (parsed.length > 0) {
        setQuestions(prev => [...prev, ...parsed]);
      }
      localStorage.removeItem('tempQuestions');
    }
  }, []);

  const handleMetaChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizMeta(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ======================= ⭐ FIXED MCQ ANSWER ISSUE HERE ⭐ =======================
  const handleAddQuestion = () => {
    if (!currentQuestion.question || (currentQuestion.type !== 'match' && !currentQuestion.correctAnswer)) {
      alert('Fill all question fields');
      return;
    }

    // Convert MCQ "A/B/C/D" into actual option text
    let finalCorrectAnswer = currentQuestion.correctAnswer;

    if (currentQuestion.type === "mcq") {
      const indexMap = { A: 0, B: 1, C: 2, D: 3 };
      finalCorrectAnswer = currentQuestion.options[indexMap[currentQuestion.correctAnswer]];
    }

    const creatorEmail = sessionStorage.getItem('userEmail');
    const questionWithMeta = {
      ...currentQuestion,
      id: Date.now(),
      ownerEmail: creatorEmail,
      type: currentQuestion.type === 'match' ? 'match-the-following' : currentQuestion.type,
      correctAnswer: finalCorrectAnswer,
      ...(currentQuestion.type === 'match' && {
        pairs: [...currentQuestion.options],
        correctAnswer: [...currentQuestion.options]
      })
    };

    setQuestions(prev => [...prev, questionWithMeta]);

    const subject = quizMeta.subject === 'Other' ? quizMeta.customSubject : quizMeta.subject;
    if (subject) {
      const existing = JSON.parse(localStorage.getItem(`questionBank_${subject}`)) || [];
      localStorage.setItem(`questionBank_${subject}`, JSON.stringify([...existing, questionWithMeta]));
    }

    setCurrentQuestion({ type: '', question: '', options: [], correctAnswer: '' });
    setQuestionType('');
  };
  // ===============================================================================

  const handleCreateQuiz = () => {
    const subjectFinal = quizMeta.subject === 'Other' ? quizMeta.customSubject : quizMeta.subject;
    if (
      quizMeta.title &&
      quizMeta.description &&
      subjectFinal &&
      quizMeta.timeLimit &&
      quizMeta.difficulty &&
      questions.length > 0
    ) {
      const updatedMeta = { ...quizMeta, subject: subjectFinal };

      localStorage.setItem('tempQuizMeta', JSON.stringify(updatedMeta));
      localStorage.setItem('tempQuestions', JSON.stringify(questions));

      localStorage.setItem('createdQuizMeta', JSON.stringify(updatedMeta));
      localStorage.setItem('createdQuizQuestions', JSON.stringify(questions));
      navigate('/preview-quiz');
    } else {
      alert('Please fill in all required fields and add at least one question.');
    }
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  };

  const handleOptionChange = (index, side, value) => {
    const updated = [...(currentQuestion.options || [])];
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
            <label className="form-label mt-3">Correct Answer</label>
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
            <label className="form-label mt-3">Pairs (Left & Right)</label>
            {(currentQuestion.options || []).map((pair, idx) => (
              <div className="row mb-2" key={idx}>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Left ${idx + 1}`}
                    value={pair.left || ''}
                    onChange={(e) => handleOptionChange(idx, 'left', e.target.value)}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Right ${idx + 1}`}
                    value={pair.right || ''}
                    onChange={(e) => handleOptionChange(idx, 'right', e.target.value)}
                    required
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                      const updated = [...(currentQuestion.options || [])];
                      updated.splice(idx, 1);
                      setCurrentQuestion({ ...currentQuestion, options: updated });
                    }}
                  >➖</button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary mb-3"
              onClick={() => {
                const updated = [...(currentQuestion.options || [])];
                updated.push({ left: '', right: '' });
                setCurrentQuestion({ ...currentQuestion, options: updated });
              }}
            >
              ➕ Add Pair
            </button>
            <h6 className="text-muted">Write correct pairs — they will shuffle later.</h6>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="position-relative d-flex flex-column" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}>
      
      <img src={pencil1} alt="Pencil" className="position-absolute" style={{ top: '19%', left: '0%', width: '205px', transform: 'rotate(118deg)', zIndex: 0 }} />
      <img src={trophy1} alt="Trophy" className="position-absolute" style={{ bottom: '0%', left: '1%', width: '205px', transform: 'rotate(7deg)', zIndex: 0 }} />
      <img src={question1} alt="Question" className="position-absolute" style={{ bottom: '1%', left: '92.5%', transform: 'translateX(-49%) rotate(-2deg)', width: '210px', zIndex: 0 }} />
      <img src={bulb1} alt="Bulb" className="position-absolute" style={{ bottom: '64%', right: '20%', width: '100px', transform: 'rotate(5deg)', zIndex: 0 }} />

      <div className="text-white px-4 pt-3 pb-4" style={{ background: 'linear-gradient(to right, #015794, #437FAA)', borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px', zIndex: 1 }}>
        <div className="container d-flex justify-content-between align-items-center">
          <img src={logo} alt="Logo" style={{ width: '140px' }} />
          <a href="/creator" className="text-white fw-bold">Dashboard</a>
        </div>
        <div className="text-center mt-2">
          <h1 className="fw-bold">Create a New Quiz</h1>
          <p className="lead">Fill out the form below to create your quiz</p>
        </div>
      </div>

      <div className="container-fluid my-5 px-5" style={{ position: 'relative', zIndex: 1 }}>
        <form onSubmit={(e) => e.preventDefault()}>
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
              <label className="form-label">Subject</label>
              <select className="form-select" name="subject" value={quizMeta.subject} onChange={handleMetaChange} required>
                <option value="">Select</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Computer">Computer</option>
                <option value="General Knowledge">General Knowledge</option>
                <option value="Current Affairs">Current Affairs</option>
                <option value="Other">Other (Add your own)</option>
              </select>
            </div>

            {quizMeta.subject === "Other" && (
              <div className="col-md-4 mb-3">
                <label className="form-label">Custom Subject</label>
                <input type="text" className="form-control" name="customSubject" value={quizMeta.customSubject || ''} onChange={handleMetaChange} required />
              </div>
            )}

            <div className="col-md-4 mb-3">
              <label className="form-label">Time Limit (minutes)</label>
              <input
                type="number"
                className="form-control"
                name="timeLimit"
                min="1"
                value={quizMeta.timeLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  if (parseInt(value) >= 1 || value === "") {
                    handleMetaChange(e);
                  }
                }}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Difficulty</label>
              <select className="form-select" name="difficulty" value={quizMeta.difficulty} onChange={handleMetaChange} required>
                <option value="">Select</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="col-md-4 mb-3 d-flex align-items-center">
              <input type="checkbox" className="form-check-input me-2" name="isCertificate" checked={quizMeta.isCertificate} onChange={handleMetaChange} />
              <label className="form-check-label">This quiz gives certificate on 100% score</label>
            </div>
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={useQuestionBank}
              onChange={() => {
                const newState = !useQuestionBank;
                setUseQuestionBank(newState);
                if (newState) {
                  localStorage.setItem('tempQuizMeta', JSON.stringify(quizMeta));
                  localStorage.setItem('tempQuestions', JSON.stringify(questions));
                  navigate('/question-bank');
                }
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
                <input type="text" className="form-control" value={currentQuestion.question} onChange={handleQuestionChange} placeholder="Enter your question" required />
              </div>

              {renderQuestionInputs()}
            </>
          )}

          <div className="text-center mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={handleAddQuestion} disabled={useQuestionBank}>Add Question</button>
            <button type="button" className="btn btn-success" onClick={handleCreateQuiz}>Create Quiz</button>
          </div>
        </form>
      </div>

      <footer className="text-center mt-auto py-3 text-muted">
        © 2025 QUIZZE. All rights reserved.
      </footer>
    </div>
  );
}
