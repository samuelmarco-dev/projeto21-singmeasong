import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import recommendationRouter from "./routers/recommendationRouter.js";
import e2eTestsRouter from "./routers/e2eTestsRouter.js";

const app = express();
app.use(cors());
app.use(json());
app.use(morgan("dev"));

app.use("/recommendations", recommendationRouter);
if(process.env.NODE_ENV === "test") {
    app.use("/recommendations", e2eTestsRouter);
}
app.use(errorHandlerMiddleware);

export default app;
