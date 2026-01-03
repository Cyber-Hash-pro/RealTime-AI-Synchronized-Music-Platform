const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const Messages = require('./model/chat.model.js');
const cookieParser = require('cookie-parser');

app.use(cookieParser()); // that read the  cookies from request

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

app.get('/api/agent/userchat', async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    const chat = await Messages.find({ userId: req.user.id }).lean().sort({ createdAt: 1 });

    return res.json({
      user: req.user,
      chat,
    });

  } catch (error) {
    console.log("AUTH ERROR:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = app;