import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class FollowController {
  async followUser(req: Request, res: Response): Promise<any> {
    try {
      const { userIdToFollow, userId } = req.body;
      const userToFollow = await prisma.user.findUnique({
        where: { id: parseInt(userIdToFollow) },
      });

      if (!userToFollow) {
        return res.status(404).send({
          message: "User Not Found",
          success: false,
        });
      }

      if (userId === userIdToFollow) {
        return res.status(404).send({
          message: "You cannot follow yourself",
          success: false,
        });
      }

      const follow = await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: parseInt(userIdToFollow),
        },
      });

      return res.status(200).send({
        message: "Successfully followerd user",
        success: true,
        result: follow,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({
        message: "Error following user",
        success: false,
        error: error.message,
      });
    }
  }

  async unfollowUser(req: Request, res: Response): Promise<any> {
    try {
      const { userIdToUnfollow, userId } = req.body;

      const unfollow = await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: parseInt(userIdToUnfollow),
          },
        },
      });
      return res.status(200).send({
        message: "Successfully unfollowed user",
        success: true,
        result: unfollow,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({
        message: "Error following user",
        success: false,
        error: error.message,
      });
    }
  }
}
