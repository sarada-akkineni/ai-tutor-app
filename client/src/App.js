import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MessageCircle, Brain, Sparkles } from 'lucide-react';
import TopicSelection from './components/TopicSelection';
import LearningSession from './components/LearningSession';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [sessionData, setSessionData] = useState(null);

  const startLearning = (sessionData) => {
    setSessionData(sessionData);
    setCurrentView('learning');
  };

  const goBack = () => {
    setCurrentView('welcome');
    setSessionData(null);
  };

  return (
    <div className="App">
      <div className="container">
        {currentView === 'welcome' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="welcome-screen"
          >
            <div className="hero-section">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hero-icon"
              >
                <Brain size={80} color="#667eea" />
              </motion.div>
              
              <h1 className="hero-title">
                Welcome to <span className="gradient-text">AI Tutor</span>
              </h1>
              
              <p className="hero-subtitle">
                Your personal learning companion that adapts to your style
              </p>
              
              <div className="features">
                <div className="feature">
                  <Sparkles size={24} color="#667eea" />
                  <span>Engaging Hooks & Real-world Examples</span>
                </div>
                <div className="feature">
                  <BookOpen size={24} color="#667eea" />
                  <span>Khan Academy Style Learning</span>
                </div>
                <div className="feature">
                  <MessageCircle size={24} color="#667eea" />
                  <span>Interactive Dialogue & Feedback</span>
                </div>
              </div>
            </div>

            <TopicSelection onStartLearning={startLearning} />
          </motion.div>
        )}

        {currentView === 'learning' && sessionData && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LearningSession 
              sessionData={sessionData} 
              onGoBack={goBack}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App; 