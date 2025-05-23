import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { AppError } from '../error/errorHandler';
import {
  getUserPublicLinkWithLinksByLinkId,
  updateUserPublicLinkWithLinksByLinkId,
} from '../db/queries';

export const getUserPublicLink = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { linkId } = req.params;

    const existingLink = await getUserPublicLinkWithLinksByLinkId(linkId);

    if (!existingLink || !existingLink.isActive) {
      throw new AppError('Link not found', 404);
    }

    const updatedLink = await updateUserPublicLinkWithLinksByLinkId(linkId);

    res.redirect(301, updatedLink.url);
  },
);
