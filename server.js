import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from 'dotenv';
dotenv.config();


// Initialise the express app
const app = express();
const port = 3005;
// Assign API key to variable
const apiKey = process.env.VITE_OPEN_AI_KEY;
// Initialise OpenAI API
const openai = new OpenAI({ apiKey: apiKey });
// Add CORS so that the API can be accessed from the frontend
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Check if the server is running
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Define the '/rachbot' route to handle questions from frontend 
app.post("/rachbot", async (req, res) => {
  // The 'question' variable is the user's input from the frontend
  const { question } = req.body;
  // Communicate with the OpenAI API to create our chatbot.
  // Store the chatbot's response in the 'response' variable
  const response = await openai.chat.completions.create({
    messages: [
      // We give the chatbot a role with some content to determine how it will behave
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      // We ask the chatbot to generate an answer based on the user's question
      // This question will come from the frontend
      {
        role: "user",
        content: question,
      },
    ],
    // Specify the model for the chatbot
    model: "gpt-3.5-turbo",
    // Add a value for max_tokens to ensure the response won't exceed 300 tokens
    // This is to make sure the responses aren't too long
    max_tokens: 300,
  });
  // Take the text response and display it on the server
  // Note: This will only work once frontend logic is setup
  res.send(response.choices[0].message.content);
});
