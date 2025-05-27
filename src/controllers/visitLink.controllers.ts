import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { AppError } from '../error/errorHandler';
import {
  getUserPublicLinkByShortCode,
  updateUserPublicLinkByLinkId,
} from '../db/queries';

export const getUserPublicLink = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { shortCode } = req.params;

    const existingLink = await getUserPublicLinkByShortCode(shortCode);

    if (!existingLink || !existingLink.isActive) {
      throw new AppError('Link not found', 404);
    }

    const updatedLink = await updateUserPublicLinkByLinkId(existingLink.id);

    res.redirect(301, updatedLink.url);
  },
);
