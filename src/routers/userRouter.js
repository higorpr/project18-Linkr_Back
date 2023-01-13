import { Router } from "express";
import { followUser, getFollowedUsers, getUserFollows, getUserLinks, unfollowUser } from "../controllers/userController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const userRouter = Router();
userRouter.get("/user/:id", getUserLinks);
userRouter.post("/follow/:id", tokenValidation, followUser);
userRouter.get("/following/:id", tokenValidation, getUserFollows);
userRouter.delete("/unfollow/:id", tokenValidation, unfollowUser);
userRouter.get("/followeds", tokenValidation, getFollowedUsers);
 

export default userRouter;