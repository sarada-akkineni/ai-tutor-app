const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  const { topic, exam } = req.body;

  const prompt = `
You are an expert exam coach. Generate 5 multiple-choice questions for the topic "${topic}" suitable for ${exam} preparation.
For each question, provide:
- The question text
- 4 answer choices
- The correct answer (as the index)
- A brief explanation
- The real source of the question (e.g., 'IIT JEE Physics 2022', 'NEET 2021').
If you cannot find a real question, create a high-quality mock question and label the source as 'Mock question for ${exam}'.
Format your response as a JSON array with fields: question, choices, correctAnswer, explanation, source.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1200
    });

    // Parse the LLM's JSON output
    const quiz = JSON.parse(completion.choices[0].message.content);
    res.json({ questions: quiz });
  } catch (err) {
    console.error('Quiz generation error:', err);
    res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

module.exports = router; 