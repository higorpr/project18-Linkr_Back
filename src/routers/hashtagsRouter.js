import { Router } from "express";
import { getTrending10Hashtags } from "../controllers/hashtagsController.js";

const hashtagsRouter = Router();

hashtagsRouter.get("/trending", getTrending10Hashtags);

export default hashtagsRouter;