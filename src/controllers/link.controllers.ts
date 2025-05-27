import expressAsyncHandler from 'express-async-handler';
import {
  createLink,
  getAllUserLinks,
  getUserLinkByUniqueUrl,
  getUserById,
  getUserLinkById,
  updateUserLink,
  deleteUserLink,
} from '../db/queries';
import { Request, Response } from 'express';
import { AppError } from '../error/errorHandler';
import createUniqueShortCode from '../lib/short-code';

export const getCurrentUserLinks = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user as { id: string };

    const user = await getUserById(id);

    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const links = await getAllUserLinks(id);

    res.status(200).json({
      message: 'Links fetched successfully',
      data: {
        links,
      },
    });
  },
);

export const getCurrentUserLinkByLinkId = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.user as { id: string };
    const { linkId } = req.params;

    const user = await getUserById(userId);

    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const link = await getUserLinkById(linkId, user.id);

    if (!link) {
      throw new AppError('Link not found', 404);
    }

    res.status(200).json({
      message: 'Link fetched successfully',
      data: {
        link,
      },
    });
  },
);

export const createUserLink = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user as { id: string };

    const user = await getUserById(id);

    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const { title, description, url, imageUrl } = req.body;

    const existingLink = await getUserLinkByUniqueUrl(id, url);

    if (existingLink) {
      throw new AppError('You already added this link', 400);
    }

    const shortCode = await createUniqueShortCode();

    const values = {
      title,
      description,
      url,
      ...(imageUrl && { imageUrl }),
      shortCode,
      user: {
        connect: {
          id,
        },
      },
    };

    const link = await createLink(values);

    res.status(201).json({
      message: 'Link created successfully',
      data: {
        link,
      },
    });
  },
);

export const updateCurrentUserLink = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.user as { id: string };
    const { linkId } = req.params;

    const user = await getUserById(userId);

    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const link = await getUserLinkById(linkId, user.id);

    if (!link) {
      throw new AppError('Link not found', 404);
    }

    const { title, description, url, imageUrl, isActive } = req.body;

    if (url && url !== link.url) {
      const existing = await getUserLinkByUniqueUrl(userId, url);

      if (existing && existing.id !== link.id) {
        throw new AppError('You already have a link with this URL', 400);
      }
    }

    const values = {
      ...(title && { title }),
      ...(description && { description }),
      ...(url && { url }),
      ...(isActive && { isActive }),
      ...(imageUrl && { imageUrl }),
    };

    const updatedLink = await updateUserLink(linkId, userId, values);

    res.status(201).json({
      message: 'Link updated successfully',
      data: {
        updatedLink,
      },
    });
  },
);

export const deleteCurrentUserLink = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.user as { id: string };
    const { linkId } = req.params;

    const user = await getUserById(userId);

    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const link = await getUserLinkById(linkId, user.id);

    if (!link) {
      throw new AppError('Link not found', 404);
    }

    const deletedLink = await deleteUserLink(linkId, userId);

    res.status(201).json({
      message: 'Link deleted successfully',
      data: {
        deletedLink,
      },
    });
  },
);
