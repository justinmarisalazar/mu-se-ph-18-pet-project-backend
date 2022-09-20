const fs = require('fs');
const fsPromises = require('fs/promises');

const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/comments.json`)
);
const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/posts.json`)
);

exports.getAllCommentsOfPost = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: comments.filter((comment) => comment.post === req.params.id),
  });
};

exports.getComment = (req, res) => {
  const currentComment = comments.find(
    (comment) => comment.id === req.params.commentId
  );

  if (!currentComment) {
    return res.status(404).json({
      status: 'error',
      message: 'No comment found with that id.',
    });
  }

  res.status(200).json({
    status: 'success',
    data: currentComment,
  });
};

exports.createComment = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(401).json({
      status: 'error',
      message: 'Comment content is required.',
    });
  }

  const targetPost = posts.find((post) => post.id === req.params.postId);
  if (!targetPost) {
    return res.status(404).json({
      status: 'success',
      message: 'No post exists from this id.',
    });
  }

  const newComment = {
    id: (Math.random() * 10000).toString(36).substring(4),
    content,
    user: req.user,
    post: req.params.postId,
  };

  comments.push(newComment);
  posts.forEach((post) => {
    if (post.id === req.params.postId) {
      post.comments.push(newComment);
    }
  });

  try {
    await fsPromises.writeFile(
      `${__dirname}/../dev-data/comments.json`,
      JSON.stringify(comments)
    );
    await fsPromises.writeFile(
      `${__dirname}/../dev-data/posts.json`,
      JSON.stringify(posts)
    );
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Cannot save file. Try again later.',
    });
  }

  res.status(201).json({
    status: 'success',
    data: newComment,
  });
};
