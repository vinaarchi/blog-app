import { Router } from "express";
import { FollowController } from "../controllers/follower.controllers";

export class FollowRouter {
  private route: Router;
  private followController: FollowController;

  constructor() {
    this.followController = new FollowController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", this.followController.followUser);
    this.route.post("/unfollow", this.followController.unfollowUser);
  }

  public getRouter(): Router {
    return this.route;
  }
}
