import { Router } from 'express';
import { getUserPublicLink } from '../controllers/visitLink.controllers';

const visitLinkRouter = Router();

visitLinkRouter.get('/:shortCode', getUserPublicLink);

export default visitLinkRouter;
