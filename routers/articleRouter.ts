import { Router } from "express";
import {
  addArticle,
  deleteArticle,
  getArticle,
  getArticleById,
  updatedArticle,
} from "../controllers/article.controllers";
const route = Router();

route.get("/", getArticle);
route.get("/id", getArticleById);
route.post("/articles", addArticle);
route.patch("/:id", updatedArticle);
route.delete("/:id", deleteArticle);

export default route;
