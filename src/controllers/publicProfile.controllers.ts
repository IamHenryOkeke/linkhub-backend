import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { AppError } from '../error/errorHandler';
import {
  getUserByUsername,
  getUserPublicProfileWithLinksByUsername,
} from '../db/queries';

export const getUserPublicProfile = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    const existingUser = await getUserByUsername(username);

    if (!existingUser || existingUser.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const user = await getUserPublicProfileWithLinksByUsername(username);

    res.status(200).json({
      message: 'User public profile fetched successfully',
      user,
    });
  },
);
