import { Router } from "express";
import { getPosts } from "../controllers/getPostsController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const postsRouter = Router();

postsRouter.get("/posts", tokenValidation, getPosts);

export default postsRouter;
