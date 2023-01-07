import { Router } from "express"
import publishRouter from "./publishRoute.js"
import authRouter from "./authRouter.js";
import postsRouter from "./postsRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use(authRouter);
router.use(publishRouter);
router.use(postsRouter);
router.use(userRouter);

export default router;
