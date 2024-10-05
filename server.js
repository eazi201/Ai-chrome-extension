require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'chrome-extension://admbajjbphemkmghbfhphkechjjhgblf',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
// Changed to a question-answering model
const API_URL = "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2";

app.get('/', (req, res) => {
  res.json({ message: "Server is running. Use POST to interact with the AI." });
});

app.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required in the request body' });
  }

  try {
    const response = await axios.post(API_URL, 
      { 
        inputs: {
          question: text,
          context: "This is a question answering system. Please provide a concise and accurate answer based on the given question."
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.answer) {
      res.json({ answer: response.data.answer });
    } else {
      res.status(500).json({ error: 'Unexpected response format from AI service' });
    }

  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch AI response. Please try again.' });
    }
  }
});

app.listen(3000, () => {
  console.log('Backend server running on port 3000');
});