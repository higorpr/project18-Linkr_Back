import { Router } from "express";
import { postComment } from "../controllers/commentController.js";
import { commentValidation } from "../middlewares/commentMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const commentRouter = Router();

commentRouter.post("/posts/comment", tokenValidation,commentValidation, postComment );

export default commentRouter;
