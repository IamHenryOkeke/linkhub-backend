import { Router } from 'express';
import { validate } from '../middlewares/validation';
import { isAuthenticated } from '../middlewares/authMiddlewares';
import {
  createUserLink,
  deleteCurrentUserLink,
  getCurrentUserLinkByLinkId,
  getCurrentUserLinks,
  updateCurrentUserLink,
} from '../controllers/link.controllers';
import {
  createLinkSchema,
  linkParamSchema,
  updateLinkSchema,
} from '../utils/schemas';
import { upload } from '../config/multer';
import { addFilePathToBody } from '../middlewares/addFilePathToBody';

const linkRouter = Router();

linkRouter.use(isAuthenticated);

linkRouter.get('/', getCurrentUserLinks);

linkRouter.post(
  '/',
  upload.single('imageUrl'),
  addFilePathToBody('imageUrl'),
  validate({ body: createLinkSchema }),
  createUserLink,
);

linkRouter.get(
  '/:linkId',
  validate({ params: linkParamSchema }),
  getCurrentUserLinkByLinkId,
);

linkRouter.put(
  '/:linkId',
  validate({ params: linkParamSchema, body: updateLinkSchema }),
  updateCurrentUserLink,
);

linkRouter.delete(
  '/:linkId',
  validate({ params: linkParamSchema }),
  deleteCurrentUserLink,
);

export default linkRouter;
