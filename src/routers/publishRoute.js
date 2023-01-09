import { Router } from "express";
import { deletePostFromBd, publishLink } from "../controllers/publishController.js";
import { linkValidation } from "../middlewares/publishValidation.js";

const publishRouter = Router();

publishRouter.post("/publish",linkValidation,publishLink);
publishRouter.delete("/post/:id", deletePostFromBd);


export default publishRouter;