import { Request, Response } from 'express';
import { db } from '../db.js';

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = db.getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch users', error: err?.message });
  }
};

export const getAllPostsAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = db.getPosts({ sort: 'newest' });
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err?.message });
  }
};

export const deletePostAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = db.getPostById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    db.deletePost(id);
    res.json({ message: 'Post removed by admin' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete post', error: err?.message });
  }
};

export const getAllCommentsAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const comments = db.getAllComments();
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err?.message });
  }
};

export const deleteCommentAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = db.getCommentById(id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    db.deleteComment(id);
    res.json({ message: 'Comment removed by admin' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete comment', error: err?.message });
  }
};
