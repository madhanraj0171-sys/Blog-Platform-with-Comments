import { Request, Response } from 'express';
import { db } from '../db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const comments = db.getCommentsByPostId(id);
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err?.message });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Comment content cannot be empty' });
      return;
    }

    const post = db.getPostById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const newComment = db.createComment(postId, req.user!._id, content.trim());
    res.status(201).json(newComment);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to post comment', error: err?.message });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Comment content cannot be empty' });
      return;
    }

    const comment = db.getCommentById(commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const userId = typeof comment.user === 'object' ? comment.user._id : comment.user;
    if (userId !== req.user!._id) {
      res.status(403).json({ message: 'You can only edit your own comment' });
      return;
    }

    const updated = db.updateComment(commentId, content.trim());
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update comment', error: err?.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: commentId } = req.params;

    const comment = db.getCommentById(commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const userId = typeof comment.user === 'object' ? comment.user._id : comment.user;
    const isOwner = userId === req.user!._id;
    const isAdmin = req.user!.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'You are not authorized to delete this comment' });
      return;
    }

    db.deleteComment(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete comment', error: err?.message });
  }
};
