import { Router } from "express";
import { publishLink } from "../controllers/publishController.js";
import { linkValidation } from "../middlewares/publishValidation.js";

const publishRouter = Router();

publishRouter.post("/publish",linkValidation,publishLink);


export default publishRouter;