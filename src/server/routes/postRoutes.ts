import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import {
  getCommentsByPost,
  createComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Post routes
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Comments nested under post
router.get('/:id/comments', getCommentsByPost);
router.post('/:id/comments', protect, createComment);

export default router;
