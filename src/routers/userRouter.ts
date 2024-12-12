import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken";
import { regisValidation } from "../middleware/validator";
import { uploader, uploaderMemory } from "../middleware/uploader";

export class UserRouter {
  private route: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/register", regisValidation, this.userController.register);
    this.route.post("/login", this.userController.login);
    this.route.get("/keep-login", verifyToken, this.userController.keepLogin);
    this.route.patch("/verify", verifyToken, this.userController.verifyUser);
    // this.route.patch(
    //   "/photo-profile",
    //   verifyToken,
    //   uploader("/profile", "PRF").single("imgProfile"),
    //   this.userController.updatePhotoProfile
    // );
    this.route.patch(
      "/photo-profile",
      verifyToken,
      uploaderMemory().single("imgProfile"),
      this.userController.updatePhotoProfile
    );
    // kalau mau upload hanya 1 file pakai .single, jika ingin lebih pakai .array

    this.route.post("/forgot-password", this.userController.forgotPassword);
    this.route.patch(
      "/reset-password",
      verifyToken,
      this.userController.resetPassword
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
