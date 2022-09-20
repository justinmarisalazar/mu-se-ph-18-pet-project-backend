const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const fs = require('fs');
const fsPromises = require('fs/promises');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/users.json`)
);

const signToken = (id) =>
  jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // stores the refresh token in a cookie
  res.cookie('jwt', token, {
    expires: null,
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};

exports.login = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(401).json({
      status: 'error',
      message: 'Username is required.',
    });
  }

  let user = users.find((user) => user.username === username);
  if (!user) {
    const newUser = {
      id: (Math.random() * 10000).toString(36).substring(4),
      username: req.body.username,
    };
    users.push(newUser);
    try {
      await fsPromises.writeFile(
        `${__dirname}/../dev-data/users.json`,
        JSON.stringify(users)
      );
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Cannot save file. Try again later.',
      });
    }
    user = newUser;
  }

  createSendToken(user, 200, res);
};

exports.protect = async (req, res, next) => {
  let token;

  // checks if authorization header or jwt cookie exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in.',
    });
  }

  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token.',
    });
  }

  const currentUser = users.find((user) => user.id === decoded.id);

  // stores the user in the request
  req.user = currentUser;
  next();
};
