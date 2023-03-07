import { Router } from "express";
import {
	deletePostFromBd,
	publishLink,
} from "../controllers/publishController.js";
import { linkValidation } from "../middlewares/publishValidation.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const publishRouter = Router();

publishRouter.post("/publish", tokenValidation, linkValidation, publishLink);
publishRouter.delete("/post/:id", deletePostFromBd);

export default publishRouter;
