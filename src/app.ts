import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import responseHandler from "./utils/responseHandler";
import { UserRouter } from "./routers/userRouter";
import { ArticleRouter } from "./routers/articleRouter";
import { CommentRouter } from "./routers/commentRouter";
import { FollowRouter } from "./routers/followerRouter";
import path from "path";
import scheduleTask from "./cron/scheduleTask";
import redisClient from "./config/redis";

const PORT = process.env.PORT || 8080;

class App {
  readonly app: Application;

  constructor() {
    this.app = express();
    this.configure(); // ini Running Configure
    this.routes();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());

    //middleware for direct access directory
    this.app.use("/", express.static(path.join(__dirname, "../public")));
    // scheduleTask();
  }

  private routes(): void {
    const userRouter = new UserRouter();
    const articleRouter = new ArticleRouter();
    const commentRouter = new CommentRouter();
    const followRouter = new FollowRouter();
    this.app.get("/", (req: Request, res: Response): any => {
      return res.status(200).send("<h1>BLOG APP</h1>");
    });
    this.app.use("/user", userRouter.getRouter());
    this.app.use("/post", articleRouter.getRouter());
    this.app.use("/comments", commentRouter.getRouter());
    this.app.use("/follow", followRouter.getRouter());
  }

  private errorHandler(): void {
    (error: any, req: Request, res: Response, next: NextFunction) => {
      responseHandler.error(res, error.message, error.error, error.rc);
    };
  }

  public async start(): Promise<void> {
    await redisClient.connect(); // connect to redis
    this.app.listen(PORT, () => {
      console.log("API RUNNING", PORT);
    });
  }
}

export default App;
