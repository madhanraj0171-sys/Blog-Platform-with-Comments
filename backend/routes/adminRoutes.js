import express from 'express';
import {
  getAllUsers,
  getAllPosts,
  deletePost,
  getAllComments,
  deleteComment,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/posts', getAllPosts);
router.delete('/posts/:id', deletePost);
router.get('/comments', getAllComments);
router.delete('/comments/:id', deleteComment);

export default router;
