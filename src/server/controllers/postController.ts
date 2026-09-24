import { Request, Response } from 'express';
import { db } from '../db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, sort } = req.query;

    const posts = db.getPosts({
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      sort: sort === 'oldest' ? 'oldest' : 'newest',
    });

    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err?.message });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = db.getPostById(id);

    if (!post) {
      res.status(404).json({ message: 'Blog post not found' });
      return;
    }

    res.json(post);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch blog post', error: err?.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, content, image, category } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Blog title is required' });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Blog content is required' });
      return;
    }

    if (!category || !category.trim()) {
      res.status(400).json({ message: 'Category is required' });
      return;
    }

    const defaultImages: Record<string, string> = {
      Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      Programming: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      Education: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
      Travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
      Lifestyle: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
      Other: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
    };

    const finalImage = (image && image.trim()) || defaultImages[category] || defaultImages['Other'];

    const newPost = db.createPost({
      title: title.trim(),
      description: description ? description.trim() : title.trim().substring(0, 140) + '...',
      content: content.trim(),
      image: finalImage,
      category: category.trim(),
      author: req.user!._id,
    });

    res.status(201).json(newPost);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create post', error: err?.message });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, content, image, category } = req.body;

    const existingPost = db.getPostById(id);
    if (!existingPost) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const authorId = typeof existingPost.author === 'object' ? existingPost.author._id : existingPost.author;
    const isOwner = authorId === req.user!._id;
    const isAdmin = req.user!.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'You are not authorized to edit this post' });
      return;
    }

    if (title !== undefined && !title.trim()) {
      res.status(400).json({ message: 'Title cannot be empty' });
      return;
    }

    if (content !== undefined && !content.trim()) {
      res.status(400).json({ message: 'Content cannot be empty' });
      return;
    }

    const updated = db.updatePost(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(image !== undefined && { image: image.trim() }),
      ...(category !== undefined && { category: category.trim() }),
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update post', error: err?.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingPost = db.getPostById(id);
    if (!existingPost) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const authorId = typeof existingPost.author === 'object' ? existingPost.author._id : existingPost.author;
    const isOwner = authorId === req.user!._id;
    const isAdmin = req.user!.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'You are not authorized to delete this post' });
      return;
    }

    db.deletePost(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete post', error: err?.message });
  }
};

export const getUserPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = db.getPosts({ authorId: req.user!._id });
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch user posts', error: err?.message });
  }
};
