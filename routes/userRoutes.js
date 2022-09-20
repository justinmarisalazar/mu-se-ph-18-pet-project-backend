const express = require('express');

const authController = require('../controllers/authController');

const app = express.Router();

app.post('/login', authController.login);

module.exports = app;
