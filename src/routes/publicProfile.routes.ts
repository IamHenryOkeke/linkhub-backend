import { Router } from 'express';
import { getUserPublicProfile } from '../controllers/publicProfile.controllers';

const publicProfileRouter = Router();

publicProfileRouter.get('/:username', getUserPublicProfile);

export default publicProfileRouter;
