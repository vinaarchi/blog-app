import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// export const addComment = async (req: Request, res: Response) => {
//   try {
//     const { articleId, content } = req.body;
//     const comment = await prisma.comment.create({
//       data: {
//         articleId: parseInt(articleId), // Menyimpan artikel yang sesuai
//         content: content, // Isi komentar
//       },
//     });

//     res.status(200).send({
//       message: "Comment added successfully",
//       success: true,
//       result: comment,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: "Error adding comment",
//       success: false,
//     });
//   }
// };

// ini gaperlu pakai token, jadi logic nya adalah, kalo mau comment harus punya akun
// jadi nnti di fe nya ketika user gapunya akun, tanda commentnya juga gaada

export const createComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { articleId, content } = req.body;
    const userId = res.locals.decript.id;
    console.log("INI LOG DATA :::::::::", articleId, content, userId);

    const newComment = await prisma.comment.create({
      data: { content, articleId: parseInt(articleId), userId },
    });

    return res.status(201).send({
      message: "Comment created successfully",
      success: true,
      result: newComment,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({
      message: "Error creating comment",
      success: false,
      error: error.message,
    });
  }
};

export const getArticleWithComments = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { articleId } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      include: {
        comments: {
          include: {
            user: { select: { id: true, fullname: true, username: true } },
          },
        },
      },
    });

    if (!article) {
      return res.status(404).send({
        message: "Post not found",
        success: false,
      });
    }

    return res.status(500).send({
      message: "Error fetching post with comments",
      success: true,
      result: article,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({
      message: "Error fetching article with comments",
      success: false,
      error: error.message,
    });
  }
};
