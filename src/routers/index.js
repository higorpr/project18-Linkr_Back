import { Router } from "express";
import postsRouter from "./postsRouter.js";
import publishRouter from "./publishRoute.js";
import searchRouter from "./search.js";

const router = Router();

router.use(publishRouter);
router.use(postsRouter);
router.use(searchRouter);

export default router;
