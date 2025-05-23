import expressAsyncHandler from 'express-async-handler';
import { isValid, encrypt } from '../lib/bcrypt';
import {
  createPasswordResetToken,
  createUser,
  deletePasswordResetToken,
  getPasswordResetTokenByHashedToken,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUser,
} from '../db/queries';
import { Request, Response } from 'express';
import { AppError } from '../error/errorHandler';
import { sendMail } from '../utils/nodemailer';
import {
  createResetToken,
  hashResetToken,
  signJWT,
  verifyJWT,
} from '../lib/token';

export const userSignUp = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    const existingUserByEmail = await getUserByEmail(normalizedEmail);
    const existingUserByUsername = await getUserByUsername(normalizedUsername);

    if (existingUserByEmail) {
      throw new AppError('Email already used. Please use another email.', 409);
    }

    if (existingUserByUsername) {
      throw new AppError(
        'Username already used. Please use another username.',
        409,
      );
    }

    const hashedPassword = await encrypt(password);

    const values = {
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    };

    const newUser = await createUser(values);

    const token = signJWT(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      60 * 15, // 15 minutes expiration
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendMail(
      'Verify Your Email',
      newUser.username || newUser.email,
      newUser.email,
      `Click the link to verify your account: ${verificationLink}`,
    );

    res.status(201).json({
      message:
        'Registration successful. Please check your email for a verification link',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  },
);

export const userLogin = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const isExistingUser = await getUserByEmail(email.toLowerCase());

    if (!isExistingUser) {
      throw new AppError('invalid credentials', 401);
    }

    if (isExistingUser.deletedAt) {
      throw new AppError('invalid credentials', 401);
    }

    if (!isExistingUser.password) {
      if (isExistingUser.googleId) {
        throw new AppError('Please login with Google.', 400);
      }
      throw new AppError('Invalid credentials', 401);
    }

    if (!isExistingUser.isVerified) {
      throw new AppError('Please verify your email before logging in.', 403);
    }

    const isValidPassword = await isValid(
      password.trim(),
      isExistingUser.password,
    );

    if (!isValidPassword) {
      throw new AppError('invalid credentials', 401);
    }

    const user = {
      id: isExistingUser.id,
      username: isExistingUser.username,
      email: isExistingUser.email,
    };

    const token = signJWT(
      user,
      60 * 30, // 30 minutes expiration
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user,
    });
  },
);

export const sendVerificationEmail = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existingUser = await getUserByEmail(normalizedEmail);

    if (!existingUser) {
      throw new AppError('Invalid credentials.', 401);
    }

    if (existingUser.deletedAt) {
      throw new AppError('Invalid credentials.', 401);
    }

    if (existingUser.isVerified) {
      throw new AppError('Invalid credentials.', 401);
    }

    const token = signJWT(
      {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      },
      60 * 15, // 15 minutes expiration
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-account?token=${token}`;

    await sendMail(
      'Verify Your Email',
      existingUser.username || existingUser.email,
      existingUser.email,
      `
      <div>
        <p>Hello ${existingUser.username || existingUser.email}</p>
        <p>Click the link to verify your account: ${verificationLink}</p>
      </div>
      `,
    );

    res.status(200).json({
      message:
        'Verification email sent successful. Please check your email for a verification link',
      email,
    });
  },
);

export const verifyEmail = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;

    if (typeof token !== 'string') {
      throw new AppError('Invalid token', 400);
    }

    const decoded = verifyJWT(token) as unknown as { id: string };

    const user = await getUserById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      res.status(200).json({ message: 'Email is already verified.' });
      return;
    }

    const values = { isVerified: true };

    await updateUser(user.id, values);

    res.status(200).json({ message: 'Email verified successfully.' });
  },
);

export const sendResetPasswordEmail = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existingUserByEmail = await getUserByEmail(normalizedEmail);

    if (!existingUserByEmail) {
      throw new AppError('Invalid credentials.', 409);
    }

    if (existingUserByEmail.deletedAt) {
      throw new AppError('Invalid credentials.', 409);
    }

    await deletePasswordResetToken(existingUserByEmail.id);

    const { token, hashedToken: tokenHash } = createResetToken();

    const values = {
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 15 * 1000),
      user: {
        connect: {
          id: existingUserByEmail.id,
        },
      },
    };
    await createPasswordResetToken(values);

    const verificationLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendMail(
      'Reset Your Password',
      existingUserByEmail.username || existingUserByEmail.email,
      existingUserByEmail.email,
      `
        <p>Hello ${existingUserByEmail.username},</p>
        <p>You requested to reset your password. Click the button below:</p>
        <p><a href="${verificationLink}" style="padding: 10px 15px; background: #007BFF; color: white; text-decoration: none;">Reset Password</a></p>
        <p>If you didn't request this, you can ignore this email.</p>

      `,
    );

    res.status(200).json({
      message: 'Password reset email sent successful. Please check your email',
    });
  },
);

export const resetPassword = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, password } = req.body;

    const hashedToken = hashResetToken(token);

    const existingToken = await getPasswordResetTokenByHashedToken(hashedToken);

    if (!existingToken) {
      throw new AppError('Reset token is invalid or has expired.', 400);
    }

    const hashedPassword = await encrypt(password);

    await updateUser(existingToken.userId, { password: hashedPassword });

    await deletePasswordResetToken(existingToken.userId);

    res.status(200).json({ message: 'Password reset successful.' });
  },
);
