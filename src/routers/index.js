import { Router } from "express";
import authRouter from "./authRouter.js";
import publishRouter from "./publishRoute.js"

const router = Router();

router.use(authRouter);
router.use(publishRouter);

export default router;
