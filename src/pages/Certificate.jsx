// File: CertificatePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import logo from '../assets/logo1.png';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './CertificatePage.css';

export default function CertificatePage() {
  const navigate = useNavigate();
  const certRef = useRef(null);
  const [eligible, setEligible] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('');
  const [creatorName, setCreatorName] = useState('');

  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('finalQuizMeta')) || {};
    const answers = JSON.parse(localStorage.getItem('studentAnswers')) || {};
    const questions = JSON.parse(localStorage.getItem('finalQuizQuestions')) || [];

    const fullName =
      localStorage.getItem('userFullName') ||
      `${localStorage.getItem('firstName') || ''} ${localStorage.getItem('lastName') || ''}`.trim() ||
      'Anonymous';

    setStudentName(fullName);
    setSubject(meta.subject || 'N/A');
    setCreatorName(meta.creatorEmail || 'Quiz Creator');

    const normalize = str => (str || '').toString().trim().toLowerCase().replace(/\s+/g, '');
    const correctCount = questions.reduce((acc, q, idx) => {
      const userAns = answers[idx];
      if (!userAns) return acc;
      if (q.type === 'match') {
        const matched = q.options?.every((pair, i) => normalize(userAns[i]) === normalize(pair.right));
        return acc + (matched ? 1 : 0);
      } else {
        return acc + (normalize(userAns) === normalize(q.correctAnswer) ? 1 : 0);
      }
    }, 0);

    if (meta.isCertificate === true && correctCount === questions.length) {
      setEligible(true);
    }
  }, []);

  const handleDownload = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${studentName}_Certificate.pdf`);
  };

  if (!eligible) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
        <h2 className="text-danger fw-bold">❌ You are not eligible for a certificate.</h2>
      </div>
    );
  }

  return (
    <div className="certificate-container">
      <div ref={certRef} className="certificate-content shadow bg-white rounded border border-dark">
        <div className="text-center">
          <h1 className="cert-title">🎓 Certificate of Achievement</h1>
          <p className="cert-subtitle">This certificate is proudly presented to</p>
          <h2 className="cert-name">{studentName}</h2>
          <p className="cert-detail">for successfully scoring <strong>100%</strong> in the quiz on</p>
          <h3 className="cert-subject">{subject}</h3>
        </div>

        <div className="d-flex justify-content-between align-items-end mt-5 px-5">
          <div>
            <p className="cert-meta-label">Signed by</p>
            <p className="cert-meta-value">{creatorName}</p>
          </div>
          <img src={logo} alt="Logo" style={{ width: '90px', opacity: 0.9 }} />
          <div className="text-end">
            <p className="cert-meta-label">Date</p>
            <p className="cert-meta-value">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
        <button className="btn btn-primary fw-semibold" onClick={handleDownload}>📄 Download as PDF</button>
        <button className="btn btn-outline-dark" onClick={() => navigate('/creator')}>🔙 Back to Dashboard</button>
      </div>
    </div>
  );
}
