import { Router } from "express";
import { login, logout } from "../controllers/authController.js";
import { loginValidation } from "../middlewares/authMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const authRouter = Router();

authRouter.post("/login", loginValidation, login);
authRouter.post("/logout", tokenValidation, logout);

export default authRouter;
