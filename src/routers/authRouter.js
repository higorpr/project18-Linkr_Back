import { Router } from "express";
import { login } from "../controllers/authController.js";
import { loginValidation } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/login", loginValidation, login);

export default authRouter;
