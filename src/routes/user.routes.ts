import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares';
import {
  deleteCurrentUser,
  getCurrentUser,
  updateCurrentUser,
} from '../controllers/user.controllers';
import { validate } from '../middlewares/validation';
import { updateUserProfileSchema } from '../utils/schemas';
import { upload } from '../config/multer';
import { addFilePathToBody } from '../middlewares/addFilePathToBody';

const userRouter = Router();

userRouter.get('/profile', isAuthenticated, getCurrentUser);
userRouter.put(
  '/profile',
  isAuthenticated,
  upload.single('avatar'),
  addFilePathToBody('avatar'),
  validate({ body: updateUserProfileSchema }),
  updateCurrentUser,
);
userRouter.delete('/profile', isAuthenticated, deleteCurrentUser);

export default userRouter;
