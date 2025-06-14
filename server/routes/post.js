const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'instagram-clone' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Image upload failed' });

        const newPost = new Post({
          image: result.secure_url,
          caption: req.body.caption || '',
          user: req.user.id
        });

        await newPost.save();
        res.json(newPost);
      }
    );

    // Start upload
    req.file ? req.file.buffer.pipe(result) : res.status(400).json({ message: 'No image file uploaded' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get feed posts from users you follow (and your own posts)
router.get('/feed', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const posts = await Post.find({
      user: { $in: [...currentUser.following, currentUser.id] }
    })
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Like a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json({ message: 'Post liked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Unlike a post
router.post('/:id/unlike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    await post.save();

    res.json({ message: 'Post unliked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
