const express = require('express');

const commentController = require('./../controllers/commentController');
const authController = require('./../controllers/authController');

const app = express.Router({ mergeParams: true });

app.get('/', commentController.getAllCommentsOfPost);
app.get('/:id', commentController.getComment);

app.use(authController.protect);

app.post('/', commentController.createComment);

module.exports = app;
