import { Router } from "express";
import { followUser, getUserLinks } from "../controllers/userController.js";

const userRouter = Router();
userRouter.get("/user/:id", getUserLinks);
userRouter.post("/follow/:id", followUser);
/*userRouter.get("/following", getUserFollows);
userRouter.delete("/unfollow/:id", unfollowUser);*/

export default userRouter;