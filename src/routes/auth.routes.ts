import { Router } from 'express';
import { validate } from '../middlewares/validation';
import {
  createUserSchema,
  loginUserSchema,
  resetPassswordSchema,
  sendVerificationLinkSchema,
  verifyAccountQuerySchema,
} from '../utils/schemas';
import {
  resetPassword,
  sendResetPasswordEmail,
  sendVerificationEmail,
  userLogin,
  userSignUp,
  verifyEmail,
} from '../controllers/auth.controllers';
import passport from 'passport';
import { signJWT } from '../lib/token';

const authRouter = Router();

authRouter.post('/sign-up', validate({ body: createUserSchema }), userSignUp);
authRouter.get(
  '/verify-account',
  validate({ query: verifyAccountQuerySchema }),
  verifyEmail,
);
authRouter.post(
  '/request-verification-link',
  validate({ body: sendVerificationLinkSchema }),
  sendVerificationEmail,
);

authRouter.post('/login', validate({ body: loginUserSchema }), userLogin);
authRouter.post(
  '/request-password-reset',
  validate({ body: sendVerificationLinkSchema }),
  sendResetPasswordEmail,
);
authRouter.post(
  '/reset-password',
  validate({ body: resetPassswordSchema }),
  resetPassword,
);

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = req.user as any;

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

export default authRouter;
