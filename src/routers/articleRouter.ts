import { Router } from "express";
import { ArticleController } from "../controllers/article.controllers";

export class ArticleRouter {
  private route: Router;
  private articleController: ArticleController;

  constructor() {
    this.articleController = new ArticleController();
    this.route = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.route.get("/article", this.articleController.getArticle);
    this.route.get("/article/:id", this.articleController.getArticleById);
    this.route.post("/article", this.articleController.addArticle);
    this.route.patch("/article/:id", this.articleController.updatedArticle);
    this.route.delete("/article/:id", this.articleController.deleteArticle);
  }

  public getRouter(): Router {
    return this.route;
  }
}
