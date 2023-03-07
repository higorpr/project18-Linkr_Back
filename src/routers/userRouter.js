import { Router } from "express";
import {
	followUser,
	getFollowedUsers,
	getUserFollows,
	getUserLinks,
	unfollowUser,
	getUserProfile,
} from "../controllers/userController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const userRouter = Router();
userRouter.get("/user:id?:lastPost?:firstPost?", getUserLinks);
userRouter.post("/follow/:id", tokenValidation, followUser);
userRouter.get("/following/:id", tokenValidation, getUserFollows);
userRouter.delete("/unfollow/:id", tokenValidation, unfollowUser);
userRouter.get("/followeds", tokenValidation, getFollowedUsers);
userRouter.get("/user/profile/:id", tokenValidation, getUserProfile);

export default userRouter;
