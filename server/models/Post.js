const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth'); // your JWT auth middleware

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// GET all posts (feed)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email')       // populate user info
      .populate('comments.user', 'name')    // populate commenters' names
      .sort({ createdAt: -1 });              // newest first
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

// POST create new post
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const post = new Post({
      user: req.user.id,
      caption,
      image: imageUrl,      // matches your Post schema field 'image'
    });

    await post.save();

    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

module.exports = router;
