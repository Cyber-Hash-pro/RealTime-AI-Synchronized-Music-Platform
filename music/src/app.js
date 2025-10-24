const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for file uploads also handle urlencoded data


module.exports = app;