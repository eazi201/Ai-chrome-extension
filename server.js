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
const API_URL = "https://api-inference.huggingface.co/models/gpt2"; // You can change this to other models

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
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data[0].generated_text;
    res.json({ answer });

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

app.listen(3000, () => {
  console.log('Backend server running on port 3000');
});