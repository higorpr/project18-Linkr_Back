import { Router } from "express";
import { getPosts, timelineUpdate } from "../controllers/getPostsController.js";
import {
	getHashtagPosts,
	getShares,
	getUsersLiked,
	postShare,
	updatePostText,
} from "../controllers/postController.js";
import {
	checkHashtag,
	checkPostIdParameter,
	verifyShareUser,
} from "../middlewares/postMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const postsRouter = Router();

postsRouter.get("/posts:lastPost?:firstPost?", tokenValidation, getPosts);

postsRouter.get(
	"/posts/hashtag:hashtag?:lastPost?:firstPost?",
	tokenValidation,
	checkHashtag,
	getHashtagPosts
);

postsRouter.get("/timelineUpdate/:id", tokenValidation, timelineUpdate);

postsRouter.get("/posts/likes/:postId", checkPostIdParameter, getUsersLiked);
postsRouter.put("/posts/:postId", tokenValidation, updatePostText);
postsRouter.post(
	"/posts/shares/:postId",
	tokenValidation, //token validation
	checkPostIdParameter, // postId parameter validation
	verifyShareUser, // verifies if user has already shared post
	postShare // saves the share in table published_posts
);
postsRouter.get(
	"/posts/shares/:postId",
	checkPostIdParameter, // verifies the sent parameter and gets postId
	getShares
);

export default postsRouter;
