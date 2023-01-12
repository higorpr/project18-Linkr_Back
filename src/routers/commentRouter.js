import { Router } from "express";
import { postComment } from "../controllers/commentController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const commentRouter = Router();

commentRouter.post("/posts/comment", tokenValidation, postComment );

export default commentRouter;
