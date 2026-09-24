import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Admin error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Admin error fetching posts:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });

    res.json({ message: 'Post and comments deleted by admin' });
  } catch (error) {
    console.error('Admin error deleting post:', error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'name email')
      .populate('post', 'title')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Admin error fetching comments:', error);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted by admin' });
  } catch (error) {
    console.error('Admin error deleting comment:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};
