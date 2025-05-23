import { Request, Response, NextFunction } from 'express';

export const addFilePathToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file && req.file.path) {
    req.body.avatar = req.file.path;
  }
  if (!req.file) {
    delete req.body.avatar;
  }
  next();
};
