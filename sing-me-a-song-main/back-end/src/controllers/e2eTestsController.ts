import { Request, Response } from "express";
import { recommendationService } from "../services/recommendationsService.js";

export async function deleteAllRecommendations(req: Request, res: Response) {
    await recommendationService.deleteAllRecommendations();
    res.sendStatus(200);
}
