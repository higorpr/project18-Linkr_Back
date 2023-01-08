import { Router } from "express";
import { postLike } from "../controllers/likeController.js";
import { likeAlreadyExists } from "../middlewares/likeMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const postsRouter = Router();

postsRouter.post(
	"/posts/:id/like",
	tokenValidation,
	likeAlreadyExists,
	postLike
);

export default postsRouter;
