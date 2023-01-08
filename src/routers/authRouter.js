import { Router } from "express";
import { login, logout, signUpControllers } from "../controllers/authController.js";
import { loginValidation, signUpMiddlewares } from "../middlewares/authMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const authRouter = Router();

authRouter.post("/login", loginValidation, login);
authRouter.post("/logout", tokenValidation, logout);
authRouter.post("/signup", signUpMiddlewares, signUpControllers);

export default authRouter;