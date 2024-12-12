import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import responseHandler from "../utils/responseHandler";
import redisClient from "../config/redis";

export class ArticleController {
  async getArticle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // 1. Check data in redis
      const redisData = await redisClient.get("article");
      // 2. if Exist, use data from redis as results for response
      if (redisData) {
        return responseHandler.success(
          res,
          "Get Article success",
          200,
          JSON.parse(redisData)
        );
      }

      // 3. if not exist, get data from database and store to redis

      const result = await prisma.article.findMany();
      await redisClient.setEx("article", 5, JSON.stringify(result));
      responseHandler.success(res, "Get Article Success", 200, result);
    } catch (error) {
      res.status(500).send({
        message: "Error get articles",
        success: false,
      });
    }
  }

  async getArticleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
        include: { comments: true },
      });
      res.status(200).send({
        message: "Success Get Article Details",
        success: true,
        result: article,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error Get Articles Details",
        success: false,
      });
    }
  }

  async addArticle(req: Request, res: Response) {
    try {
      const { title, content } = req.body;
      const article = await prisma.article.create({
        data: {
          title,
          content,
        },
      });
      res.status(200).send({
        message: "Article created successfully",
        success: true,
        result: article,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: " Error Creating Article",
        success: false,
      });
    }
  }

  async updatedArticle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const updatedPost = await prisma.article.update({
        where: { id: parseInt(id) },
        data: { title, content },
      });
      res.status(200).send({
        message: "Article Updated Successfully",
        success: true,
        result: updatedPost,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: " Error Updating Article",
        success: false,
      });
    }
  }

  async deleteArticle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedPost = await prisma.article.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).send({
        message: "Success deleting articles",
        success: true,
        result: deletedPost,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error deleting article",
        success: false,
      });
    }
  }
}
