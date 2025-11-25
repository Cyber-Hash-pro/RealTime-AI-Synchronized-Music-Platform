const express = require('express');
const musicRoutes = require('./routes/music.routes.js');
const cookierParser = require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cookierParser()); // it help to send and receive cookies important
app.use(express.urlencoded({ extended: true })); // for file uploads also handle urlencoded data
app.use(cors(
{
    origin: ['http://localhost:5173','http://localhost:5174'],
    credentials: true,
}
));
app.use('/api/music', musicRoutes);

module.exports = app;