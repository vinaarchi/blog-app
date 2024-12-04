import { NextFunction, Request, Response, Router } from "express";
import {
  register,
  login,
  keepLogin,
  updateProfile,
} from "../controllers/user.controller";
import { log } from "console";
import { verify } from "jsonwebtoken";
import { verifyToken } from "../middleware/verifyToken";
import { updatedArticle } from "../controllers/article.controllers";

const route = Router();

route.post("/register", register);
route.post("/login", login);
route.get("/keep-login", verifyToken, keepLogin);
route.patch("/update", verifyToken, updateProfile);

export default route;
