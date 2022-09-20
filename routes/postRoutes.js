const express = require('express');

const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const commentRouter = require('../routes/commentRoutes');

const app = express.Router();

app.use('/:postId/comments', commentRouter);

app.get('/', postController.getAllPosts);
app.get('/:id', postController.getPost);

app.use(authController.protect);

app.post('/', postController.createPost);
app.get('/:id/toggleUpvote', postController.toggleUpvote);
app.get('/:id/toggleDownvote', postController.toggleDownvote);

module.exports = app;
