import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Lightbulb } from 'lucide-react';
import axios from 'axios';
import './TopicSelection.css';

const examOptions = [
  { label: 'IIT JEE', value: 'IIT JEE' },
  { label: 'NEET', value: 'NEET' },
  { label: 'Board', value: 'Board' },
  { label: 'Olympiad', value: 'Olympiad' },
  { label: 'General', value: 'General' }
];

const TopicSelection = ({ onStartLearning }) => {
  const [topic, setTopic] = useState('');
  const [studentLevel, setStudentLevel] = useState('beginner');
  const [selectedExam, setSelectedExam] = useState('IIT JEE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const suggestedTopics = [
    'Algebra equations',
    'Photosynthesis',
    'World War II',
    'Python programming',
    'Shakespeare',
    'Climate change',
    'Fractions',
    'Electric circuits',
    'Spanish grammar',
    'Human anatomy'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/generate-content', {
        topic: topic.trim(),
        studentLevel
      });

      onStartLearning(response.data);
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate learning content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectTopic = (selectedTopic) => {
    setTopic(selectedTopic);
  };

  const handleTestPrep = async (e) => {
    e.preventDefault();
    setShowQuizModal(true);
    setQuizLoading(true);
    setQuizError('');
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    try {
      const response = await axios.post('/api/quiz', {
        topic: topic.trim(),
        exam: selectedExam
      });
      setQuizQuestions(response.data.questions);
    } catch (err) {
      setQuizError('Failed to fetch quiz questions. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizQuestions([]);
    setQuizError('');
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleCloseModal();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="topic-selection"
    >
      <div className="card">
        <div className="selection-header">
          <Lightbulb size={32} color="#667eea" />
          <h2>What would you like to learn today?</h2>
          <p>Choose a topic or type your own, and I'll create a personalized learning experience for you!</p>
        </div>

        <form onSubmit={handleSubmit} className="topic-form">
          <div className="input-group">
            <div className="input-wrapper">
              <Search size={20} color="#667eea" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Algebra equations, Photosynthesis, Python programming..."
                className="input topic-input"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="level-selection">
            <label>I'm a:</label>
            <div className="level-buttons">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`level-btn ${studentLevel === level ? 'active' : ''}`}
                  onClick={() => setStudentLevel(level)}
                  disabled={isLoading}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ margin: '18px 0 0 0' }}>
            <label htmlFor="exam-select" style={{ fontWeight: 500, color: '#333', marginRight: 10 }}>Target Exam:</label>
            <select
              id="exam-select"
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '2px solid #e1e5e9', fontWeight: 500, fontSize: '1rem', color: '#333', outline: 'none' }}
              disabled={isLoading}
            >
              {examOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              type="submit"
              className="btn start-btn"
              style={{ flex: 1, background: '#6c47e6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', padding: '12px 0', cursor: 'pointer', transition: 'background 0.2s' }}
              disabled={!topic.trim() || isLoading}
            >
              {isLoading ? (
                <div className="loading-btn">
                  <div className="spinner"></div>
                  <span>Creating your lesson...</span>
                </div>
              ) : (
                <span>Start Learning</span>
              )}
            </button>
            <button
              type="button"
              className="btn testme-btn"
              style={{ flex: 1, background: '#6c47e6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', padding: '12px 0', cursor: 'pointer', transition: 'background 0.2s' }}
              disabled={!topic.trim() || isLoading}
              onClick={handleTestPrep}
            >
              Test Prep
            </button>
          </div>
        </form>

        <div className="suggested-topics">
          <h3>Popular topics to get you started:</h3>
          <div className="topic-grid">
            {suggestedTopics.map((suggestedTopic) => (
              <motion.button
                key={suggestedTopic}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="topic-chip"
                onClick={() => selectTopic(suggestedTopic)}
                disabled={isLoading}
              >
                {suggestedTopic}
              </motion.button>
            ))}
          </div>
        </div>
        {showQuizModal && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ background: '#fff', borderRadius: '10px', padding: '32px', minWidth: '320px', maxWidth: '90vw', boxShadow: '0 8px 32px rgba(44, 0, 128, 0.15)' }}>
              {quizLoading ? (
                <div style={{ textAlign: 'center', color: '#6c47e6', fontWeight: 600, fontSize: '1.2rem' }}>Loading quiz...</div>
              ) : quizError ? (
                <div style={{ color: 'red', fontWeight: 500 }}>{quizError}</div>
              ) : quizQuestions.length > 0 ? (
                <>
                  <div style={{ color: '#888', fontWeight: 400, fontSize: '0.95em', marginBottom: '8px' }}>
                    Source: {quizQuestions[currentQuestion].source}
                  </div>
                  <h2 style={{ marginBottom: '16px', color: '#6c47e6' }}>Quiz: {topic}</h2>
                  <div style={{ marginBottom: '16px', fontWeight: 500 }}>
                    {quizQuestions[currentQuestion].question}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {quizQuestions[currentQuestion].choices.map((choice, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        style={{
                          padding: '10px',
                          borderRadius: '6px',
                          border: selectedAnswer === idx ? '2px solid #6c47e6' : '1px solid #ccc',
                          background: selectedAnswer === idx ? '#f3f0ff' : '#fff',
                          color: '#222',
                          cursor: selectedAnswer === null ? 'pointer' : 'default',
                          fontWeight: 500
                        }}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                  {showExplanation && (
                    <div style={{ marginBottom: '16px', color: selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? 'green' : 'red', fontWeight: 600 }}>
                      {selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? 'Correct!' : 'Incorrect.'}
                      <div style={{ color: '#333', fontWeight: 400, marginTop: '4px' }}>{quizQuestions[currentQuestion].explanation}</div>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={handleCloseModal} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#eee', color: '#333', fontWeight: 500, cursor: 'pointer' }}>Close</button>
                    {showExplanation && (
                      <button onClick={handleNext} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#6c47e6', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>
                        {currentQuestion < quizQuestions.length - 1 ? 'Next' : 'Finish'}
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopicSelection; 