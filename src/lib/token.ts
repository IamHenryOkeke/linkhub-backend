import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AppError } from '../error/errorHandler';

export const signJWT = (payload: object, expiresAt: number): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresAt,
  });
  return token;
};

export const verifyJWT = <T>(token: string): T | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as T;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        'Reset link has expired. Please request a new one.',
        401,
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid reset token.', 400);
    } else {
      throw new AppError('Could not verify token.', 500);
    }
  }
};

export const createResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
};

export const hashResetToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
