import { Router } from "express"
import publishRouter from "./publishRoute.js"

const router = Router();

router.use(publishRouter);

export default router;