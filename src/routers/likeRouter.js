import { Router } from "express";
import { postLike, removeLike } from "../controllers/likeController.js";
import { likeAlreadyExists } from "../middlewares/likeMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const likeRouter = Router();

likeRouter.delete("/posts/:id/like", tokenValidation, removeLike);
likeRouter.post(
	"/posts/:id/like",
	tokenValidation,
	likeAlreadyExists,
	postLike
);

export default likeRouter;
