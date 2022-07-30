import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";

import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import recommendationRouter from "./routers/recommendationRouter.js";

const app = express();
app.use(cors());
app.use(json());
app.use(morgan("dev"));

app.use("/recommendations", recommendationRouter);
app.use(errorHandlerMiddleware);

export default app;
