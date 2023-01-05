import { Router } from "express";
import postsRouter from "./postsRouter.js";
import publishRouter from "./publishRoute.js";

const router = Router();

router.use(publishRouter);
router.use(postsRouter);

export default router;
