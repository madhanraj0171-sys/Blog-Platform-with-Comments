import { Router } from 'express';
import {
  getAllUsers,
  getAllPostsAdmin,
  deletePostAdmin,
  getAllCommentsAdmin,
  deleteCommentAdmin,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/posts', getAllPostsAdmin);
router.delete('/posts/:id', deletePostAdmin);
router.get('/comments', getAllCommentsAdmin);
router.delete('/comments/:id', deleteCommentAdmin);

export default router;
