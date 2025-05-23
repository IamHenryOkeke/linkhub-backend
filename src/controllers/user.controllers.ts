import expressAsyncHandler from 'express-async-handler';
import {
  deleteUser,
  getUserById,
  getUserByUsername,
  updateUser,
} from '../db/queries';
import { Request, Response } from 'express';
import { AppError } from '../error/errorHandler';

export const getCurrentUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: string };

    const currentUser = await getUserById(user.id);

    if (!currentUser || currentUser.deletedAt) {
      throw new AppError("User doesn't exist", 404);
    }

    res.status(200).json({
      message: 'User fetched successfully',
      data: currentUser,
    });
  },
);

export const updateCurrentUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: string };
    const { name, username, bio, avatar } = req.body;

    const currentUser = await getUserById(user.id);

    if (!currentUser || currentUser.deletedAt) {
      throw new AppError("User doesn't exist", 404);
    }

    const normalizedUsername = username?.trim().toLowerCase();

    if (normalizedUsername && normalizedUsername !== currentUser.username) {
      const existingUser = await getUserByUsername(normalizedUsername);
      if (existingUser) {
        throw new AppError('Username is already taken', 400);
      }
    }

    const values = {
      ...(name && { name: name.trim() }),
      ...(normalizedUsername && { username: normalizedUsername }),
      ...(bio && { bio: bio.trim() }),
      ...(avatar && { avatar }),
    };

    if (Object.keys(values).length === 0) {
      throw new AppError('No fields provided for update', 400);
    }

    const updatedUser = await updateUser(user.id, values);

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  },
);

export const deleteCurrentUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: string };

    const currentUser = await getUserById(user.id);

    if (!currentUser || currentUser.deletedAt) {
      throw new AppError("User doesn't exist", 404);
    }

    const deletedUser = await deleteUser(user.id);

    res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser,
    });
  },
);
