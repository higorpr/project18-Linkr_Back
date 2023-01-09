import { Router } from "express";
import { searchUser } from "../controllers/searchController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const searchRouter = Router();

searchRouter.get("/search:text?", tokenValidation, searchUser);

export default searchRouter;
