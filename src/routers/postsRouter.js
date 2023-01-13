import { Router } from "express";
import { getPosts, timelineUpdate } from "../controllers/getPostsController.js";
import {
	getHashtagPosts,
	getUsersLiked,
	updatePostText,
} from "../controllers/postController.js";
import { checkHashtag, checkPostIdParameter } from "../middlewares/postMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const postsRouter = Router();

postsRouter.get("/posts", tokenValidation, getPosts);
postsRouter.get("/timelineUpdate", timelineUpdate)
postsRouter.get("/posts/hashtag/:hashtag", tokenValidation, checkHashtag, getHashtagPosts);
postsRouter.get("/posts/likes/:postId", checkPostIdParameter, getUsersLiked);
postsRouter.put("/posts/:postId", tokenValidation, updatePostText);

export default postsRouter;
