const fs = require('fs');
const fsPromises = require('fs/promises');

const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/posts.json`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/users.json`)
);

exports.getAllPosts = (req, res) => {
  // populate user property from post
  const populatedPosts = posts.map((post) => {
    const populatedPost = { ...post };
    populatedPost.user = users.find((user) => user.id === post.user);
    return populatedPost;
  });

  res.status(200).json({
    status: 'success',
    data: populatedPosts,
  });
};

exports.getPost = (req, res) => {
  const post = posts.find((post) => post.id === req.params.id);

  res.status(200).json({
    status: 'success',
    data: post,
  });
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!content) {
    return res.status(401).json({
      status: 'error',
      message: 'Post content is required.',
    });
  }

  if (!title) {
    return res.status(401).json({
      status: 'error',
      message: 'Post title is required.',
    });
  }

  const newPost = {
    id: (Math.random() * 10000).toString(36).substring(4),
    user: req.user?.id,
    title,
    content,
    upvotes: [],
    downvotes: [],
    comments: [],
  };

  posts.push(newPost);
  try {
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
    data: newPost,
  });
};

exports.toggleUpvote = async (req, res) => {
  let upvotedPost;

  posts.forEach((post) => {
    if (post.id === req.params.id) {
      if (post.upvotes.includes(req.user.id)) {
        post.upvotes = post.upvotes.filter((userId) => userId !== req.user.id);
      } else {
        post.upvotes.push(req.user.id);
        if (post.downvotes.includes(req.user.id)) {
          post.downvotes = post.downvotes.filter(
            (userId) => userId !== req.user.id
          );
        }
      }
      upvotedPost = post;
    }
  });

  try {
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

  res.status(200).json({
    status: 'success',
    data: upvotedPost,
  });
};

exports.toggleDownvote = async (req, res) => {
  let downvotedPost;
  posts.forEach((post) => {
    if (post.id === req.params.id) {
      if (post.downvotes.includes(req.user.id)) {
        post.downvotes = post.downvotes.filter(
          (userId) => userId !== req.user.id
        );
      } else {
        post.downvotes.push(req.user.id);
        if (post.upvotes.includes(req.user.id)) {
          post.upvotes = post.upvotes.filter(
            (userId) => userId !== req.user.id
          );
        }
      }
      downvotedPost = post;
    }
  });

  try {
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

  res.status(200).json({
    status: 'success',
    data: downvotedPost,
  });
};
