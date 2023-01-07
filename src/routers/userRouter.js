import { Router } from "express";
import { getUserLinks } from "../controllers/userController.js";

const userRouter = Router();
userRouter.get("/user/:id", getUserLinks);


export default userRouter;