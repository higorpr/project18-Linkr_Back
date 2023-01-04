
import { Router } from 'express';
import { signUpControllers } from '../controllers/authControllers.js';
import { signUpMiddlewares } from '../middlewares/authMiddlewares.js';

const authRouter = Router();

authRouter.post('/signup', signUpMiddlewares, signUpControllers);

export default authRouter;