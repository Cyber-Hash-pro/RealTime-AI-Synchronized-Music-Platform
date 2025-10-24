const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
  },
});

// Verify the connection configuration
console.log(process.env.EMAIL_USER);
console.log(process.env.CLIENT_ID);
console.log(process.env.CLIENT_SECRET);
console.log(process.env.REFRESH_TOKEN_SECRET);
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Transporter   kya hota hae suno? 
// jo app server create kart ho ye server hae apke web server  jise par app express create karta hae
//lakin jo email send karte hae wo server hote hae smtp server jise email server bhi bolte hae
// to unko use karne ke liye hume ek transporter create karna padta hae
// transporter karta kya hae web server aur email server ke beech ek bridge ka kaam karta hae
// send mail 

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"MusicPlayer" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// sendEmail('cyberrebel79@gmail.com', 'Test Subject', 'Test Text', '<b>Test HTML</b>');
module.exports = sendEmail;