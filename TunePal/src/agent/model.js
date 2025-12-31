// model.js
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
require("dotenv").config();
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7,
});

module.exports = model;

