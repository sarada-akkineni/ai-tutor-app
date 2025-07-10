const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Store active sessions (in production, use a database)
const sessions = new Map();

// Generate learning hook and content
app.post('/api/generate-content', async (req, res) => {
  try {
    const { topic, studentLevel = 'beginner' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `Create an engaging learning experience for a ${studentLevel} student learning about ${topic}. 
    
    Respond in this exact JSON format:
    {
      "hook": {
        "title": "Engaging title",
        "description": "Real-world scenario or interesting fact that hooks the student",
        "question": "An intriguing question to spark curiosity"
      },
      "lesson": {
        "title": "Lesson title",
        "concepts": ["concept1", "concept2", "concept3"],
        "explanation": "Clear, step-by-step explanation using Khan Academy style teaching",
        "examples": [
          {
            "problem": "Example problem",
            "solution": "Step-by-step solution",
            "explanation": "Why this works"
          }
        ]
      },
      "quiz": {
        "questions": [
          {
            "question": "Multiple choice question",
            "options": ["A", "B", "C", "D"],
            "correct": "A",
            "explanation": "Why this is correct"
          }
        ]
      }
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator. Create engaging, age-appropriate content that follows best practices from Khan Academy and other top educational platforms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const content = JSON.parse(completion.choices[0].message.content);
    
    // Create session
    const sessionId = require('uuid').v4();
    sessions.set(sessionId, {
      topic,
      studentLevel,
      content,
      progress: 0,
      responses: [],
      createdAt: new Date()
    });

    res.json({
      sessionId,
      content
    });

  } catch (error) {
    console.error('Error generating content:', error);
    
    // More specific error messages
    if (error.code === 'ENOTFOUND') {
      res.status(500).json({ error: 'Network error - please check your internet connection' });
    } else if (error.status === 401) {
      res.status(500).json({ error: 'Invalid OpenAI API key - please check your configuration' });
    } else if (error.status === 429) {
      res.status(500).json({ error: 'OpenAI rate limit exceeded - please try again in a moment' });
    } else if (error.code === 'ECONNABORTED') {
      res.status(500).json({ error: 'Request timed out - please try again' });
    } else {
      res.status(500).json({ error: `Failed to generate content: ${error.message}` });
    }
  }
});

// Handle student dialogue and responses
app.post('/api/dialogue', async (req, res) => {
  try {
    const { sessionId, message, quizAnswer } = req.body;
    
    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessions.get(sessionId);
    session.responses.push({ message, quizAnswer, timestamp: new Date() });

    // Determine what the student is asking or responding to
    let context = '';
    if (quizAnswer !== undefined) {
      context = `The student answered a quiz question. Their answer was: ${quizAnswer}. Provide encouraging feedback and explain if they got it right or wrong.`;
    } else if (message) {
      context = `The student said: "${message}". Respond as a helpful tutor, asking follow-up questions to check understanding, providing additional explanations if needed, or moving to the next concept if they seem ready.`;
    }

    const prompt = `You are a patient, encouraging tutor helping a ${session.studentLevel} student learn about ${session.topic}. 
    
    Current lesson content: ${JSON.stringify(session.content.lesson)}
    
    ${context}
    
    Respond in a conversational, encouraging way. If the student seems confused, provide additional examples or explanations. If they seem to understand, ask a follow-up question to deepen their knowledge or move to the next concept.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a supportive, knowledgeable tutor. Be encouraging, patient, and adapt your explanations to the student's level. Use analogies and real-world examples when helpful."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const tutorResponse = completion.choices[0].message.content;

    res.json({
      response: tutorResponse,
      session: {
        topic: session.topic,
        progress: session.progress,
        responses: session.responses.length
      }
    });

  } catch (error) {
    console.error('Error in dialogue:', error);
    res.status(500).json({ error: 'Failed to process dialogue' });
  }
});

// Get session info
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const session = sessions.get(sessionId);
  res.json({
    topic: session.topic,
    studentLevel: session.studentLevel,
    progress: session.progress,
    responses: session.responses.length,
    createdAt: session.createdAt
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`AI Tutor Server running on port ${PORT}`);
}); 