const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes.js');
const cors = require('cors');
const passport = require('passport');
const {Strategy:GoogleStrategy}  = require('passport-google-oauth20');
app.use(express.json());
app.use(cookieParser()); //Request ke aane se pehle, cookies ko decode karke req.cookies me daal dena
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true, // its important to allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));
app.get('/', (req, res) => {
    res.send('Authentication Service is running');
});


app.use('/api/auth', authRouter);




module.exports = app;