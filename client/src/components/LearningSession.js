import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './LearningSession.css';

const LearningSession = ({ sessionData, onGoBack }) => {
  const [currentStep, setCurrentStep] = useState('hook');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [dialogueMessage, setDialogueMessage] = useState('');
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { sessionId, content } = sessionData;

  const steps = ['hook', 'lesson', 'quiz', 'dialogue'];

  const handleNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleQuizAnswer = (answer) => {
    setSelectedQuizAnswer(answer);
    setShowQuizResult(true);
  };

  const handleQuizSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/dialogue', {
        sessionId,
        quizAnswer: selectedQuizAnswer
      });

      setDialogueHistory(prev => [...prev, {
        type: 'quiz',
        content: `I answered: ${selectedQuizAnswer}`,
        timestamp: new Date()
      }, {
        type: 'tutor',
        content: response.data.response,
        timestamp: new Date()
      }]);

      setCurrentStep('dialogue');
      setShowQuizResult(false);
      setSelectedQuizAnswer(null);
    } catch (err) {
      console.error('Error submitting quiz answer:', err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogueSubmit = async (e) => {
    e.preventDefault();
    if (!dialogueMessage.trim()) return;

    const userMessage = dialogueMessage.trim();
    setDialogueMessage('');
    setIsLoading(true);
    setError('');

    // Add user message to history
    setDialogueHistory(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response = await axios.post('/api/dialogue', {
        sessionId,
        message: userMessage
      });

      setDialogueHistory(prev => [...prev, {
        type: 'tutor',
        content: response.data.response,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Error in dialogue:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHook = () => (
    <motion.div
      key="hook"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="learning-step"
    >
      <div className="card hook-card">
        <div className="step-header">
          <h2>{content.hook.title}</h2>
          <div className="step-indicator">Step 1 of 4</div>
        </div>
        
        <div className="hook-content">
          <div className="hook-description">
            <ReactMarkdown>{content.hook.description}</ReactMarkdown>
          </div>
          
          <div className="hook-question">
            <h3>🤔 Think about this:</h3>
            <p>{content.hook.question}</p>
          </div>
        </div>

        <button className="btn next-btn" onClick={handleNextStep}>
          Continue to Lesson
        </button>
      </div>
    </motion.div>
  );

  const renderLesson = () => (
    <motion.div
      key="lesson"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="learning-step"
    >
      <div className="card lesson-card">
        <div className="step-header">
          <h2>{content.lesson.title}</h2>
          <div className="step-indicator">Step 2 of 4</div>
        </div>

        <div className="lesson-content">
          <div className="concepts">
            <h3>Key Concepts:</h3>
            <ul>
              {content.lesson.concepts.map((concept, index) => (
                <li key={index}>{concept}</li>
              ))}
            </ul>
          </div>

          <div className="explanation">
            <h3>Explanation:</h3>
            <ReactMarkdown>{content.lesson.explanation}</ReactMarkdown>
          </div>

          {content.lesson.examples && content.lesson.examples.length > 0 && (
            <div className="examples">
              <h3>Examples:</h3>
              {content.lesson.examples.map((example, index) => (
                <div key={index} className="example">
                  <h4>Example {index + 1}:</h4>
                  <p><strong>Problem:</strong> {example.problem}</p>
                  <p><strong>Solution:</strong> {example.solution}</p>
                  <p><strong>Why this works:</strong> {example.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn next-btn" onClick={handleNextStep}>
          Take the Quiz
        </button>
      </div>
    </motion.div>
  );

  const renderQuiz = () => (
    <motion.div
      key="quiz"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="learning-step"
    >
      <div className="card quiz-card">
        <div className="step-header">
          <h2>Let's Test Your Understanding</h2>
          <div className="step-indicator">Step 3 of 4</div>
        </div>

        {content.quiz.questions.map((question, index) => (
          <div key={index} className="quiz-question">
            <h3>Question {index + 1}:</h3>
            <p>{question.question}</p>
            
            <div className="quiz-options">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`quiz-option ${selectedQuizAnswer === option ? 'selected' : ''}`}
                  onClick={() => handleQuizAnswer(option)}
                  disabled={showQuizResult}
                >
                  {option}
                </button>
              ))}
            </div>

            {showQuizResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="quiz-result"
              >
                <div className={`result-indicator ${selectedQuizAnswer === question.correct ? 'correct' : 'incorrect'}`}>
                  {selectedQuizAnswer === question.correct ? (
                    <CheckCircle size={24} color="#10b981" />
                  ) : (
                    <XCircle size={24} color="#ef4444" />
                  )}
                  <span>
                    {selectedQuizAnswer === question.correct ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <div className="explanation">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </motion.div>
            )}
          </div>
        ))}

        {selectedQuizAnswer && !showQuizResult && (
          <button className="btn submit-btn" onClick={handleQuizSubmit}>
            Submit Answer
          </button>
        )}

        {showQuizResult && (
          <button className="btn next-btn" onClick={handleNextStep}>
            Continue to Discussion
          </button>
        )}
      </div>
    </motion.div>
  );

  const renderDialogue = () => (
    <motion.div
      key="dialogue"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="learning-step"
    >
      <div className="card dialogue-card">
        <div className="step-header">
          <h2>Let's Discuss!</h2>
          <div className="step-indicator">Step 4 of 4</div>
        </div>

        <div className="dialogue-container">
          <div className="dialogue-messages">
            {dialogueHistory.length === 0 && (
              <div className="welcome-message">
                <MessageCircle size={48} color="#667eea" />
                <h3>Great job completing the lesson!</h3>
                <p>Ask me anything about what you just learned, or let's explore the topic further together.</p>
              </div>
            )}

            {dialogueHistory.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`message ${message.type}`}
              >
                <div className="message-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="message tutor">
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleDialogueSubmit} className="dialogue-input">
            <input
              type="text"
              value={dialogueMessage}
              onChange={(e) => setDialogueMessage(e.target.value)}
              placeholder="Ask a question or share your thoughts..."
              className="input"
              disabled={isLoading}
            />
            <button type="submit" className="btn send-btn" disabled={!dialogueMessage.trim() || isLoading}>
              <Send size={20} />
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="learning-session">
      <div className="session-header">
        <button className="back-btn" onClick={onGoBack}>
          <ArrowLeft size={20} />
          Back to Topics
        </button>
        <h1>Learning: {content.lesson.title}</h1>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 'hook' && renderHook()}
        {currentStep === 'lesson' && renderLesson()}
        {currentStep === 'quiz' && renderQuiz()}
        {currentStep === 'dialogue' && renderDialogue()}
      </AnimatePresence>
    </div>
  );
};

export default LearningSession; 