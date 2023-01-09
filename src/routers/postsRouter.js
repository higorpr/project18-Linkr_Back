import { Router } from "express";
import { getPosts } from "../controllers/getPostsController.js";
import {
	getHashtagPosts,
	getUsersLiked,
	updatePostText,
} from "../controllers/postController.js";
import { checkPostIdParameter } from "../middlewares/postMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const postsRouter = Router();

postsRouter.get("/posts", tokenValidation, getPosts);
postsRouter.get("/posts/:hashtag", getHashtagPosts);
postsRouter.get("/posts/likes/:postId", checkPostIdParameter, getUsersLiked);
postsRouter.put('/posts/:postId', tokenValidation, updatePostText)

export default postsRouter;
