# AI Tutor App 🧠

An intelligent, interactive learning platform that creates personalized educational experiences using AI. The app generates engaging hooks, provides Khan Academy-style lessons, interactive quizzes, and adaptive dialogue to help students learn any topic.

## ✨ Features

### 🎯 Engaging Learning Hooks
- Real-world applications and scenarios
- Thought-provoking questions to spark curiosity
- Personalized content based on student level

### 📚 Khan Academy-Style Lessons
- Clear, step-by-step explanations
- Key concepts breakdown
- Practical examples with detailed solutions
- Visual and interactive content

### 🧪 Interactive Quizzes
- Multiple choice questions
- Immediate feedback with explanations
- Adaptive difficulty based on student responses

### 💬 Intelligent Dialogue System
- Natural conversation with AI tutor
- Follow-up questions to check understanding
- Additional explanations when needed
- Progress tracking and personalized guidance

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-tutor-app.git
   cd ai-tutor-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit `server/.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 3001) and frontend (port 3000).

5. **Open your browser**
   Navigate to `http://localhost:3000` to start learning!

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Content Generation**: AI-powered lesson creation
- **Dialogue Management**: Interactive conversation handling
- **Session Management**: Student progress tracking
- **API Endpoints**: RESTful API for frontend communication

### Frontend (React)
- **Modern UI**: Beautiful, responsive design with animations
- **Interactive Components**: Step-by-step learning flow
- **Real-time Updates**: Live dialogue and progress tracking
- **Mobile Responsive**: Works on all devices

### AI Integration
- **OpenAI GPT-4**: Content generation and dialogue
- **Structured Prompts**: Consistent, high-quality educational content
- **Adaptive Responses**: Personalized learning experience

## 📖 How It Works

### 1. Topic Selection
Students choose what they want to learn from suggested topics or enter their own. They can also select their learning level (beginner, intermediate, advanced).

### 2. Content Generation
The AI creates a complete learning experience including:
- **Hook**: Engaging introduction with real-world context
- **Lesson**: Structured content with concepts, explanations, and examples
- **Quiz**: Interactive questions to test understanding

### 3. Interactive Learning
Students progress through:
1. **Hook**: Read and think about the engaging introduction
2. **Lesson**: Learn the concepts with examples
3. **Quiz**: Test understanding with immediate feedback
4. **Dialogue**: Ask questions and discuss with the AI tutor

### 4. Adaptive Dialogue
The AI tutor:
- Responds to student questions
- Provides additional explanations when needed
- Asks follow-up questions to check understanding
- Adapts the conversation based on student responses

## 🎨 Example Learning Flow

**Topic**: "Algebra Equations"

1. **Hook**: "Imagine you're planning a party and need to figure out how many pizzas to order. If each pizza costs $12 and you have $60, how many can you buy? This is exactly what algebra equations help us solve!"

2. **Lesson**: 
   - Key concepts: Variables, equations, solving for x
   - Step-by-step explanation with visual examples
   - Real-world applications

3. **Quiz**: "If 3x + 5 = 20, what is x?"
   - Multiple choice options with explanations

4. **Dialogue**: "Can you explain why we subtract 5 from both sides?" → AI provides detailed explanation

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Server port (default: 3001)

### Customization
- Modify prompts in `server/index.js` for different teaching styles
- Adjust UI components in `client/src/components/`
- Add new topics to the suggested list in `TopicSelection.js`

## 🛠️ Development

### Project Structure
```
ai-tutor-app/
├── server/                 # Backend API
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # App entry point
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

### Available Scripts
- `npm run dev`: Start both frontend and backend in development
- `npm run server`: Start only the backend server
- `npm run client`: Start only the frontend
- `npm run build`: Build the frontend for production
- `npm run install-all`: Install dependencies for all packages

## 🚀 Deployment

### Backend Deployment
1. Set up a Node.js server (Heroku, DigitalOcean, AWS, etc.)
2. Set environment variables
3. Deploy the `server/` directory

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `client/build/` directory to a static hosting service
3. Update the API endpoint in the frontend to point to your deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check that your OpenAI API key is valid
2. Ensure all dependencies are installed
3. Check the browser console and server logs for errors
4. Open an issue with detailed error information

## 🎯 Future Enhancements

- [ ] User accounts and progress tracking
- [ ] Multiple learning paths and difficulty levels
- [ ] Voice interaction capabilities
- [ ] Integration with external educational resources
- [ ] Analytics and learning insights
- [ ] Collaborative learning features
- [ ] Offline mode support
- [ ] Video integration (YouTube/Khan Academy)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ai-tutor-app&type=Date)](https://star-history.com/#yourusername/ai-tutor-app&Date)

---

**Happy Learning! 🎓**

Made with ❤️ by [Your Name] 