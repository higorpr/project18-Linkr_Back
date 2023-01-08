import { Router } from "express";
import { getPosts } from "../controllers/getPosts.js";
import {
	getHashtagPosts,
	getUsersLiked,
} from "../controllers/postController.js";
import { checkPostIdParameter } from "../middlewares/postMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const postsRouter = Router();

postsRouter.get("/posts", tokenValidation, getPosts);
postsRouter.get("/posts/:hashtag", getHashtagPosts);
postsRouter.get("/posts/likes/:postId", checkPostIdParameter, getUsersLiked);

export default postsRouter;
