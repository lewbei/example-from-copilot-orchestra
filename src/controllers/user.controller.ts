import { Request, Response } from 'express';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by the authenticate middleware
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: {
        userId: req.user.userId,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
