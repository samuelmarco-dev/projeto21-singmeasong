import { Router } from "express";
import { deleteAllRecommendations } from "../controllers/e2eTestsController.js";

const e2eTestsRouter = Router();

e2eTestsRouter.post("/reset", deleteAllRecommendations);

export default e2eTestsRouter;