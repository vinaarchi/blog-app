import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getArticle = async (req: Request, res: Response) => {
  try {
    const article = await prisma.article.findMany();
    res.status(200).send({
      message: "Get All Article",
      success: true,
      result: article,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error get articles",
      success: false,
    });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
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
};

export const addArticle = async (req: Request, res: Response) => {
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
};

export const updatedArticle = async (req: Request, res: Response) => {
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
};

export const deleteArticle = async (req: Request, res: Response) => {
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
};
