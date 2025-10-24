const express = require('express');
const musicRoutes = require('./routes/music.routes.js');
const cookierParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookierParser());
app.use(express.urlencoded({ extended: true })); // for file uploads also handle urlencoded data
app.use('/api/music', musicRoutes);

module.exports = app;