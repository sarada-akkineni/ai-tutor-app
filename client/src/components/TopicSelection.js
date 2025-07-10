import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Lightbulb } from 'lucide-react';
import axios from 'axios';
import './TopicSelection.css';

const TopicSelection = ({ onStartLearning }) => {
  const [topic, setTopic] = useState('');
  const [studentLevel, setStudentLevel] = useState('beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="btn start-btn"
            disabled={!topic.trim() || isLoading}
          >
            {isLoading ? (
              <div className="loading-btn">
                <div className="spinner"></div>
                <span>Creating your lesson...</span>
              </div>
            ) : (
              <>
                <span>Start Learning</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
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
      </div>
    </motion.div>
  );
};

export default TopicSelection; 