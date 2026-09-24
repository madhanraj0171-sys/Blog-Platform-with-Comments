import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'writespace_super_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: 'user' | 'admin';
    name: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'user' | 'admin' };
    const user = db.findUserById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User not found or token invalid' });
      return;
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed or expired' });
    return;
  }
};
