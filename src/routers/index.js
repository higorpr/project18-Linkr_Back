import { Router } from "express";
import postsRouter from "./postsRouter.js";
import publishRouter from "./publishRoute.js";
import searchRouter from "./search.js";
import authRouter from "./authRouter.js";
import likeRouter from "./likeRouter.js";

const router = Router();

router.use(authRouter);
router.use(publishRouter);
router.use(postsRouter);
router.use(searchRouter);
router.use(likeRouter);

export default router;
