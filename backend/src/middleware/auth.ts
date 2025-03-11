import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { CustomRequest } from '../types';

export const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
      
      const user = await User.findById(decoded.id).select('-password').lean();
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      
      req.user = user as IUser;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

export const admin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

export const vendor = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as vendor' });
  }
}; 