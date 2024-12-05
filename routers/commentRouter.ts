import { Router } from "express";
import {
  createComment,
  getArticleWithComments,
} from "../controllers/comment.controllers";
import { verifyToken } from "../middleware/verifyToken";

const route = Router();

route.post("/", verifyToken, createComment);
route.get("/:articleId", getArticleWithComments);

export default route;
