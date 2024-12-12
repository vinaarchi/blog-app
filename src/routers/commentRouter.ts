import { Router } from "express";
import { CommentController } from "../controllers/comment.controllers";
import { verifyToken } from "../middleware/verifyToken";

export class CommentRouter {
  private route: Router;
  private commentController: CommentController;

  constructor() {
    this.commentController = new CommentController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", this.commentController.createComment);
    this.route.get("/:articleId", this.commentController.getArticleWithComment);
  }

  public getRouter(): Router {
    return this.route;
  }
}
