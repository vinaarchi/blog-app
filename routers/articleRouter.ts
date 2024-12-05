import { Router } from "express";
import {
  addArticle,
  deleteArticle,
  getArticle,
  getArticleById,
  updatedArticle,
} from "../controllers/article.controllers";
const route = Router();

route.get("/article", getArticle);
route.get("/article/:id", getArticleById);
route.post("/article", addArticle);
route.patch("/article/:id", updatedArticle);
route.delete("/article/:id", deleteArticle);

export default route;
