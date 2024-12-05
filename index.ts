import dotenv from "dotenv";
import express, { Application, NextFunction } from "express";
import cors from "cors";
import { Request, Response } from "express";
dotenv.config();
import userRouter from "./routers/userRouter";
import articleRouter from "./routers/articleRouter";
import commentRouter from "./routers/commentRouter";
import responseHandler from "./utils/responseHandler";

const PORT = process.env.PORT;

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response): any => {
  return res.status(200).send("<h1>BLOG APP</h1>");
});

app.use("/user", userRouter);
app.use("/post", articleRouter);
app.use("/comments", commentRouter);

// Error Handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  responseHandler.error(res, error.message, error.error, error.rc);
});

app.listen(PORT, () => {
  console.log("API RUNNING", PORT);
});
