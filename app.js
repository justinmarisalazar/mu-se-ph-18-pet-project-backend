const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
