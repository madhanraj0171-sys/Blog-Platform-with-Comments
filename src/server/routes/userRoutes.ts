import { Router } from 'express';
import { getUserPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile/posts', protect, getUserPosts);

export default router;
