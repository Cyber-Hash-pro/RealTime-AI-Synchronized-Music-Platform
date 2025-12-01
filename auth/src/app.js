const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes.js');
const cors = require('cors');
const passport = require('passport');
const {Strategy:GoogleStrategy}  = require('passport-google-oauth20');
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
require('dotenv').config();// always at top ise app me accesse me or sare me

app.use(cors({
  origin:["http://localhost:5173","http://localhost:5174",'http://10.66.177.241:5173/'], 
  credentials:true, 
  // withCredentials:true,
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